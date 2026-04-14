# UUIDv4衝突観測所

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-111111?logo=nextdotjs)](.)
[![React](https://img.shields.io/badge/React-19.2.4-149ECA?logo=react&logoColor=white)](.)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white)](.)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](.)
[![Mantine](https://img.shields.io/badge/UI-Mantine-339AF0)](.)

UUIDv4 をひたすら生成し、衝突が起きる瞬間を観測・検索できるサイトです。  
UI は Next.js、生成ワーカーは Node.js、永続化は PostgreSQL で構成されています。

![UUIDv4 Collision Observatory](./public/uuidv4-collision-check-and-monitor.png)

## 概要

このアプリは、理論上ほぼ衝突しないとされる UUIDv4 を 1 秒ごとに生成し、実際に PostgreSQL に保存しながら観測する実験サイトです。

- ワーカーが UUIDv4 を毎秒生成
- Next.js が DB 状態を SSE でリアルタイム反映
- 手動追加で単発イベントも発火可能
- 検索で既存 UUID を部分一致検索可能
- GeoIP2 によって手動追加元の国を表示

## 主な機能

- 1 秒ごとの UUIDv4 自動追加
- SSE によるリアルタイム更新
- 手動追加ボタン
- 直近 10 件の生成イベント表示
- UUID の部分一致検索
- 試行回数 / 一意 UUID 数 / 衝突回数の可視化
- 日本語 / 英語 UI 切替
- OGP / favicon / GA4 / Search Console 対応

## 技術スタック

- Frontend: Next.js 16, React 19, Mantine
- API: Next.js Route Handlers
- Realtime: Server-Sent Events
- Worker: Node.js + `tsx`
- Database: PostgreSQL 17
- DB Access: `pg`
- Migration: Prisma
- Infra: Docker Compose, Nginx, GeoIP2

## アーキテクチャ

```text
worker
  -> UUIDv4 を 1 秒ごとに生成
  -> PostgreSQL へ保存
  -> NOTIFY

postgres
  -> uuid_generation_attempts
  -> uuid_registry

web
  -> 初期スナップショット取得
  -> /api/stream で LISTEN/NOTIFY を SSE 配信
  -> /api/attempts で手動追加
  -> /api/search で UUID 検索
```

## ディレクトリ構成

```text
app/                      Next.js App Router
components/dashboard/     ダッシュボード UI
components/util/          共通 UI 部品
lib/server/               DB / サービス / リクエスト処理
lib/shared/               共有型・共通処理
prisma/                   Prisma schema / migrations
scripts/                  UUID 生成ワーカー
docker-compose.yml        開発用 Compose
docker-compose.prod.yml   本番用 Compose
```

## セットアップ

まず `.env` を作成します。

```bash
cp .env.example .env
```

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

## 起動方法

### 開発用

```bash
pnpm docker:up
```

アクセス先:

- Web: `http://localhost:43000`
- PostgreSQL: `localhost:45432`

### 本番用

```bash
pnpm docker:prod:up
```

本番用 compose は `.env` 必須です。  
また PostgreSQL は `127.0.0.1` にのみ bind するため、外部へ直接公開されません。

## よく使うコマンド

```bash
pnpm dev
pnpm worker
pnpm lint
pnpm test
pnpm build
```

Docker:

```bash
pnpm docker:up
pnpm docker:down
pnpm docker:logs
pnpm docker:prod:up
pnpm docker:prod:down
pnpm db:docker:psql
pnpm db:prod:psql
```

## マイグレーション運用

既存 DB でスキーマを変更した場合は、コード更新だけでは反映されません。  
必ず migration を適用してください。

### 基本コマンド

```bash
pnpm db:docker:up
pnpm exec prisma migrate deploy
```

### 推奨手順

1. PostgreSQL を起動する
2. migration を適用する
3. web / worker を再起動する
4. 画面表示と `/api/stream` を確認する

## 環境変数

必須:

- `WEB_PORT`
- `POSTGRES_PORT`
- `WORKER_INTERVAL_MS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `DATABASE_URL_DOCKER`

任意:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `GOOGLE_SITE_VERIFICATION`

## Analytics / Search Console

`app/layout.tsx` で以下に対応しています。

- Google Analytics 4
- Google Search Console のメタタグ検証
- OGP / Twitter Card

`NEXT_PUBLIC_GA_MEASUREMENT_ID` を設定すると `gtag.js` が有効になります。  
`GOOGLE_SITE_VERIFICATION` を設定すると `google-site-verification` メタタグが出力されます。

## GeoIP2

手動追加時の国判定には GeoIP2 を使います。

- Nginx が `X-Country-Code` を upstream へ付与
- アプリはそのヘッダを最優先で採用
- fallback としてブラウザロケールも利用

参考:

- https://www.maxmind.com/en/home

## データモデル

### `uuid_registry`

- 一意な UUID の集合
- `uuidstr` を検索用文字列として保持
- `seen_count` で観測回数を保持

### `uuid_generation_attempts`

- すべての生成試行履歴
- `was_collision` で衝突判定を保持
- `country_code` で手動追加元の国を保持

## 実装メモ

- UUID 値は常にサーバ側で生成し、ユーザ入力は受け付けません
- SSE は PostgreSQL の `LISTEN/NOTIFY` を使います
- UUID 検索は `uuidstr` + trigram index で高速化しています
- UI は Mantine ベースで、主要タグは自作バッジコンポーネントへ寄せています

## 公開前メモ

- `.env` はコミットしない
- `.env.example` は雛形としてのみ使う
- `POSTGRES_PASSWORD` は必ず変更する
- 本番 compose の DB は外部へ直接公開しない
