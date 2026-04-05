// =============================================
// Module: UUID Worker
// Description: 1 秒ごとに UUIDv4 を生成し PostgreSQL へ保存する常駐ワーカー。
// =============================================

import { setTimeout as sleep } from "timers/promises";
import { getPostgresPool } from "@/lib/server/database";
import { getUuidGenerationService } from "@/lib/server/container";

const DEFAULT_INTERVAL_MS = 1000;
const MAXIMUM_RETRY_DELAY_MS = 5000;

/**
 * 目的: Docker 上で常駐し、UUIDv4 を継続生成して DB へ蓄積する。
 * 主要責務: DB 起動待機、一定間隔での追加、エラー時の再試行
 * 使用例: `pnpm worker` で起動する
 */
class UuidWorker {
  private readonly uuidGenerationService = getUuidGenerationService();

  private readonly intervalMs: number;

  /**
   * 概要: ワーカーを生成する。
   * 引数: intervalMs: number - 生成間隔ミリ秒
   * 戻り値: UuidWorker - 構築済みワーカー
   * 例外: intervalMs が 1 未満の場合は Error を送出する
   * 計算量: O(1)
   * 注意: 高頻度化したい場合でも、まず DB と UI の負荷を見てから調整する。
   */
  public constructor(intervalMs: number) {
    if (!Number.isInteger(intervalMs) || intervalMs < 1) {
      throw new Error("intervalMs must be a positive integer.");
    }

    this.intervalMs = intervalMs;
  }

  /**
   * 概要: DB が利用可能になるまで待機し、その後に常駐ループを開始する。
   * 引数: なし
   * 戻り値: Promise<void>
   * 例外: なし
   * 計算量: 実行時間に依存
   * 注意: 個別試行の失敗ではプロセスを落とさず、次の周期へ進む。
   */
  public async run(): Promise<void> {
    await this.waitForDatabase();

    while (true) {
      try {
        const attempt = await this.uuidGenerationService.recordGeneratedAttempt("AUTO");
        console.log(
          `[worker] stored uuid=${attempt.uuid} source=${attempt.source} collision=${attempt.wasCollision}`,
        );
      } catch (error) {
        console.error("[worker] failed to store uuid attempt", error);
      }

      await sleep(this.intervalMs);
    }
  }

  /**
   * 概要: PostgreSQL へ接続できるまで指数的に近い緩やかな再試行を行う。
   * 引数: なし
   * 戻り値: Promise<void>
   * 例外: なし
   * 計算量: DB 起動完了までの試行回数に依存
   * 注意: docker compose の depends_on だけでは接続受付完了を保証できないため、明示待機する。
   */
  private async waitForDatabase(): Promise<void> {
    const postgresPool = getPostgresPool();
    let retryDelayMs = 1000;

    while (true) {
      try {
        await postgresPool.query("SELECT 1");
        console.log("[worker] database connection established");
        return;
      } catch (error) {
        console.error("[worker] database is not ready yet", error);
        await sleep(retryDelayMs);
        retryDelayMs = Math.min(retryDelayMs + 1000, MAXIMUM_RETRY_DELAY_MS);
      }
    }
  }
}

/**
 * 概要: 環境変数からワーカー周期を読み取り、安全な既定値へ丸める。
 * 引数: なし
 * 戻り値: number - 実際に使う周期ミリ秒
 * 例外: なし
 * 計算量: O(1)
 * 注意: 不正値の場合は 1000ms を採用する。
 */
function resolveIntervalMs(): number {
  const parsedInterval = Number(process.env["WORKER_INTERVAL_MS"] ?? DEFAULT_INTERVAL_MS);

  if (!Number.isInteger(parsedInterval) || parsedInterval < 1) {
    return DEFAULT_INTERVAL_MS;
  }

  return parsedInterval;
}

const uuidWorker = new UuidWorker(resolveIntervalMs());

void uuidWorker.run();
