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

```bash
docker compose up --build
```

起動後の URL:

- Web: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

## 開発用コマンド

```bash
pnpm dev
pnpm worker
pnpm lint
pnpm test
```

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
