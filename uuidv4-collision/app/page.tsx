// =============================================
// Module: Home Page
// Description: UUIDv4 衝突観測ダッシュボードの初期描画を行う。
// =============================================

import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { getUuidGenerationService } from "@/lib/server/container";
import type { ReactElement } from "react";

export const dynamic = "force-dynamic";

/**
 * 概要: ダッシュボードの初期スナップショットと初期検索結果を取得して描画する。
 * 引数: なし
 * 戻り値: Promise<JSX.Element> - ダッシュボード画面
 * 例外: DB 取得失敗時は Next.js のエラーハンドリングへ委譲する
 * 計算量: O(recentLimit + searchLimit)
 * 注意: 初期表示を速くするため、必要データは並列取得する。
 */
export default async function Home(): Promise<ReactElement> {
  const uuidGenerationService = getUuidGenerationService();
  const [initialSnapshot, initialSearchResults] = await Promise.all([
    uuidGenerationService.getDashboardSnapshot(10),
    uuidGenerationService.searchRegistries("", 8),
  ]);

  return (
    <DashboardClient
      initialSnapshot={initialSnapshot}
      initialSearchResults={initialSearchResults}
    />
  );
}
