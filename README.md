# UUIDv4衝突観測所

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-111111?logo=nextdotjs)](./uuidv4-collision)
[![React](https://img.shields.io/badge/React-19.2.4-149ECA?logo=react&logoColor=white)](./uuidv4-collision)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?logo=postgresql&logoColor=white)](./uuidv4-collision)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](./uuidv4-collision)
[![Mantine](https://img.shields.io/badge/UI-Mantine-339AF0)](./uuidv4-collision)

UUIDv4 を毎秒生成し、PostgreSQL に記録し続けながら、本当に衝突が起きるかを観測するサイトです。  
Next.js がリアルタイム表示を担当し、別ワーカーが 1 秒ごとに UUIDv4 を追加します。

<!-- ![UUIDv4 Collision Observatory](./uuidv4-collision/public/uuidv4-collision-check-and-monitor.png) -->
<img src="./uuidv4-collision/public/uuidv4-collision-check-and-monitor.png" height=200>

## できること

- UUIDv4 の生成を 1 秒ごとに継続実行
- SSE によるリアルタイム更新
- 手動で 1 件だけ UUIDv4 を追加
- 直近 10 件の生成イベント表示
- 生成済み UUID の部分一致検索
- 衝突回数 / 一意 UUID 数 / 総試行回数の可視化
- GeoIP2 を使った手動追加元の国旗表示

## 技術スタック

- Frontend: Next.js 16, React 19, Mantine
- Backend: Next.js Route Handlers, Server-Sent Events
- Worker: Node.js + `tsx`
- Database: PostgreSQL 17
- Infra: Docker Compose, Nginx
- ORM / Migration: Prisma

## リポジトリ構成

```text
.
├── maintenance.html
├── uuidv4-collision/
│   ├── app/                  # Next.js App Router
│   ├── components/           # UI コンポーネント
│   ├── docker-compose.yml    # 開発用 Compose
│   ├── docker-compose.prod.yml
│   ├── prisma/               # Prisma schema / migrations
│   ├── public/               # favicon, OGP image
│   ├── scripts/              # UUID 追加ワーカー
│   └── README.md             # 詳細セットアップ
└── ...
```

## クイックスタート

```bash
cd uuidv4-collision
cp .env.example .env
pnpm docker:up
```

アクセス先:

- Web: `http://localhost:43000`
- PostgreSQL: `localhost:45432`

## 公開サイト

- `https://uuid-v4.fuyuki-connect.net/`

## 補足

- `maintenance.html` は Nginx 側のメンテナンス表示用です
- アプリ本体の詳細な構成、環境変数、運用手順は [uuidv4-collision/README.md](./uuidv4-collision/README.md) にまとめています
