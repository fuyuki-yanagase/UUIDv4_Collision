-- =============================================
-- Module: Prisma Migration
-- Description: 手動 UUID 追加イベントに国コードを保存できるようにする。
-- =============================================

ALTER TABLE "uuid_generation_attempts"
  ADD COLUMN "country_code" CHAR(2);
