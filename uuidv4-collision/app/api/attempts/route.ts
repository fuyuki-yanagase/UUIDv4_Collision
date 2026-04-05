// =============================================
// Module: Attempts API
// Description: 手動トリガーによる UUIDv4 追加イベントを実行する。
// =============================================

import { getUuidGenerationService } from "@/lib/server/container";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 概要: 手動追加ボタンからのリクエストを受け、UUIDv4 を 1 件生成して保存する。
 * 引数: なし
 * 戻り値: Promise<Response> - 追加した試行情報と最新スナップショット
 * 例外: DB 保存失敗時は 500 応答になる
 * 計算量: O(1 + recentLimit)
 * 注意: ユーザは UUID 値を指定できず、サーバ側でのみ生成する。
 */
export async function POST(): Promise<Response> {
  const uuidGenerationService = getUuidGenerationService();
  const attempt = await uuidGenerationService.recordGeneratedAttempt("MANUAL");
  const snapshot = await uuidGenerationService.getDashboardSnapshot(12);

  return Response.json({
    attempt,
    snapshot,
  });
}
