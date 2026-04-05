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
  RingProgress,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { startTransition, useDeferredValue, useEffect, useEffectEvent, useState } from "react";
import type { ReactElement } from "react";
import type { DashboardSnapshot, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

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
  const collisionRate = snapshot.stats.totalAttempts === 0
    ? 0
    : Number(((snapshot.stats.totalCollisions / snapshot.stats.totalAttempts) * 100).toFixed(6));
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
   * 注意: startTransition を使い、手入力中の検索体験を阻害しにくくする。
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
   * 注意: 検索ボックスのタイピングと結果反映の競合を緩めるため transition を使う。
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
    <Box py={56}>
      <Container size={1200}>
        <Stack gap={28}>
          <Paper
            radius={28}
            p={{ base: 24, md: 34 }}
            shadow="sm"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(133, 170, 214, 0.22)",
              backdropFilter: "blur(12px)",
            }}
          >
            <Grid gap={28} align="stretch">
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <Stack gap="lg">
                  <Group gap="xs">
                    <Badge color="sky">UUIDv4 Collision Observatory</Badge>
                    <Badge color="gray">PostgreSQL + SSE</Badge>
                    <Badge color="gray">1Hz Worker</Badge>
                  </Group>
                  <Stack gap={10}>
                    <Title order={1} style={{ fontSize: "clamp(2rem, 5vw, 3.7rem)", lineHeight: 1.12 }}>
                      1 秒ごとに UUIDv4 を追加して、気が遠くなるほど低い衝突確率を観測する。
                    </Title>
                    <Text c="dimmed" size="lg" maw={760} style={{ lineHeight: 1.8 }}>
                      画面は Zenn のように情報を読み取りやすく、Nani 翻訳のように軽やかな余白を持たせています。
                      ワーカーが PostgreSQL に継続書き込みし、Next.js が SSE で静かに追従します。
                    </Text>
                  </Stack>
                  <Paper
                    p="lg"
                    radius={22}
                    style={{
                      background: "linear-gradient(135deg, rgba(56, 159, 251, 0.08), rgba(56, 159, 251, 0.02))",
                      borderColor: "rgba(56, 159, 251, 0.18)",
                    }}
                  >
                    <Stack gap={8}>
                      <Text size="xs" fw={700} c="sky.7" tt="uppercase" style={{ letterSpacing: "0.12em" }}>
                        Latest Atmosphere
                      </Text>
                      <Text size="lg" fw={600} c="ink.9" style={{ lineHeight: 1.7 }}>
                        {latestAttemptSummary}
                      </Text>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, lg: 4 }}>
                <Paper
                  h="100%"
                  p="xl"
                  radius={24}
                  shadow="xs"
                  style={{
                    background: "linear-gradient(180deg, rgba(248, 251, 255, 0.98), rgba(241, 247, 255, 0.94))",
                    borderColor: "rgba(133, 170, 214, 0.24)",
                  }}
                >
                  <Stack justify="space-between" h="100%" gap="lg">
                    <Group justify="space-between" align="flex-start">
                      <Stack gap={2}>
                        <Text size="xs" fw={700} c="dimmed" tt="uppercase" style={{ letterSpacing: "0.12em" }}>
                          Live Status
                        </Text>
                        <Title order={3}>観測を 1 件だけ上乗せする</Title>
                      </Stack>
                      <Badge color={STREAM_STATUS_COLORS[streamStatus]}>
                        {STREAM_STATUS_LABELS[streamStatus]}
                      </Badge>
                    </Group>
                    <Group align="center" justify="space-between" wrap="nowrap">
                      <RingProgress
                        size={116}
                        thickness={12}
                        roundCaps
                        sections={[
                          { value: Math.max(collisionRate, 0.4), color: collisionRate > 0 ? "orange.5" : "sky.5" },
                        ]}
                        label={
                          <Stack gap={0} align="center">
                            <Text fw={700} size="lg">
                              {collisionRate.toFixed(4)}%
                            </Text>
                            <Text size="10px" c="dimmed" tt="uppercase" style={{ letterSpacing: "0.1em" }}>
                              collision
                            </Text>
                          </Stack>
                        }
                      />
                      <Stack gap={4} flex={1}>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>
                          SSE 接続が有効な間、ワーカーと手動追加の結果は自動で反映されます。
                        </Text>
                        <Text size="sm" fw={600} c="ink.9" style={{ lineHeight: 1.7 }}>
                          {manualTriggerMessage}
                        </Text>
                      </Stack>
                    </Group>
                    <Button
                      size="md"
                      fullWidth
                      loading={isManualTriggerRunning}
                      onClick={() => {
                        void handleManualTrigger();
                      }}
                    >
                      手動で 1 件追加
                    </Button>
                  </Stack>
                </Paper>
              </Grid.Col>
            </Grid>
          </Paper>

          <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="lg">
            <StatSurface
              label="総試行回数"
              value={snapshot.stats.totalAttempts.toLocaleString("ja-JP")}
              tone="sky"
            />
            <StatSurface
              label="一意 UUID 数"
              value={snapshot.stats.totalUniqueUuids.toLocaleString("ja-JP")}
              tone="teal"
            />
            <StatSurface
              label="衝突回数"
              value={snapshot.stats.totalCollisions.toLocaleString("ja-JP")}
              tone="orange"
            />
            <StatSurface
              label="最終観測時刻"
              value={formatDateTime(snapshot.stats.latestAttemptAt)}
              tone="gray"
            />
          </SimpleGrid>

          <Grid gap="lg" align="stretch">
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Paper
                p={{ base: "lg", md: "xl" }}
                shadow="xs"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderColor: "rgba(133, 170, 214, 0.22)",
                }}
              >
                <SectionHeader
                  eyebrow="Recent Attempts"
                  title="直近の生成イベント"
                  description={`最終更新: ${formatDateTime(snapshot.generatedAt)}`}
                />
                <Divider my="lg" />
                <Table.ScrollContainer minWidth={720}>
                  <Table verticalSpacing="md" horizontalSpacing="md" striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>状態</Table.Th>
                        <Table.Th>ソース</Table.Th>
                        <Table.Th>UUID</Table.Th>
                        <Table.Th>時刻</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {snapshot.recentAttempts.map((attempt) => {
                        return <AttemptRow key={attempt.id} attempt={attempt} />;
                      })}
                    </Table.Tbody>
                  </Table>
                </Table.ScrollContainer>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper
                p={{ base: "lg", md: "xl" }}
                shadow="xs"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderColor: "rgba(133, 170, 214, 0.22)",
                }}
              >
                <SectionHeader
                  eyebrow="UUID Search"
                  title="生成済み UUID を検索する"
                  description="完全一致でも部分一致でも検索できます。空欄なら最近観測した UUID を表示します。"
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
                <Stack gap="md">
                  {searchResults.map((result) => {
                    return <SearchResultSurface key={result.uuid} result={result} />;
                  })}
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

