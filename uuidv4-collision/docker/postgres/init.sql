-- =============================================
-- Module: PostgreSQL Bootstrap
-- Description: UUIDv4 衝突観測サイトの初期テーブルと通知チャネルを用意する。
-- =============================================

CREATE TABLE IF NOT EXISTS uuid_registry (
  uuid UUID PRIMARY KEY,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_source TEXT NOT NULL CHECK (last_source IN ('AUTO', 'MANUAL')),
  seen_count INTEGER NOT NULL DEFAULT 1 CHECK (seen_count >= 1)
);

CREATE TABLE IF NOT EXISTS uuid_generation_attempts (
  id BIGSERIAL PRIMARY KEY,
  uuid UUID NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('AUTO', 'MANUAL')),
  country_code CHAR(2),
  was_collision BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS uuid_registry_last_seen_at_idx
  ON uuid_registry (last_seen_at DESC);

CREATE INDEX IF NOT EXISTS uuid_generation_attempts_created_at_idx
  ON uuid_generation_attempts (created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS uuid_generation_attempts_uuid_idx
  ON uuid_generation_attempts (uuid);
