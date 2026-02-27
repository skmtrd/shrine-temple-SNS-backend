# RLS ポリシー設計レビュー

生成ファイル:
- `migrations/0001_rls_functions.sql` — 補助関数定義
- `migrations/0002_minor_caretaker.sql` — RLS有効化 & ポリシー定義

---

## 補助関数

### `is_admin()`

```sql
SELECT EXISTS (SELECT 1 FROM "users" WHERE id = auth.uid() AND role = '運営');
```

| 項目 | 評価 |
|---|---|
| SECURITY DEFINER | ✅ RLSをバイパスして安全に参照できる |
| search_path 未固定 | ❌ **重大** `SET search_path = ''` が未設定。schema injection 攻撃のリスクがある。本番前に修正必須 |
| パフォーマンス | ❌ **中** RLSは行ごとに評価されるため、1クエリで1000行を走査すると1000回実行される。本番規模では JWT Custom Claims への移行を検討すべき |
| role の文字列比較 | ⚠️ タイポ（'運営' → '運 営'等）が実行時まで検知されない。enum型またはcheck制約を推奨 |

---

### `is_temple_official(target_temple_id int)`

```sql
SELECT EXISTS (SELECT 1 FROM "temple_officials"
  WHERE user_id = auth.uid() AND temple_id = target_temple_id AND status = '承認済');
```

| 項目 | 評価 |
|---|---|
| SECURITY DEFINER | ✅ |
| search_path 未固定 | ❌ **重大** 同上 |
| パフォーマンス | ❌ **中** `temple_officials(user_id, temple_id, status)` の複合インデックスが未作成。全件スキャンになる |
| status = '承認済' | ⚠️ `is_admin()` 同様、文字列依存。'承認済み'との誤記が検知されない |

---

## テーブル別ポリシー評価

### users

| ポリシー | 操作 | ロール | 評価 |
|---|---|---|---|
| users_select_public | SELECT | public | ✅ |
| users_update_self | UPDATE | authenticated | ✅ using & withCheck 両方設定済み |
| users_admin_all | ALL | authenticated | ⚠️ INSERT が含まれる。運営がユーザーを任意作成できるが、意図的か不明 |
| **INSERT ポリシーなし** | INSERT | — | ❌ **重大** Supabase Auth 経由の新規ユーザー登録が `service_role` 前提になる。backend API が `authenticated` ロールで直接 INSERT する場合、すべて拒否される。ユーザー登録フロー次第で致命的 |

---

### temple_officials

| ポリシー | 操作 | ロール | 評価 |
|---|---|---|---|
| temple_officials_select_own | SELECT | authenticated | ✅ |
| temple_officials_insert_own | INSERT | authenticated | ✅ |
| temple_officials_update_pending | UPDATE | authenticated | ❌ **重大** `using` に `status = '申請中'` はあるが、`withCheck` は `user_id = auth.uid()` のみ。**申請者が自分で status を '承認済' に書き換えられる。** withCheck に `status = '申請中'` を追加すべき |
| temple_officials_admin_all | ALL | authenticated | ✅ |
| **寺社公式による閲覧なし** | SELECT | — | ⚠️ 担当寺社の申請者情報を寺社公式が確認できない。管理フローとして問題になる可能性あり（仕様書通りではあるが） |

---

### temples

| ポリシー | 操作 | ロール | 評価 |
|---|---|---|---|
| temples_select_public | SELECT | public | ✅ |
| temples_update_official | UPDATE | authenticated | ⚠️ INSERT / DELETE ポリシーがない。寺社の新規追加・削除は `service_role` または運営のみになるが意図が不明瞭 |
| temples_admin_all | ALL | authenticated | ✅ |

---

### temple_aliases / temple_facilities

| ポリシー | 評価 |
|---|---|
| SELECT public | ✅ |
| UPDATE official | ✅ |
| **INSERT / DELETE ポリシーなし** | ⚠️ aliases や facilities の追加・削除ができない（`temples` 同様）。運営のみ `admin_all` で対応可能だが、寺社公式が追加・削除できない。仕様書上の記載が曖昧 |
| admin_all | ✅ |

---

### temple_edit_requests

| ポリシー | 評価 |
|---|---|
| select_requester | ✅ |
| select_official | ✅ |
| insert_own | ✅ |
| update_official | ⚠️ DELETE ポリシーなし。不要になった提案の削除ができない（意図的か？） |
| admin_all | ✅ |
| **permissive の重複 SELECT** | ✅ `select_requester` OR `select_official` として機能する（PostgreSQL permissive の正しい動作） |

---

### visit_histories

| ポリシー | 評価 |
|---|---|
| 全ポリシー | ✅ 仕様書通り完全 |

---

### visit_photos

