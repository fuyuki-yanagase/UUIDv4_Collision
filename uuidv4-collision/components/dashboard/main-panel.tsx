"use client";

// =============================================
// Module: Dashboard Main Panel
// Description: 左上のメインヒーローと統計帯、手動追加導線を描画する。
// =============================================

import { Badge, Box, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { DashboardSnapshot } from "@/lib/shared/uuid-domain";

type StreamStatus = "connecting" | "live" | "retrying";

type MainPanelProps = {
  latestAttemptSummary: string;
  manualTriggerMessage: string;
  streamStatus: StreamStatus;
  snapshot: DashboardSnapshot;
  isManualTriggerRunning: boolean;
  onManualTrigger: () => void;
  formatDateTime: (value: string | null) => string;
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

/**
 * 目的: ページ冒頭の物語性と主要アクションを担う。
 * 主要責務: 見出し表示、統計帯表示、手動追加ボタン表示
 * 使用例: DashboardClient から最新スナップショットを渡して描画する
 */
export function MainPanel(props: MainPanelProps): ReactElement {
  return (
    <Stack gap={24}>
      <Stack gap={12}>
        <Title order={1} style={{ fontSize: "clamp(2.3rem, 6vw, 4.8rem)", lineHeight: 1.06 }}>
          UUIDv4 がいつか本当に衝突するのか、毎秒ひたすら観測する。
        </Title>
        <Text c="dimmed" size="lg" maw={700} style={{ lineHeight: 1.85 }}>
          {props.latestAttemptSummary}
        </Text>
      </Stack>

      <div className="grid gap-[18px] md:grid-cols-3">
        <MetricBand
          label="試行回数"
          description="これまでに生成して PostgreSQL に保存した総数"
          value={props.snapshot.stats.totalAttempts.toLocaleString("ja-JP")}
          toneClassName="text-[var(--mantine-color-sky-7)]"
        />
        <MetricBand
          label="一意 UUID 数"
          description="まだ一度しか観測されていない UUID の累積"
          value={props.snapshot.stats.totalUniqueUuids.toLocaleString("ja-JP")}
          toneClassName="text-[var(--mantine-color-teal-7)]"
        />
        <MetricBand
          label="衝突回数"
          description="既出 UUID と一致したイベントの累積"
          value={props.snapshot.stats.totalCollisions.toLocaleString("ja-JP")}
          toneClassName="text-[var(--mantine-color-orange-6)]"
        />
      </div>

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
              <Badge color={STREAM_STATUS_COLORS[props.streamStatus]}>
                {STREAM_STATUS_LABELS[props.streamStatus]}
              </Badge>
              <Badge color="gray">
                最終観測 {props.formatDateTime(props.snapshot.stats.latestAttemptAt)}
              </Badge>
            </Group>
            <Text fw={600} size="lg" c="ink.9" style={{ lineHeight: 1.7 }}>
              {props.manualTriggerMessage}
            </Text>
            <Text size="sm" c="dimmed" style={{ lineHeight: 1.8 }}>
              手動追加は 1 回だけ UUIDv4 を生成します。値はユーザ入力ではなくサーバ側で生成されます。
            </Text>
          </Stack>
          <Button size="md" loading={props.isManualTriggerRunning} onClick={props.onManualTrigger}>
            手動で 1 件追加
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

type MetricBandProps = {
  label: string;
  description: string;
  value: string;
  toneClassName: string;
};

/**
 * 概要: ファーストビューの統計帯 1 件分を描画する。
 * 引数: props: MetricBandProps - ラベル、説明文、値、色
 * 戻り値: ReactElement - 統計表示ブロック
 * 例外: なし
 * 計算量: O(1)
 * 注意: 下線アニメーションは hover 時も解除時も左始点で動く。
 */
function MetricBand(props: MetricBandProps): ReactElement {
  return (
    <Box
      className={[
        "group relative block pt-2 pb-[18px] text-inherit no-underline",
        "before:absolute before:right-0 before:bottom-0 before:left-0 before:h-px before:bg-[rgba(109,130,154,0.45)] before:content-['']",
        "after:absolute after:bottom-[-1px] after:left-0 after:h-[3px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-180 after:ease-out after:content-['']",
        "hover:after:origin-left hover:after:scale-x-100",
        props.toneClassName,
      ].join(" ")}
    >
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
