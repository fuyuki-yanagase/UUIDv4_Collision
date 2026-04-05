-- =============================================
-- Module: Prisma Migration
-- Description: UUIDv4 衝突観測アプリの初期スキーマを定義する。
-- =============================================

CREATE TABLE "uuid_registry" (
  "uuid" UUID NOT NULL,
  "first_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_source" TEXT NOT NULL,
  "seen_count" INTEGER NOT NULL DEFAULT 1,

  CONSTRAINT "uuid_registry_pkey" PRIMARY KEY ("uuid"),
  CONSTRAINT "uuid_registry_last_source_check" CHECK ("last_source" IN ('AUTO', 'MANUAL')),
  CONSTRAINT "uuid_registry_seen_count_check" CHECK ("seen_count" >= 1)
);

CREATE TABLE "uuid_generation_attempts" (
  "id" BIGSERIAL NOT NULL,
  "uuid" UUID NOT NULL,
  "source" TEXT NOT NULL,
  "was_collision" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "uuid_generation_attempts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "uuid_generation_attempts_source_check" CHECK ("source" IN ('AUTO', 'MANUAL'))
);

CREATE INDEX "uuid_registry_last_seen_at_idx"
  ON "uuid_registry" ("last_seen_at" DESC);

CREATE INDEX "uuid_generation_attempts_created_at_idx"
  ON "uuid_generation_attempts" ("created_at" DESC);

CREATE INDEX "uuid_generation_attempts_uuid_idx"
  ON "uuid_generation_attempts" ("uuid");
