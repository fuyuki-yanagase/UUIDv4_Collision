// =============================================
// Module: PostgreSQL Access
// Description: Next.js とワーカーで共有する PostgreSQL 接続を提供する。
// =============================================

import { Client, Pool, type PoolClient } from "pg";

declare global {
  var uuidCollisionPool: Pool | undefined;
}

/**
 * 概要: 共有 Pool を返し、開発時のホットリロードでも接続数の増殖を防ぐ。
 * 引数: なし
 * 戻り値: Pool - PostgreSQL へ接続するための共有コネクションプール
 * 例外: DATABASE_URL が未設定の場合は Error を送出する
 * 計算量: O(1)
 * 注意: Node.js ランタイム専用であり、Edge Runtime では利用しない。
 */
export function getPostgresPool(): Pool {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.uuidCollisionPool) {
    globalThis.uuidCollisionPool = new Pool({
      connectionString: databaseUrl,
    });
  }

  return globalThis.uuidCollisionPool;
}

/**
 * 概要: トランザクションや LISTEN 専用で使う単独接続クライアントを生成する。
 * 引数: なし
 * 戻り値: Client - 呼び出し側が connect/end を管理する PostgreSQL クライアント
 * 例外: DATABASE_URL が未設定の場合は Error を送出する
 * 計算量: O(1)
 * 注意: SSE では接続を長時間保持するため Pool ではなく Client を使う。
 */
export function createPostgresClient(): Client {
  const databaseUrl = process.env["DATABASE_URL"];

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new Client({
    connectionString: databaseUrl,
  });
}

/**
 * 概要: Pool からクライアントを借りて安全に処理し、終了後に必ず返却する。
 * 引数: callback: (client: PoolClient) => Promise<T> - 借用した接続で実行する処理
 * 戻り値: Promise<T> - callback の戻り値
 * 例外: callback 内の例外をそのまま伝播する
 * 計算量: callback に依存
 * 注意: 例外時でも release を実行し、接続リークを防ぐ。
 */
export async function withPoolClient<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const pool = getPostgresPool();
  const poolClient = await pool.connect();

  try {
    return await callback(poolClient);
  } finally {
    poolClient.release();
  }
}