type StatSurfaceProps = {
  label: string;
  value: string;
  tone: "sky" | "teal" | "orange" | "gray";
};

/**
 * 概要: 上部のサマリー統計カードを描画する。
 * 引数: props: StatSurfaceProps - ラベル、値、アクセント色
 * 戻り値: ReactElement - 統計カード
 * 例外: なし
 * 計算量: O(1)
 * 注意: 数値を主役にしつつ、白背景で読み疲れしない強さに抑える。
 */
function StatSurface(props: StatSurfaceProps): ReactElement {
  return (
    <Paper
      p="lg"
      shadow="xs"
      style={{
        background: "rgba(255, 255, 255, 0.88)",
        borderColor: "rgba(133, 170, 214, 0.2)",
      }}
    >
      <Stack gap={8}>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" style={{ letterSpacing: "0.12em" }}>
          {props.label}
        </Text>
        <Text fw={700} size="1.8rem" c={props.tone === "gray" ? "ink.8" : `${props.tone}.7`}>
          {props.value}
        </Text>
      </Stack>
    </Paper>
  );
}

type AttemptRowProps = {
  attempt: UuidAttempt;
};

/**
 * 概要: 直近の UUID 生成イベント 1 件分を表の行として描画する。
 * 引数: props: AttemptRowProps - 表示対象の試行レコード
 * 戻り値: ReactElement - テーブル行
 * 例外: なし
 * 計算量: O(1)
 * 注意: UUID は Code 表示にして視認しやすくし、状態は Badge で即判別できるようにする。
 */
function AttemptRow(props: AttemptRowProps): ReactElement {
  return (
    <Table.Tr>
      <Table.Td>
        <Badge color={props.attempt.wasCollision ? "orange" : "teal"}>
          {props.attempt.wasCollision ? "COLLISION" : "UNIQUE"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge color="gray">{props.attempt.source}</Badge>
      </Table.Td>
      <Table.Td>
        <Code
          c="ink.9"
          style={{
            display: "block",
            whiteSpace: "normal",
            wordBreak: "break-all",
            background: "rgba(240, 246, 253, 0.9)",
            border: "1px solid rgba(133, 170, 214, 0.2)",
            padding: "10px 12px",
          }}
        >
          {props.attempt.uuid}
        </Code>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {formatDateTime(props.attempt.createdAt)}
        </Text>
      </Table.Td>
    </Table.Tr>
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
 * 注意: UUID 本体と集計値を近接配置し、探索時の往復視線を減らす。
 */
function SearchResultSurface(props: SearchResultSurfaceProps): ReactElement {
  return (
    <Paper
      p="md"
      radius="lg"
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

/**
 * 概要: ISO 文字列を日本語向けの日時表記へ整形する。
 * 引数: value: string | null - ISO 8601 文字列
 * 戻り値: string - 表示用の日時文字列
 * 例外: なし
 * 計算量: O(1)
 * 注意: null は「未観測」と表示して初期状態でも意味が通るようにする。
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