| ポリシー | 評価 |
|---|---|
| INSERT/UPDATE/DELETE の EXISTS サブクエリ | ⚠️ **パフォーマンス** 毎行評価で `visit_histories` への JOIN が発生。`visit_histories(id)` は PK なので問題は小さいが、大量 INSERT 時は注意 |
| 設計上の問題 | ⚠️ `visit_photos` に直接 `user_id` を持たせれば、サブクエリ不要になる。スキーマ設計の再考を推奨 |
| admin_all | ✅ |

---

### temple_news

| ポリシー | 評価 |
|---|---|
| INSERT/UPDATE/DELETE official | ✅ |
| admin_all | ✅ |
| **未ログインによる SELECT** | ✅ 公開ニュースとして適切 |

---

### comments / likes / bookmarks

| ポリシー | 評価 |
|---|---|
| comments の UPDATE なし | ⚠️ コメント編集が誰もできない。意図的なら明記が必要 |
| likes の UPDATE なし | ✅ いいねはトグルなので INSERT / DELETE で十分 |
| bookmarks の UPDATE なし | ✅ 同上 |
| admin_all | ✅ |

---

### follows

| ポリシー | 評価 |
|---|---|
| follower_id を使用 | ✅ 仕様書通り |
| UPDATE なし | ✅ フォローはトグル操作なので適切 |

---

### pilgrimage_routes

| ポリシー | 評価 |
|---|---|
| select_public (`is_public = true`) | ✅ |
| select_own | ✅ 非公開ルートを作成者が閲覧可能 |
| insert_own (`type = 'ユーザー'`) | ⚠️ `type` の制約が `withCheck` のみ。'ユーザー' 以外のルートを一般ユーザーが作れないのは正しいが、フロントエンドで `type` を送信しない場合に silent fail になる |
| admin_all | ✅ |

---

### route_temples

| ポリシー | 評価 |
|---|---|
| EXISTS サブクエリ（2箇所） | ⚠️ **パフォーマンス** SELECT/INSERT/DELETE のたびに `pilgrimage_routes` への JOIN が発生。`pilgrimage_routes(id)` は PK なので許容範囲だが、`route_temples` が大量になると課題 |
| UPDATE ポリシーなし | ⚠️ ルート内の寺社順番変更などができない。意図的かどうか不明 |

---

### user_pilgrimages / pilgrimage_impressions

| ポリシー | 評価 |
|---|---|
| SELECT public | ✅ |
| INSERT/UPDATE own | ✅ |
| admin_all | ✅ |
| **pilgrimage_impressions の DELETE なし** | ⚠️ 感想の削除ができない。意図的かどうか不明 |
| **user_pilgrimages の DELETE なし** | ⚠️ 巡礼の取り消しができない。意図的かどうか不明 |

---

### badges / user_badges

| ポリシー | 評価 |
|---|---|
| SELECT public | ✅ |
| admin_all のみ | ✅ バッジ付与をシステム（service_role）か運営が行う設計として適切 |
| **user_badges の INSERT なし（authenticated）** | ✅ 意図通り（バッジはユーザー自身で取得できない） |

---

### reports

| ポリシー | 評価 |
|---|---|
| select_own | ✅ |
| insert_own | ✅ |
| **UPDATE / DELETE ポリシーなし** | ⚠️ 通報者が誤った通報を取り消せない。admin_all で運営が対応できるが、ユーザー自身による取り消しは不可 |
| admin_all | ✅ |

---

## 重大度別サマリ

### ❌ 要修正（リリース前に対処すべき）

1. **`is_admin()` / `is_temple_official()` の `search_path` 未固定**
   → 関数定義に `SET search_path = ''` を追加、テーブル参照を `public."users"` のように修飾する

2. **`temple_officials_update_pending` の `withCheck` 脆弱性**
   → 申請者が自分で `status` を `'承認済'` に変更できる。
   → `withCheck: sql\`user_id = (select auth.uid()) AND status = '申請中'\`` に修正する

3. **`users` テーブルの INSERT ポリシー欠落**
   → 新規ユーザー登録フローが `service_role` 必須になる。
   → 登録フローを確認し、必要なら `withCheck: sql\`id = (select auth.uid())\`` を追加

### ⚠️ 要検討（仕様確認後に対処）

4. `comments` に UPDATE ポリシーなし（コメント編集不可）
5. `route_temples` に UPDATE ポリシーなし（寺社順変更不可）
6. `user_pilgrimages` / `pilgrimage_impressions` に DELETE ポリシーなし
7. `temple_aliases` / `temple_facilities` に INSERT/DELETE ポリシーなし（寺社公式が追加・削除不可）
8. `temple_edit_requests` に DELETE ポリシーなし

### 📉 パフォーマンス（規模拡大前に対処）

9. `is_admin()` / `is_temple_official()` の行ごと評価 → JWT Custom Claims への移行を検討
10. `visit_photos` / `route_temples` の EXISTS サブクエリ → 複合インデックス追加 or スキーマ見直し
11. `temple_officials(user_id, temple_id, status)` の複合インデックス未作成
