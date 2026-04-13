"use client";

// =============================================
// Module: Dashboard Client
// Description: ダッシュボード全体の状態管理と主要コンポーネントの配置を担う。
// =============================================

import { Box, Container, Grid, Stack } from "@mantine/core";
import { startTransition, useDeferredValue, useEffect, useEffectEvent, useState } from "react";
import type { ReactElement } from "react";
import { MainPanel } from "@/components/dashboard/main-panel";
import { RecentUuids } from "@/components/dashboard/recent-uuids";
import { SearchUuid } from "@/components/dashboard/search-uuid";
import type { DashboardSnapshot, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

type DashboardClientProps = {
  initialSnapshot: DashboardSnapshot;
  initialSearchResults: UuidSearchResult[];
};

const DISPLAY_TIME_ZONE = "Asia/Tokyo";

/**
 * 概要: ブラウザが保持している優先言語一覧から 2 文字の国コードを推定する。
 * 引数: なし
 * 戻り値: string | null - ISO 3166-1 alpha-2 相当の国コード。判定不能なら null
 * 例外: Intl.Locale 非対応や不正ロケール時の例外は握りつぶして null を返す
 * 計算量: O(n)
 * 注意: `navigator.languages` の先頭から順に見て、`ja-JP` のようなロケールなら `JP` を返す。
 */
function inferCountryCodeFromBrowser(): string | null {
  if (typeof navigator === "undefined") {
    return null;
  }

  const localeCandidates = navigator.languages.length > 0 ? navigator.languages : [navigator.language];

  for (const localeCandidate of localeCandidates) {
    if (!localeCandidate) {
      continue;
    }

    try {
      const locale = new Intl.Locale(localeCandidate).maximize();
      const region = locale.region?.trim().toUpperCase() ?? null;

      if (region && /^[A-Z]{2}$/.test(region)) {
        return region;
      }
    } catch {
      const fallbackRegionCandidate = localeCandidate.split("-").at(-1)?.trim().toUpperCase() ?? null;

      if (fallbackRegionCandidate && /^[A-Z]{2}$/.test(fallbackRegionCandidate)) {
        return fallbackRegionCandidate;
      }
    }
  }

  return null;
}

/**
 * 目的: SSE、検索、手動追加をまとめて扱うダッシュボード UI の親になる。
 * 主要責務: 状態保持、リアルタイム更新、セクションコンポーネントへの props 配線
 * 使用例: app/page.tsx から初期スナップショットを受け取って描画する
 */
export function DashboardClient(props: DashboardClientProps): ReactElement {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(props.initialSnapshot);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UuidSearchResult[]>(props.initialSearchResults);
  const [isManualTriggerRunning, setIsManualTriggerRunning] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<"connecting" | "live" | "retrying">("connecting");
  const [manualTriggerMessage, setManualTriggerMessage] = useState<string>(
    "手動追加を押すと、ワーカーとは別に 1 件だけ UUIDv4 を追加できます。",
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const latestAttempt = snapshot.recentAttempts[0];
  const latestAttemptSummary = !latestAttempt
    ? "まだ試行履歴はありません。ワーカーを起動すると、1 秒ごとに記録が積み上がります。"
    : latestAttempt.wasCollision
      ? `衝突発生。\n${latestAttempt.uuid} が再び観測されました。`
      : `最新 UUID は ${latestAttempt.uuid} です。\nいまのところ衝突は確認されていません。`;

  /**
   * 概要: SSE で受信したスナップショットを低優先度で反映する。
   * 引数: nextSnapshot: DashboardSnapshot - サーバから配信された最新状態
   * 戻り値: void
   * 例外: なし
   * 計算量: O(1)
   * 注意: startTransition を使い、入力中の体験を阻害しにくくする。
   */
  const handleIncomingSnapshot = useEffectEvent((nextSnapshot: DashboardSnapshot): void => {
    startTransition(() => {
      setSnapshot(nextSnapshot);
      setStreamStatus("live");
    });
  });

  /**
   * 概要: 検索結果を低優先度で反映する。
   * 引数: nextSearchResults: UuidSearchResult[] - API から返された検索結果
   * 戻り値: void
   * 例外: なし
   * 計算量: O(1)
   * 注意: タイピングの追従性を落とさないため transition を使う。
   */
  const applySearchResults = useEffectEvent((nextSearchResults: UuidSearchResult[]): void => {
    startTransition(() => {
      setSearchResults(nextSearchResults);
    });
  });

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    const handleDashboardEvent = (event: MessageEvent<string>): void => {
      const nextSnapshot = JSON.parse(event.data) as DashboardSnapshot;

      handleIncomingSnapshot(nextSnapshot);
    };

    eventSource.addEventListener("dashboard", handleDashboardEvent as EventListener);
    eventSource.onerror = () => {
      setStreamStatus("retrying");
    };

    return () => {
      eventSource.removeEventListener("dashboard", handleDashboardEvent as EventListener);
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    /**
     * 概要: 現在の検索語で検索 API を呼び出す。
     * 引数: なし
     * 戻り値: Promise<void>
     * 例外: fetch や JSON 変換の失敗は console へ記録する
     * 計算量: O(limit)
     * 注意: 中断済みリクエストの結果は UI に反映しない。
     */
    const runSearch = async (): Promise<void> => {
      setIsSearchLoading(true);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(deferredSearchQuery)}&limit=8`,
          {
            method: "GET",
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const payload = (await response.json()) as {
          results: UuidSearchResult[];
        };

        applySearchResults(payload.results);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearchLoading(false);
        }
      }
    };

    void runSearch();

    return () => {
      abortController.abort();
    };
  }, [deferredSearchQuery]);

  /**
   * 概要: 手動追加 API を呼び出し、UUID 生成イベントを 1 回だけ実行する。
   * 引数: なし
   * 戻り値: Promise<void>
   * 例外: fetch 失敗時はエラー表示文言へ反映する
   * 計算量: O(1 + recentLimit)
   * 注意: SSE を待たず、レスポンスに含まれる snapshot で即座に更新する。
   */
  const handleManualTrigger = async (): Promise<void> => {
    setIsManualTriggerRunning(true);

    try {
      const countryCode = inferCountryCodeFromBrowser();
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: countryCode
          ? {
              "X-Country-Code": countryCode,
            }
          : undefined,
      });

      if (!response.ok) {
        throw new Error("Manual trigger request failed.");
      }

      const payload = (await response.json()) as {
        attempt: UuidAttempt;
        snapshot: DashboardSnapshot;
      };

      startTransition(() => {
        setSnapshot(payload.snapshot);
        setManualTriggerMessage(
          payload.attempt.wasCollision
            ? `手動追加で衝突しました: ${payload.attempt.uuid}`
            : `手動追加で新規 UUID を保存しました: ${payload.attempt.uuid}`,
        );
      });
    } catch (error) {
      console.error(error);
      setManualTriggerMessage("手動追加に失敗しました。コンテナと DB の状態を確認してください。");
    } finally {
      setIsManualTriggerRunning(false);
    }
  };

  return (
    <Box py={{ base: 36, md: 56 }}>
      <Container size={1240}>
        <Stack gap={32}>
          <MainPanel
            latestAttemptSummary={latestAttemptSummary}
            snapshot={snapshot}
            showMetrics={false}
          />

          <Grid gap={{ base: 32, lg: 40 }} align="start">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Stack gap={32}>
              <MainPanel
                latestAttemptSummary={latestAttemptSummary}
                snapshot={snapshot}
                showHero={false}
              />

              <Box hiddenFrom="lg">
                <RecentUuids
                  recentAttempts={snapshot.recentAttempts}
                  manualTriggerMessage={manualTriggerMessage}
                  streamStatus={streamStatus}
                  latestAttemptAt={snapshot.stats.latestAttemptAt}
                  isManualTriggerRunning={isManualTriggerRunning}
                  onManualTrigger={() => {
                    void handleManualTrigger();
                  }}
                  formatDateTime={formatDateTime}
                />
              </Box>

              <SearchUuid
                searchQuery={searchQuery}
                searchResults={searchResults}
                isSearchLoading={isSearchLoading}
                onSearchQueryChange={setSearchQuery}
                formatDateTime={formatDateTime}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Box visibleFrom="lg">
              <RecentUuids
                recentAttempts={snapshot.recentAttempts}
                manualTriggerMessage={manualTriggerMessage}
                streamStatus={streamStatus}
                latestAttemptAt={snapshot.stats.latestAttemptAt}
                isManualTriggerRunning={isManualTriggerRunning}
                onManualTrigger={() => {
                  void handleManualTrigger();
                }}
                formatDateTime={formatDateTime}
              />
            </Box>
          </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

/**
 * 概要: ISO 文字列を日本語向けの日時表記へ整形する。
 * 引数: value: string | null - ISO 8601 文字列
 * 戻り値: string - 表示用の日時文字列
 * 例外: なし
 * 計算量: O(1)
 * 注意: 時刻はサーバとクライアントの差を避けるため Asia/Tokyo 固定で整形する。
 */
function formatDateTime(value: string | null): string {
  if (!value) {
    return "未観測";
  }

  const formattedParts = new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: DISPLAY_TIME_ZONE,
  }).formatToParts(new Date(value));

  const partsMap = Object.fromEntries(
    formattedParts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${partsMap["year"]}/${partsMap["month"]}/${partsMap["day"]} ${partsMap["hour"]}:${partsMap["minute"]}:${partsMap["second"]}`;
}
