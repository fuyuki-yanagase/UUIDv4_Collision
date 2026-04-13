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
type DashboardLocale = "ja" | "en";

const COPY = {
  ja: {
    mainPanel: {
      heroTitle: "UUIDv4 の衝突を検証する\n毎秒ひたすら観測する",
      totalAttemptsLabel: "試行回数",
      totalAttemptsDescription: "これまでに生成して PostgreSQL に保存した総数",
      totalUniqueUuidsLabel: "一意 UUID 数",
      totalUniqueUuidsDescription: "まだ一度しか観測されていない UUID の累積",
      totalCollisionsLabel: "衝突回数",
      totalCollisionsDescription: "既出 UUID と一致したイベントの累積",
    },
    recent: {
      eyebrow: "Recent Attempts",
      title: "直近の生成イベント",
      description: "手動追加を押すと、ワーカーとは別に 1 件だけ UUIDv4 を追加できます。",
      lastObservedLabel: "最終観測",
      addOneLabel: "手動で 1 件追加",
      collisionLabel: "COLLISION",
      uniqueLabel: "UNIQUE",
    },
    search: {
      eyebrow: "UUID Search",
      title: "生成済み UUID を検索する",
      description: "部分一致でも探せます。空欄のままなら最近観測した UUID を表示します。",
      placeholder: "例: 6f8c8a32",
      searchingLabel: "Searching...",
      resultsLabel: "Results",
      itemsLabel: "items",
      observedLabel: "観測",
      collisionLabel: "衝突",
      firstSeenLabel: "初回",
      latestSeenLabel: "最新",
    },
    unobservedLabel: "未観測",
    latestAttemptNone: "まだ試行履歴はありません。ワーカーを起動すると、1 秒ごとに記録が積み上がります。",
    latestAttemptCollision: (uuid: string): string => `衝突発生。\n${uuid} が再び観測されました。`,
    latestAttemptUnique: (uuid: string): string => `最新 UUID は ${uuid} です。\nいまのところ衝突は確認されていません。`,
    manualTriggerSuccess: (uuid: string): string => `手動追加で新規 UUID を保存しました: ${uuid}`,
    manualTriggerCollision: (uuid: string): string => `手動追加で衝突しました: ${uuid}`,
    manualTriggerError: "手動追加に失敗しました。コンテナと DB の状態を確認してください。",
  },
  en: {
    mainPanel: {
      heroTitle: "Observing UUIDv4 collisions\nonce every second",
      totalAttemptsLabel: "Total Attempts",
      totalAttemptsDescription: "All UUIDs generated and stored in PostgreSQL so far",
      totalUniqueUuidsLabel: "Unique UUIDs",
      totalUniqueUuidsDescription: "Cumulative count of UUIDs seen only once",
      totalCollisionsLabel: "Collisions",
      totalCollisionsDescription: "Events that matched a previously seen UUID",
    },
    recent: {
      eyebrow: "Recent Attempts",
      title: "Recent UUID Events",
      description: "Click add once to insert exactly one UUIDv4 outside the background worker.",
      lastObservedLabel: "Last seen",
      addOneLabel: "Add 1 manually",
      collisionLabel: "COLLISION",
      uniqueLabel: "UNIQUE",
    },
    search: {
      eyebrow: "UUID Search",
      title: "Search Generated UUIDs",
      description: "Partial matches work too. Leave it empty to list recently observed UUIDs.",
      placeholder: "Example: 6f8c8a32",
      searchingLabel: "Searching...",
      resultsLabel: "Results",
      itemsLabel: "items",
      observedLabel: "Seen",
      collisionLabel: "Collisions",
      firstSeenLabel: "First",
      latestSeenLabel: "Latest",
    },
    unobservedLabel: "Not observed",
    latestAttemptNone: "No attempts have been recorded yet.\nStart the worker to append one record every second.",
    latestAttemptCollision: (uuid: string): string => `Collision detected.\n${uuid} has been observed again.`,
    latestAttemptUnique: (uuid: string): string => `Latest UUID: ${uuid}.\nNo collisions have been observed so far.`,
    manualTriggerSuccess: (uuid: string): string => `Stored a new UUID manually: ${uuid}`,
    manualTriggerCollision: (uuid: string): string => `Manual trigger collided: ${uuid}`,
    manualTriggerError: "Manual insertion failed. Check the containers and the database state.",
  },
} as const;

