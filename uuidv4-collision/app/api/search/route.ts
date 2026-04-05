// =============================================
// Module: Search API
// Description: 生成済み UUID の検索結果を返す。
// =============================================

import { getUuidGenerationService } from "@/lib/server/container";
import { parsePositiveInteger } from "@/lib/shared/search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 概要: UUID の部分一致検索結果を JSON で返す。
 * 引数: request: Request - query と limit を含む HTTP リクエスト
 * 戻り値: Promise<Response> - 検索条件と検索結果を含む JSON レスポンス
 * 例外: DB 取得失敗時は 500 応答になる
 * 計算量: O(limit)
 * 注意: query が空文字の場合は最近観測した UUID 一覧を返す。
 */
export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const limit = parsePositiveInteger(requestUrl.searchParams.get("limit"), 8, 25);
  const rawQuery = requestUrl.searchParams.get("query");
  const uuidGenerationService = getUuidGenerationService();
  const results = await uuidGenerationService.searchRegistries(rawQuery, limit);

  return Response.json({
    query: rawQuery ?? "",
    results,
  });
}
