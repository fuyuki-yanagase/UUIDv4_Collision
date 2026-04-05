// =============================================
// Module: Dashboard API
// Description: 現在の統計と最近の UUID 試行一覧を返す。
// =============================================

import { getUuidGenerationService } from "@/lib/server/container";
import { parsePositiveInteger } from "@/lib/shared/search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 概要: ダッシュボード用スナップショットを JSON で返す。
 * 引数: request: Request - recent 件数を含む HTTP リクエスト
 * 戻り値: Promise<Response> - DashboardSnapshot を含む JSON レスポンス
 * 例外: DB 取得失敗時は 500 応答になる
 * 計算量: O(recentLimit)
 * 注意: recent は 1 以上 30 以下に制限する。
 */
export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const recentLimit = parsePositiveInteger(requestUrl.searchParams.get("recent"), 12, 30);
  const uuidGenerationService = getUuidGenerationService();
  const dashboardSnapshot = await uuidGenerationService.getDashboardSnapshot(recentLimit);

  return Response.json(dashboardSnapshot);
}
