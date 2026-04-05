// =============================================
// Module: UUID Attempt Repository
// Description: UUIDv4 試行履歴の永続化と集計取得を PostgreSQL 上で担う。
// =============================================

import type { PoolClient } from "pg";
import { getPostgresPool, withPoolClient } from "@/lib/server/database";
import { buildUuidSearchPattern } from "@/lib/shared/search";
import type { DashboardSnapshot, DashboardStats, GenerationSource, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

const DASHBOARD_CHANNEL = "uuid_dashboard_updates";

type AttemptRow = {
  id: string;
  uuid: string;
  source: GenerationSource;
  was_collision: boolean;
  created_at: Date;
};

type DashboardStatsRow = {
  total_attempts: string;
  total_collisions: string;
  latest_attempt_at: Date | null;
};

type UniqueStatsRow = {
  total_unique_uuids: string;
};

type SearchRow = {
  uuid: string;
  seen_count: number;
  collision_count: number;
  first_seen_at: Date;
  last_seen_at: Date;
  last_source: GenerationSource;
};

type RecordAttemptInput = {
  uuid: string;
  source: GenerationSource;
};

/**
 * 目的: UUIDv4 の登録、集計、検索を PostgreSQL に対して一元化する。
 * 主要責務: 試行履歴の保存、衝突検知、ダッシュボード用データ取得、検索
 * 使用例: API Route やワーカーから this.recordAttempt(...) を呼び出す
 */
export class PostgresUuidAttemptRepository {
  /**
   * 概要: UUID 試行を保存し、必要なら衝突として記録する。
   * 引数: input: RecordAttemptInput - 保存する UUID と発生源
   * 戻り値: Promise<UuidAttempt> - 保存後の試行レコード
   * 例外: PostgreSQL 接続や SQL 実行に失敗した場合は例外を送出する
   * 計算量: O(1)
   * 注意: uuid_registry への insert と attempt への履歴追加を同一トランザクションで行う。
   */
  public async recordAttempt(input: RecordAttemptInput): Promise<UuidAttempt> {
    return await withPoolClient(async (poolClient) => {
      await poolClient.query("BEGIN");

      try {
        const insertRegistryResult = await poolClient.query<{ uuid: string }>(
          `
            INSERT INTO uuid_registry (uuid, first_seen_at, last_seen_at, last_source, seen_count)
            VALUES ($1::uuid, NOW(), NOW(), $2, 1)
            ON CONFLICT (uuid) DO NOTHING
            RETURNING uuid::text AS uuid
          `,
          [input.uuid, input.source],
        );

        const wasCollision = insertRegistryResult.rowCount === 0;

        if (wasCollision) {
          await poolClient.query(
            `
              UPDATE uuid_registry
              SET last_seen_at = NOW(),
                  last_source = $2,
                  seen_count = seen_count + 1
              WHERE uuid = $1::uuid
            `,
            [input.uuid, input.source],
          );
        }

        const attemptResult = await poolClient.query<AttemptRow>(
          `
            INSERT INTO uuid_generation_attempts (uuid, source, was_collision, created_at)
            VALUES ($1::uuid, $2, $3, NOW())
            RETURNING id::text AS id, uuid::text AS uuid, source, was_collision, created_at
          `,
          [input.uuid, input.source, wasCollision],
        );

        await this.publishDashboardUpdate(poolClient);
        await poolClient.query("COMMIT");

        const storedAttempt = attemptResult.rows[0];

        return this.mapAttemptRow(storedAttempt);
      } catch (error) {
        await poolClient.query("ROLLBACK");
        throw error;
      }
    });
  }

  /**
   * 概要: ダッシュボード表示に必要な統計と最近の試行一覧を取得する。
   * 引数: recentLimit: number - recentAttempts として返す件数
   * 戻り値: Promise<DashboardSnapshot> - UI 表示用のスナップショット
   * 例外: PostgreSQL 接続や SQL 実行に失敗した場合は例外を送出する
   * 計算量: O(recentLimit)
   * 注意: 現在は低頻度更新を前提としており、集計は毎回 DB から取得する。
   */
  public async getDashboardSnapshot(recentLimit: number): Promise<DashboardSnapshot> {
    const postgresPool = getPostgresPool();

    const [dashboardStatsResult, uniqueStatsResult, recentAttemptsResult] = await Promise.all([
      postgresPool.query<DashboardStatsRow>(
        `
          SELECT
            COUNT(*)::text AS total_attempts,
            COUNT(*) FILTER (WHERE was_collision)::text AS total_collisions,
            MAX(created_at) AS latest_attempt_at
          FROM uuid_generation_attempts
        `,
      ),
      postgresPool.query<UniqueStatsRow>(
        `
          SELECT COUNT(*)::text AS total_unique_uuids
          FROM uuid_registry
        `,
      ),
      postgresPool.query<AttemptRow>(
        `
          SELECT id::text AS id, uuid::text AS uuid, source, was_collision, created_at
          FROM uuid_generation_attempts
          ORDER BY created_at DESC, id DESC
          LIMIT $1
        `,
        [recentLimit],
      ),
    ]);

    const dashboardStats = this.mapDashboardStatsRow(
      dashboardStatsResult.rows[0],
      uniqueStatsResult.rows[0],
    );

    return {
      stats: dashboardStats,
      recentAttempts: recentAttemptsResult.rows.map((row) => this.mapAttemptRow(row)),
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * 概要: UUID の部分一致検索結果を返す。
   * 引数: normalizedQuery: string - 正規化済みの検索語
   * 引数: limit: number - 返却件数上限
   * 戻り値: Promise<UuidSearchResult[]> - UUID 単位の集計結果
   * 例外: PostgreSQL 接続や SQL 実行に失敗した場合は例外を送出する
   * 計算量: O(limit)
   * 注意: query が空文字でも最近更新された UUID 一覧を返して探索しやすくする。
   */
  public async searchRegistries(normalizedQuery: string, limit: number): Promise<UuidSearchResult[]> {
    const searchPattern = buildUuidSearchPattern(normalizedQuery);
    const searchResult = await getPostgresPool().query<SearchRow>(
      `
        SELECT
          uuid::text AS uuid,
          seen_count,
          GREATEST(seen_count - 1, 0) AS collision_count,
          first_seen_at,
          last_seen_at,
          last_source
        FROM uuid_registry
        WHERE $1 = '' OR uuid::text ILIKE $2 ESCAPE '\\'
        ORDER BY last_seen_at DESC
        LIMIT $3
      `,
      [normalizedQuery, searchPattern, limit],
    );

    return searchResult.rows.map((row) => this.mapSearchRow(row));
  }

  /**
   * 概要: LISTEN 中の SSE クライアントへ更新通知を送る。
   * 引数: poolClient: PoolClient - 現在のトランザクションで使っている接続
   * 戻り値: Promise<void>
   * 例外: NOTIFY 実行失敗時は例外を送出する
   * 計算量: O(1)
   * 注意: payload には詳細を入れず、受信側が最新スナップショットを再取得する。
   */
  private async publishDashboardUpdate(poolClient: PoolClient): Promise<void> {
    await poolClient.query("SELECT pg_notify($1, $2)", [
      DASHBOARD_CHANNEL,
      JSON.stringify({
        updatedAt: new Date().toISOString(),
      }),
    ]);
  }

  /**
   * 概要: SQL の行データを API 返却用 Attempt 型へ変換する。
   * 引数: row: AttemptRow - PostgreSQL から受け取った生レコード
   * 戻り値: UuidAttempt - JSON へそのまま載せられる形の試行情報
   * 例外: id が安全な整数へ変換できない場合は Error を送出する
   * 計算量: O(1)
   * 注意: created_at は ISO 8601 文字列へ統一する。
   */
  private mapAttemptRow(row: AttemptRow): UuidAttempt {
    const parsedId = Number(row.id);

    if (!Number.isSafeInteger(parsedId)) {
      throw new Error("Attempt id exceeded Number.MAX_SAFE_INTEGER.");
    }

    return {
      id: parsedId,
      uuid: row.uuid,
      source: row.source,
      wasCollision: row.was_collision,
      createdAt: row.created_at.toISOString(),
    };
  }

  /**
   * 概要: 集計行を UI 用の DashboardStats へ変換する。
   * 引数: dashboardStatsRow: DashboardStatsRow - attempt 集計結果
   * 引数: uniqueStatsRow: UniqueStatsRow - registry 集計結果
   * 戻り値: DashboardStats - 画面表示に直接使える統計値
   * 例外: 数値変換に失敗した場合は Error を送出する
   * 計算量: O(1)
   * 注意: PostgreSQL の bigint 集計結果は text として受け取り、ここで number 化する。
   */
  private mapDashboardStatsRow(
    dashboardStatsRow: DashboardStatsRow,
    uniqueStatsRow: UniqueStatsRow,
  ): DashboardStats {
    return {
      totalAttempts: this.parseSafeInteger(dashboardStatsRow.total_attempts, "totalAttempts"),
      totalUniqueUuids: this.parseSafeInteger(uniqueStatsRow.total_unique_uuids, "totalUniqueUuids"),
      totalCollisions: this.parseSafeInteger(dashboardStatsRow.total_collisions, "totalCollisions"),
      latestAttemptAt: dashboardStatsRow.latest_attempt_at?.toISOString() ?? null,
    };
  }

  /**
   * 概要: 検索 SQL の行データを API 返却用の型へ変換する。
   * 引数: row: SearchRow - PostgreSQL から受け取った検索結果
   * 戻り値: UuidSearchResult - UI で直接描画できる検索結果
   * 例外: なし
   * 計算量: O(1)
   * 注意: collisionCount は seenCount - 1 を DB 側で計算済み。
   */
  private mapSearchRow(row: SearchRow): UuidSearchResult {
    return {
      uuid: row.uuid,
      seenCount: row.seen_count,
      collisionCount: row.collision_count,
      firstSeenAt: row.first_seen_at.toISOString(),
      lastSeenAt: row.last_seen_at.toISOString(),
      lastSource: row.last_source,
    };
  }

  /**
   * 概要: PostgreSQL 由来の数値文字列を安全な整数へ変換する。
   * 引数: rawValue: string - PostgreSQL から返る text 化された整数
   * 引数: fieldName: string - 例外文言に含めるフィールド名
   * 戻り値: number - 安全な JavaScript 整数
   * 例外: 数値変換や安全整数判定に失敗した場合は Error を送出する
   * 計算量: O(1)
   * 注意: 将来的に桁数が巨大化した場合は bigint ベースへ置き換える。
   */
  private parseSafeInteger(rawValue: string, fieldName: string): number {
    const parsedValue = Number(rawValue);

    if (!Number.isSafeInteger(parsedValue)) {
      throw new Error(`Unable to parse ${fieldName} safely.`);
    }

    return parsedValue;
  }
}

/**
 * 概要: SSE と書き込み側で共有する通知チャネル名を返す。
 * 引数: なし
 * 戻り値: string - PostgreSQL LISTEN/NOTIFY のチャネル名
 * 例外: なし
 * 計算量: O(1)
 * 注意: 文字列の散在を避けるため、この関数経由で公開する。
 */
export function getDashboardChannelName(): string {
  return DASHBOARD_CHANNEL;
}
