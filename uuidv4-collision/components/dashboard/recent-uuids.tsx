"use client";

// =============================================
// Module: Dashboard Recent UUIDs
// Description: 直近のリアルタイム UUID 一覧と手動追加ボタンを描画する。
// =============================================

import { Badge, Button, Code, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { UuidAttempt } from "@/lib/shared/uuid-domain";

type RecentUuidsProps = {
  recentAttempts: UuidAttempt[];
  manualTriggerMessage: string;
  streamStatus: "connecting" | "live" | "retrying";
  latestAttemptAt: string | null;
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
 * 目的: 直近の生成イベントをファーストビューで見せる。
 * 主要責務: 最新イベント一覧の描画、手動追加ボタンの表示
 * 使用例: DashboardClient から recentAttempts を受け取って描画する
 */
export function RecentUuids(props: RecentUuidsProps): ReactElement {
  return (
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
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <SectionHeader
            eyebrow="Recent Attempts"
            title="直近の生成イベント"
            description="このサイトで一番面白い場所なので、ファーストビューに置いています。"
          />
          <Group gap="xs">
            <Badge color={STREAM_STATUS_COLORS[props.streamStatus]}>
              {STREAM_STATUS_LABELS[props.streamStatus]}
            </Badge>
            <Badge color="gray">最終観測 {props.formatDateTime(props.latestAttemptAt)}</Badge>
          </Group>
        </Group>
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.8 }}>
            {props.manualTriggerMessage}
          </Text>
          <Button size="sm" loading={props.isManualTriggerRunning} onClick={props.onManualTrigger}>
            手動で 1 件追加
          </Button>
        </Group>
        <Divider />
        <Stack gap="sm" className="max-h-[560px] overflow-y-auto pr-1 lg:max-h-[560px]">
          {props.recentAttempts.map((attempt) => {
            return (
              <AttemptSurface
                key={attempt.id}
                attempt={attempt}
                formatDateTime={props.formatDateTime}
              />
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}

type AttemptSurfaceProps = {
  attempt: UuidAttempt;
  formatDateTime: (value: string | null) => string;
};

/**
 * 概要: 直近の UUID 生成イベント 1 件分をコンパクトなカードで描画する。
 * 引数: props: AttemptSurfaceProps - 表示対象の試行レコードと日時整形関数
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
            {props.formatDateTime(props.attempt.createdAt)}
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
