-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "GenerateSource" AS ENUM ('AUTO', 'MANUAL');

-- CreateTable
CREATE TABLE "uuid_generation_attempts" (
    "id" BIGSERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "source" "GenerateSource" NOT NULL,
    "country_code" CHAR(2),
    "was_collision" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uuid_generation_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uuid_registry" (
    "uuid" UUID NOT NULL,
    "uuidstr" VARCHAR(36) NOT NULL,
    "first_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_source" "GenerateSource" NOT NULL,
    "seen_count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "uuid_registry_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE INDEX "uuid_generation_attempts_created_at_idx" ON "uuid_generation_attempts"("created_at" DESC);

-- CreateIndex
CREATE INDEX "uuid_generation_attempts_uuid_idx" ON "uuid_generation_attempts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "uuid_registry_uuidstr_key" ON "uuid_registry"("uuidstr");

-- CreateIndex
CREATE INDEX "uuid_registry_last_seen_at_idx" ON "uuid_registry"("last_seen_at" DESC);

-- CreateIndex
CREATE INDEX "uuid_registry_uuidstr_idx" ON "uuid_registry" USING GIN ("uuidstr" gin_trgm_ops);
