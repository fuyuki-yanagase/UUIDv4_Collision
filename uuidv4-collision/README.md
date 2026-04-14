# UUIDv4 Collision Observatory

UUIDv4 を 1 秒ごとに PostgreSQL へ追加し、衝突が起きるかを観測する Next.js アプリです。  
画面は SSE でリアルタイム更新され、手動トリガーで追加イベントを増やせます。

## 構成

- `web`: Next.js 16。ダッシュボード表示、UUID 検索、手動追加 API、SSE 配信を担当
- `worker`: Node.js + `tsx`。1 秒ごとに UUIDv4 を生成して PostgreSQL へ保存
- `postgres`: UUID 一覧、生成履歴、衝突回数を保持

## 主な機能

- 1 秒ごとの UUIDv4 自動追加
- SSE によるリアルタイム更新
- 手動追加ボタン
- 直近の生成 UUID 一覧
- 生成済み UUID の部分一致検索
- 衝突回数、一意 UUID 数、総試行回数の可視化

## 追加すると良い機能案

- 最初の衝突までの予測時間や理論値の表示
- 1 分、1 時間、24 時間の生成レート表示
- 衝突が起きた瞬間の強調演出
- UUID の prefix 別ヒートマップ
- 検索結果の共有リンク

## 起動方法

まず `.env.example` を `.env` として複製し、値を埋めてください。

```bash
cp .env.example .env
```

開発用:

```bash
pnpm docker:up
```

本番用:

```bash
pnpm docker:prod:up
```

起動後の URL:

- Web: `http://localhost:43000`
- PostgreSQL: `localhost:45432`

## 開発用コマンド

```bash
pnpm dev
pnpm worker
pnpm lint
pnpm test
```

Docker の公開ポートを変更したい場合は `.env` の次の値を編集します。

`.env` の主な項目:

```env
WEB_PORT=43000
POSTGRES_PORT=45432
WORKER_INTERVAL_MS=1000
POSTGRES_DB=uuidv4_collision
POSTGRES_USER=postgres
POSTGRES_PASSWORD=change-this-password
DATABASE_URL=postgresql://postgres:change-this-password@localhost:45432/uuidv4_collision
DATABASE_URL_DOCKER=postgresql://postgres:change-this-password@postgres:5432/uuidv4_collision
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

本番公開では `docker-compose.prod.yml` を使ってください。こちらは `next dev` ではなく `next start` で起動するため、HMR 用の WebSocket に依存しません。
本番用 compose は `.env` が無いと起動しません。また PostgreSQL は `127.0.0.1` にのみ bind するため、外部へは直接公開されません。
開発用 compose も `.env` 必須です。`.env.example` は雛形なので、実運用前に `POSTGRES_PASSWORD` などの値を必ず入れ替えてください。

### Google Analytics / Search Console

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - Google Analytics 4 の Measurement ID
  - 例: `G-XXXXXXXXXX`
- `GOOGLE_SITE_VERIFICATION`
  - Google Search Console の HTML メタタグ検証用トークン

これらを設定すると、`app/layout.tsx` から次が自動で有効になります。

- Google Analytics 4 の `gtag.js`
- Search Console の `google-site-verification` メタタグ

本番サーバでは `.env` または compose の `environment` / `env_file` で注入してください。

## マイグレーション運用

このアプリは PostgreSQL を直接使っており、初期テーブル作成には `docker/postgres/init.sql` を使います。
ただし `init.sql` は空の DB ボリュームが作られた最初の 1 回しか実行されません。

そのため、既存 DB にカラムやインデックスを追加した場合は、必ず migration を別途実行してください。

### 新規 DB の場合

- `postgres-data` ボリュームが新規作成される
- `docker/postgres/init.sql` が自動で実行される
- 追加の手動 migration は通常不要

### 既存 DB の場合

- `docker/postgres/init.sql` を編集しても既存テーブルには反映されない
- `prisma/migrations` の SQL を適用する必要がある

### 基本コマンド

ローカルの Docker PostgreSQL に対して migration を適用する例:

```bash
pnpm db:docker:up
pnpm exec prisma migrate deploy
```

`DATABASE_URL` は `.env` を参照するため、ローカルでは通常そのままで実行できます。

### 直近の例

`country_code` 列を追加した変更では、既存 DB に対して次の migration が必要です。

```sql
ALTER TABLE "uuid_generation_attempts"
ADD COLUMN "country_code" CHAR(2);
```

対応するファイル:

- `prisma/migrations/202604060001_add_country_code_to_attempts/migration.sql`

Docker 経由で直接 SQL を流す場合:

```bash
pnpm db:docker:psql
```

その後に `psql` 上で:

```sql
ALTER TABLE "uuid_generation_attempts"
ADD COLUMN "country_code" CHAR(2);
```

### 推奨手順

スキーマ変更を含む更新では、次の順番を推奨します。

1. PostgreSQL を起動する
2. migration を適用する
3. web / worker を再起動する
4. 画面表示と `/api/stream` を確認する

本番サーバでも考え方は同じです。既存 DB を使い続ける限り、コード更新だけでは新しい列は生えません。

## データモデル

- `uuid_registry`
  - 一意な UUID の集合
  - `seen_count` で同一 UUID の観測回数を保持
- `uuid_generation_attempts`
  - すべての生成試行履歴
  - `was_collision` で衝突かどうかを記録

## 実装メモ

- 手動追加でも UUID 値はユーザ入力させず、必ずサーバ側で生成します
- SSE は PostgreSQL の `LISTEN/NOTIFY` を使って更新契機を受け取ります
- 初期テーブルは `docker/postgres/init.sql` で作成します

## その他メモ
- 国判定にはgeoIP2を使用
  - https://www.maxmind.com/en/home
