"use client";

// =============================================
// Module: Dashboard Client
// Description: Mantine を使って UUIDv4 衝突観測ダッシュボードを描画する。
// =============================================

import {
  Badge,
  Box,
  Button,
  Code,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { startTransition, useDeferredValue, useEffect, useEffectEvent, useState } from "react";
import type { ReactElement } from "react";
import type { DashboardSnapshot, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";
import classes from "@/components/dashboard-client.module.css";

type DashboardClientProps = {
  initialSnapshot: DashboardSnapshot;
  initialSearchResults: UuidSearchResult[];
};

const STREAM_STATUS_LABELS = {
  connecting: "CONNECTING",
  live: "LIVE",
  retrying: "RETRYING",
} as const;

const STREAM_STATUS_COLORS = {
  connecting: "sky",
  live: "teal",
  retrying: "orange",
} as const;

const DISPLAY_TIME_ZONE = "Asia/Tokyo";

/**
 * 目的: SSE、検索、手動追加をまとめて扱うダッシュボード UI を提供する。
 * 主要責務: 状態保持、リアルタイム更新、UUID 検索、手動追加ボタン
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
      ? `衝突発生。${latestAttempt.uuid} が再び観測されました。`
      : `最新 UUID は ${latestAttempt.uuid} です。いまのところ衝突は確認されていません。`;

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
      const response = await fetch("/api/attempts", {
        method: "POST",
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
          <Grid gap={{ base: 24, lg: 32 }} className={classes.heroGrid}>
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Stack gap={24}>
                <Stack gap={12}>
                  <Title order={1} style={{ fontSize: "clamp(2.3rem, 6vw, 4.8rem)", lineHeight: 1.06 }}>
                    UUIDv4 がいつか本当に衝突するのか、毎秒ひたすら観測する。
                  </Title>
                  <Text c="dimmed" size="lg" maw={700} style={{ lineHeight: 1.85 }}>
                    {latestAttemptSummary}
                  </Text>
                </Stack>

                <Box className={classes.metricRail}>
                  <MetricBand
                    label="試行回数"
                    description="これまでに生成して PostgreSQL に保存した総数"
                    value={snapshot.stats.totalAttempts.toLocaleString("ja-JP")}
                    tone="sky.7"
                  />
                  <MetricBand
                    label="一意 UUID 数"
                    description="まだ一度しか観測されていない UUID の累積"
                    value={snapshot.stats.totalUniqueUuids.toLocaleString("ja-JP")}
                    tone="teal.7"
                  />
                  <MetricBand
                    label="衝突回数"
                    description="既出 UUID と一致したイベントの累積"
                    value={snapshot.stats.totalCollisions.toLocaleString("ja-JP")}
                    tone="orange.6"
                  />
                </Box>

                <Paper
                  p={{ base: "lg", md: "xl" }}
                  radius={28}
                  shadow="xs"
                  style={{
                    background: "rgba(255, 255, 255, 0.92)",
                    borderColor: "rgba(133, 170, 214, 0.22)",
                  }}
                >
                  <Group justify="space-between" align="flex-start" gap="lg" wrap="wrap">
                    <Stack gap={6} maw={620}>
                      <Group gap="xs">
                        <Badge color={STREAM_STATUS_COLORS[streamStatus]}>
                          {STREAM_STATUS_LABELS[streamStatus]}
                        </Badge>
                        <Badge color="gray">最終観測 {formatDateTime(snapshot.stats.latestAttemptAt)}</Badge>
                      </Group>
                      <Text fw={600} size="lg" c="ink.9" style={{ lineHeight: 1.7 }}>
                        {manualTriggerMessage}
                      </Text>
                      <Text size="sm" c="dimmed" style={{ lineHeight: 1.8 }}>
                        手動追加は 1 回だけ UUIDv4 を生成します。値はユーザ入力ではなくサーバ側で生成されます。
                      </Text>
                    </Stack>
                    <Button
                      size="md"
                      loading={isManualTriggerRunning}
                      onClick={() => {
                        void handleManualTrigger();
                      }}
                    >
                      手動で 1 件追加
                    </Button>
                  </Group>
                </Paper>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper
                p={{ base: "lg", md: "xl" }}
                radius={28}
                shadow="xs"
                h="100%"
                style={{
                  background: "rgba(255, 255, 255, 0.94)",
                  borderColor: "rgba(133, 170, 214, 0.24)",
                }}
              >
                <Stack h="100%" gap="lg">
                  <SectionHeader
                    eyebrow="Recent Attempts"
                    title="直近の生成イベント"
                    description="このサイトで一番面白い場所なので、ファーストビューに置いています。"
                  />
                  <Divider />
                  <Stack gap="sm" className={classes.recentEventsScroll}>
                    {snapshot.recentAttempts.map((attempt) => {
                      return <AttemptSurface key={attempt.id} attempt={attempt} />;
                    })}
                  </Stack>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          <Grid gap={{ base: 20, lg: 28 }} className={classes.lowerGrid}>
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Paper
                p={{ base: "lg", md: "xl" }}
                radius={28}
                shadow="xs"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderColor: "rgba(133, 170, 214, 0.22)",
                }}
              >
                <SectionHeader
                  eyebrow="UUID Search"
                  title="生成済み UUID を検索する"
                  description="部分一致でも探せます。空欄のままなら最近観測した UUID を表示します。"
                />
                <TextInput
                  mt="lg"
                  size="md"
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.currentTarget.value);
                  }}
                  placeholder="例: 6f8c8a32"
                />
                <Group justify="space-between" mt="sm">
                  <Text size="sm" c="dimmed">
                    {isSearchLoading ? "Searching..." : "Results"}
                  </Text>
                  <Badge color="gray">{searchResults.length} items</Badge>
                </Group>
                <Divider my="lg" />
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  {searchResults.map((result) => {
                    return <SearchResultSurface key={result.uuid} result={result} />;
                  })}
                </SimpleGrid>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper
                p={{ base: "lg", md: "xl" }}
                radius={28}
                shadow="xs"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderColor: "rgba(133, 170, 214, 0.22)",
                }}
              >
                <SectionHeader
                  eyebrow="Twitter Bot"
                  title="Bot の投稿をまとめる場所"
                  description="優先度は低めですが、将来的に Twitter bot の投稿履歴や固定リンクをここへ集約できます。"
                />
                <Divider my="lg" />
                <Stack gap="md">
                  <TwitterPlaceholder
                    title="直近ポストの一覧"
                    description="衝突発生時や一定件数ごとの自動投稿ログを並べる想定です。"
                  />
                  <TwitterPlaceholder
                    title="衝突時の固定リンク"
                    description="初回衝突が起きた瞬間の投稿や関連スレッドを強調表示できます。"
                  />
                  <TwitterPlaceholder
                    title="運用メモ"
                    description="bot 側の稼働状況、投稿失敗、レート制限などの補足表示にも使えます。"
                  />
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/**
 * 概要: 各セクションの上部に表示する見出しブロックを描画する。
 * 引数: props: SectionHeaderProps - 小見出し、タイトル、説明文
 * 戻り値: ReactElement - セクションヘッダー
 * 例外: なし
 * 計算量: O(1)
 * 注意: 情報密度が高い画面でも見出し階層が崩れないよう定型化する。
 */
function SectionHeader(props: SectionHeaderProps): ReactElement {
  return (
    <Stack gap={4}>
      <Text size="xs" fw={700} c="sky.7" tt="uppercase" style={{ letterSpacing: "0.12em" }}>
        {props.eyebrow}
      </Text>
      <Title order={3}>{props.title}</Title>
      <Text c="dimmed" size="sm" style={{ lineHeight: 1.8 }}>
        {props.description}
      </Text>
    </Stack>
  );
}

type MetricBandProps = {
  label: string;
  description: string;
  value: string;
  tone: string;
};

/**
 * 概要: ファーストビューの統計帯 1 件分を描画する。
 * 引数: props: MetricBandProps - ラベル、説明文、値、色
 * 戻り値: ReactElement - 統計表示ブロック
 * 例外: なし
 * 計算量: O(1)
 * 注意: 下線アニメーションで hover 時の反応だけを静かに強める。
 */
function MetricBand(props: MetricBandProps): ReactElement {
  return (
    <Box className={classes.metricLink} c={props.tone}>
      <Text size="2.35rem" fw={700} lh={1.05}>
        {props.value}
      </Text>
      <Text mt={8} fw={600} c="ink.8">
        {props.label}
      </Text>
      <Text mt={4} size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
        {props.description}
      </Text>
    </Box>
  );
}

type AttemptSurfaceProps = {
  attempt: UuidAttempt;
};

/**
 * 概要: 直近の UUID 生成イベント 1 件分をコンパクトなカードで描画する。
 * 引数: props: AttemptSurfaceProps - 表示対象の試行レコード
 * 戻り値: ReactElement - イベント表示カード
 * 例外: なし
 * 計算量: O(1)
 * 注意: UUID の視認性を優先しつつ、時刻と状態の確認も 1 目線で済むようにする。
 */
function AttemptSurface(props: AttemptSurfaceProps): ReactElement {
  return (
    <Paper
      p="md"
      radius="xl"
      style={{
        background: props.attempt.wasCollision
          ? "linear-gradient(135deg, rgba(255, 237, 214, 0.9), rgba(255, 255, 255, 0.98))"
          : "rgba(248, 251, 255, 0.98)",
        borderColor: props.attempt.wasCollision
          ? "rgba(237, 137, 54, 0.28)"
          : "rgba(133, 170, 214, 0.18)",
      }}
    >
      <Stack gap={10}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <Badge color={props.attempt.wasCollision ? "orange" : "teal"}>
              {props.attempt.wasCollision ? "COLLISION" : "UNIQUE"}
            </Badge>
            <Badge color="gray">{props.attempt.source}</Badge>
          </Group>
          <Text size="xs" c="dimmed">
            {formatDateTime(props.attempt.createdAt)}
          </Text>
        </Group>
        <Code
          c="ink.9"
          style={{
            display: "block",
            whiteSpace: "normal",
            wordBreak: "break-all",
            background: "transparent",
            padding: 0,
            fontSize: "0.92rem",
            lineHeight: 1.75,
          }}
        >
          {props.attempt.uuid}
        </Code>
      </Stack>
    </Paper>
  );
}

type SearchResultSurfaceProps = {
  result: UuidSearchResult;
};

/**
 * 概要: UUID 検索結果 1 件分をカードで描画する。
 * 引数: props: SearchResultSurfaceProps - 検索結果の集計情報
 * 戻り値: ReactElement - 検索結果カード
 * 例外: なし
 * 計算量: O(1)
 * 注意: UUID と集計値を近接配置し、探索時の往復視線を減らす。
 */
function SearchResultSurface(props: SearchResultSurfaceProps): ReactElement {
  return (
    <Paper
      p="md"
      radius="xl"
      style={{
        background: "rgba(247, 251, 255, 0.92)",
        borderColor: "rgba(133, 170, 214, 0.2)",
      }}
    >
      <Stack gap="sm">
        <Code
          c="ink.9"
          style={{
            display: "block",
            whiteSpace: "normal",
            wordBreak: "break-all",
            background: "transparent",
            padding: 0,
          }}
        >
          {props.result.uuid}
        </Code>
        <Group gap="xs">
          <Badge color="sky">観測 {props.result.seenCount.toLocaleString("ja-JP")}</Badge>
          <Badge color="orange">衝突 {props.result.collisionCount.toLocaleString("ja-JP")}</Badge>
          <Badge color="gray">{props.result.lastSource}</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          初回: {formatDateTime(props.result.firstSeenAt)}
        </Text>
        <Text size="sm" c="dimmed">
          最新: {formatDateTime(props.result.lastSeenAt)}
        </Text>
      </Stack>
    </Paper>
  );
}

type TwitterPlaceholderProps = {
  title: string;
  description: string;
};

/**
 * 概要: 今後 Twitter bot の集約先となるプレースホルダーを描画する。
 * 引数: props: TwitterPlaceholderProps - 見出しと説明
 * 戻り値: ReactElement - プレースホルダーブロック
 * 例外: なし
 * 計算量: O(1)
 * 注意: 未実装であることを曖昧にせず、用途だけは伝える。
 */
function TwitterPlaceholder(props: TwitterPlaceholderProps): ReactElement {
  return (
    <Paper
      p="md"
      radius="xl"
      style={{
        background: "rgba(247, 251, 255, 0.92)",
        borderColor: "rgba(133, 170, 214, 0.2)",
      }}
    >
      <Stack gap={6}>
        <Group justify="space-between">
          <Text fw={600}>{props.title}</Text>
          <Badge color="gray">準備中</Badge>
        </Group>
        <Text size="sm" c="dimmed" style={{ lineHeight: 1.8 }}>
          {props.description}
        </Text>
      </Stack>
    </Paper>
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

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "medium",
    hour12: false,
    timeZone: DISPLAY_TIME_ZONE,
  }).format(new Date(value));
}
