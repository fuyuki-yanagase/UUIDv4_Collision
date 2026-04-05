"use client";

// =============================================
// Module: Dashboard Recent UUIDs
// Description: 直近のリアルタイム UUID 一覧と手動追加ボタンを描画する。
// =============================================

import { Box, Button, Code, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement, ReactNode } from "react";
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
      className="md:h-[760px]"
      p={{ base: "lg", md: "xl" }}
      radius={28}
      shadow="xs"
      style={{
        background: "rgba(255, 255, 255, 0.94)",
        borderColor: "rgba(133, 170, 214, 0.24)",
        overflowAnchor: "none",
      }}
    >
      <Stack h="100%" gap="lg">
        <Group justify="space-between" align="flex-start" gap="md" wrap="wrap">
          <SectionHeader
            eyebrow="Recent Attempts"
            title="直近の生成イベント"
            description="このサイトで一番面白い場所なので、ファーストビューに置いています。"
          />
          <Group gap="xs" wrap="nowrap">
            <StatusPill toneColor={resolveToneColor(STREAM_STATUS_COLORS[props.streamStatus])}>
              {STREAM_STATUS_LABELS[props.streamStatus]}
            </StatusPill>
            <StatusPill toneColor="var(--mantine-color-gray-2)" textColor="var(--mantine-color-gray-8)" mono>
              最終観測 {props.formatDateTime(props.latestAttemptAt)}
            </StatusPill>
          </Group>
        </Group>
        <Group justify="space-between" align="center" gap="md" wrap="nowrap">
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.8, flex: 1 }}>
            {props.manualTriggerMessage}
          </Text>
          <Button size="sm" loading={props.isManualTriggerRunning} onClick={props.onManualTrigger}>
            手動で 1 件追加
          </Button>
        </Group>
        <Divider />
        <Stack
          gap={0}
          className="min-h-0 flex-1 overflow-y-auto pr-1"
          style={{
            overflowAnchor: "none",
          }}
        >
          {props.recentAttempts.map((attempt, index) => {
            return (
              <Box key={attempt.id}>
                <AttemptSurface attempt={attempt} formatDateTime={props.formatDateTime} />
                {index < props.recentAttempts.length - 1 ? <Divider /> : null}
              </Box>
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
    <Box
      px="xs"
      py="md"
      className="transition-colors duration-150 hover:bg-[rgba(244,249,255,0.9)]"
    >
      <Stack gap={10}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <StatusPill
              toneColor={resolveToneColor(props.attempt.wasCollision ? "orange" : "teal")}
            >
              {props.attempt.wasCollision ? "COLLISION" : "UNIQUE"}
            </StatusPill>
            <StatusPill toneColor="var(--mantine-color-gray-2)" textColor="var(--mantine-color-gray-8)">
              {props.attempt.source}
            </StatusPill>
          </Group>
          <Text size="xs" c="dimmed" ff="mono" style={{ fontVariantNumeric: "tabular-nums" }}>
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
            fontSize: "0.95rem",
            lineHeight: 1.8,
          }}
        >
          {props.attempt.uuid}
        </Code>
      </Stack>
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

type StatusPillProps = {
  children: ReactNode;
  toneColor: string;
  textColor?: string;
  mono?: boolean;
};

/**
 * 概要: 上下が切れない固定レイアウトの小さなピル表示を描画する。
 * 引数: props: StatusPillProps - 表示文字列、背景色、文字色、等幅指定
 * 戻り値: ReactElement - pill UI
 * 例外: なし
 * 計算量: O(1)
 * 注意: Mantine Badge の高さ制約で文字が欠けるため Box/Text で置き換えている。
 */
function StatusPill(props: StatusPillProps): ReactElement {
  return (
    <Box
      className="inline-flex items-center rounded-full px-3 py-1"
      style={{
        background: props.toneColor,
      }}
    >
      <Text
        size="xs"
        fw={700}
        tt="uppercase"
        style={{
          lineHeight: 1.3,
          color: props.textColor ?? "white",
          fontVariantNumeric: props.mono ? "tabular-nums" : undefined,
          fontFamily: props.mono ? "var(--font-ibm-plex-mono), monospace" : undefined,
        }}
      >
        {props.children}
      </Text>
    </Box>
  );
}

/**
 * 概要: Mantine のカラートークン名を CSS 変数へ変換する。
 * 引数: colorName: string - sky や teal などのトークン名
 * 戻り値: string - CSS 変数として参照できる色文字列
 * 例外: なし
 * 計算量: O(1)
 * 注意: 明度はこの画面で見やすい 6 を基本に採用する。
 */
function resolveToneColor(colorName: string): string {
  return `var(--mantine-color-${colorName}-6)`;
}
