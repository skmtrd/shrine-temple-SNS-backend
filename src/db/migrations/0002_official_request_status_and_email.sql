-- 既存データの status 値を enum に対応した英語表記に変換
UPDATE "temple_officials" SET "status" = 'pending' WHERE "status" = '申請中';
UPDATE "temple_officials" SET "status" = 'approved' WHERE "status" = '承認';
UPDATE "temple_officials" SET "status" = 'rejected' WHERE "status" = '却下';
--> statement-breakpoint
-- status 列を参照しているポリシーを一旦削除（型変換前に必要）
DROP POLICY IF EXISTS "temple_officials_update_pending" ON "temple_officials";
--> statement-breakpoint
CREATE TYPE "public"."official_request_status" AS ENUM('pending', 'rejected', 'approved');--> statement-breakpoint
ALTER TABLE "temple_officials" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."official_request_status";--> statement-breakpoint
ALTER TABLE "temple_officials" ALTER COLUMN "status" SET DATA TYPE "public"."official_request_status" USING "status"::"public"."official_request_status";--> statement-breakpoint
ALTER TABLE "temple_officials" ADD COLUMN "email" text NOT NULL DEFAULT '';--> statement-breakpoint
-- ポリシーを再作成
CREATE POLICY "temple_officials_update_pending" ON "temple_officials" AS PERMISSIVE FOR UPDATE TO authenticated USING (user_id = (select auth.uid()) AND status = 'pending') WITH CHECK (user_id = (select auth.uid()) AND status = 'pending');
