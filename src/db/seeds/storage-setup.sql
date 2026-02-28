-- ============================================================
-- Supabase Storage セットアップ
-- Supabase ダッシュボードの SQL エディタで実行する
-- ============================================================

-- ------------------------------------------------------------
-- registry-images バケット
-- 公式アカウント申請時の登記簿写真アップロード用
-- ------------------------------------------------------------

-- バケット作成（まだ存在しない場合）
INSERT INTO storage.buckets (id, name, public)
VALUES ('registry-images', 'registry-images', true)
ON CONFLICT (id) DO NOTHING;

-- 認証済みユーザーが自分のフォルダ（{userId}/...）にアップロード可能
CREATE POLICY "registry_images_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'registry-images'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 全員が閲覧可能（公開 URL 用）
CREATE POLICY "registry_images_select" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'registry-images');