/**
 * 概要: ブラウザが保持している優先言語一覧から 2 文字の国コードを推定する。
 * 引数: なし
 * 戻り値: string | null - ISO 3166-1 alpha-2 相当の国コード。判定不能なら null
 * 例外: Intl.Locale 非対応や不正ロケール時の例外は握りつぶして null を返す
 * 計算量: O(n)
 * 注意: これは厳密な位置情報ではなくブラウザ設定由来の補助値であり、サーバ側 GeoIP ヘッダが無い環境向けの fallback として使う。
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
  const [locale, setLocale] = useState<DashboardLocale>("ja");
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(props.initialSnapshot);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UuidSearchResult[]>(props.initialSearchResults);
  const [isManualTriggerRunning, setIsManualTriggerRunning] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<"connecting" | "live" | "retrying">("connecting");
  const [manualTriggerMessage, setManualTriggerMessage] = useState<string>(
    "",
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const copy = COPY[locale];
  const formatDateTimeForLocale = (value: string | null): string => {
    return formatDateTime(value, locale);
  };

  const latestAttempt = snapshot.recentAttempts[0];
  const latestAttemptSummary = !latestAttempt
    ? copy.latestAttemptNone
    : latestAttempt.wasCollision
      ? copy.latestAttemptCollision(latestAttempt.uuid)
      : copy.latestAttemptUnique(latestAttempt.uuid);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedLocale = window.localStorage.getItem("uuidv4-collision-locale");

    if (storedLocale === "ja" || storedLocale === "en") {
      setLocale(storedLocale);
      return;
    }

    if (navigator.language.toLowerCase().startsWith("en")) {
      setLocale("en");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem("uuidv4-collision-locale", locale);
  }, [locale]);

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
              "X-Browser-Country-Code": countryCode,
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
            ? copy.manualTriggerCollision(payload.attempt.uuid)
            : copy.manualTriggerSuccess(payload.attempt.uuid),
        );
      });
    } catch (error) {
      console.error(error);
      setManualTriggerMessage(copy.manualTriggerError);
    } finally {
      setIsManualTriggerRunning(false);
    }
  };

  return (
    <Box py={{ base: 36, md: 56 }}>
      <Container size={1240}>
        <Stack gap={32}>
          <MainPanel
            copy={copy.mainPanel}
            locale={locale}
            latestAttemptSummary={latestAttemptSummary}
            onLocaleChange={setLocale}
            snapshot={snapshot}
            showMetrics={false}
          />

          <Grid gap={{ base: 32, lg: 40 }} align="start">
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Stack gap={32}>
              <MainPanel
                copy={copy.mainPanel}
                locale={locale}
                latestAttemptSummary={latestAttemptSummary}
                snapshot={snapshot}
                showHero={false}
              />

              <Box hiddenFrom="lg">
                <RecentUuids
                  copy={copy.recent}
                  recentAttempts={snapshot.recentAttempts}
                  manualTriggerMessage={manualTriggerMessage}
                  streamStatus={streamStatus}
                  latestAttemptAt={snapshot.stats.latestAttemptAt}
                  isManualTriggerRunning={isManualTriggerRunning}
                  onManualTrigger={() => {
                    void handleManualTrigger();
                  }}
                  formatDateTime={formatDateTimeForLocale}
                />
              </Box>

              <SearchUuid
                copy={copy.search}
                searchQuery={searchQuery}
                searchResults={searchResults}
                isSearchLoading={isSearchLoading}
                onSearchQueryChange={setSearchQuery}
                formatDateTime={formatDateTimeForLocale}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Box visibleFrom="lg">
              <RecentUuids
                copy={copy.recent}
                recentAttempts={snapshot.recentAttempts}
                manualTriggerMessage={manualTriggerMessage}
                streamStatus={streamStatus}
                latestAttemptAt={snapshot.stats.latestAttemptAt}
                isManualTriggerRunning={isManualTriggerRunning}
                onManualTrigger={() => {
                  void handleManualTrigger();
                }}
                formatDateTime={formatDateTimeForLocale}
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
function formatDateTime(value: string | null, locale: DashboardLocale = "ja"): string {
  if (!value) {
    return COPY[locale].unobservedLabel;
  }

  const formattedParts = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-GB", {
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
