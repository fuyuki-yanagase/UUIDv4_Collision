"use client";

// =============================================
// Module: Dashboard Recent UUIDs
// Description: 直近のリアルタイム UUID 一覧と手動追加ボタンを描画する。
// =============================================

import { Badge, Box, Button, Code, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
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
            description="手動追加を押すと、ワーカーとは別に 1 件だけ UUIDv4 を追加できます。"
          />
        </Group>
        <Group justify="space-between" align="center" gap="md" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Badge color={STREAM_STATUS_COLORS[props.streamStatus]}>
              {STREAM_STATUS_LABELS[props.streamStatus]}
            </Badge>
            <Badge color="gray">
              最終観測 {props.formatDateTime(props.latestAttemptAt)}
            </Badge>
          </Group>
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
 * 概要: 2 文字の国コードを国旗絵文字へ変換する。
 * 引数: countryCode: string | null - ISO 3166-1 alpha-2 を想定した国コード
 * 戻り値: string | null - 変換できた場合は国旗絵文字、できない場合は null
 * 例外: なし
 * 計算量: O(1)
 * 注意: 不正な値はそのまま表示せず null に落として UI 崩れを避ける。
 */
function toFlagEmoji(countryCode: string | null): string | null {
  if (countryCode === null) {
    return null;
  }

  const normalizedCountryCode = countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCountryCode)) {
    return null;
  }

  return Array.from(normalizedCountryCode)
    .map((character) => {
      return String.fromCodePoint(127397 + character.charCodeAt(0));
    })
    .join("");
}

/**
 * 概要: 生成イベントの発生源に応じたアイコンを返す。
 * 引数: attempt: UuidAttempt - 表示対象の UUID 生成イベント
 * 戻り値: string - バッジに表示するアイコン文字列
 * 例外: なし
 * 計算量: O(1)
 * 注意: MANUAL で国コードが無い場合は汎用の人物アイコンへフォールバックする。
 */
function getSourceIcon(attempt: UuidAttempt): string {
  if (attempt.source === "AUTO") {
    return "🤖";
  }

  return toFlagEmoji(attempt.countryCode) ?? "🌐";
}

/**
 * 概要: 生成イベントの発生源バッジに表示する文言を返す。
 * 引数: attempt: UuidAttempt - 表示対象の UUID 生成イベント
 * 戻り値: string - バッジに表示する短いラベル
 * 例外: なし
 * 計算量: O(1)
 * 注意: MANUAL では国コードが取れていればそれを優先表示し、取れない場合だけ MANUAL を残す。
 */
function getSourceLabel(attempt: UuidAttempt): string {
  if (attempt.source === "AUTO") {
    return "AUTO";
  }

  return attempt.countryCode?.trim().toUpperCase() || "MANUAL";
}

/**
 * 概要: 直近の UUID 生成イベント 1 件分をコンパクトなカードで描画する。
 * 引数: props: AttemptSurfaceProps - 表示対象の試行レコードと日時整形関数
 * 戻り値: ReactElement - イベント表示カード
 * 例外: なし
 * 計算量: O(1)
 * 注意: UUID の視認性を優先しつつ、時刻と状態の確認も 1 目線で済むようにする。
 */
function AttemptSurface(props: AttemptSurfaceProps): ReactElement {
  const isManualAttempt = props.attempt.source === "MANUAL";
  const sourceIcon = getSourceIcon(props.attempt);
  const sourceLabel = getSourceLabel(props.attempt);

  return (
    <Box
      px="xs"
      py="md"
      className="transition-colors duration-150"
      style={{
        background: isManualAttempt ? "rgba(34, 197, 94, 0.08)" : undefined,
      }}
    >
      <Stack gap={10}>
        <Group justify="space-between" align="center" wrap="wrap">
          <Group gap="xs">
            <Badge color={props.attempt.wasCollision ? "orange" : "teal"}>
              {props.attempt.wasCollision ? "COLLISION" : "UNIQUE"}
            </Badge>
            <Badge color={isManualAttempt ? "green" : "gray"}>
              {sourceIcon} {sourceLabel}
            </Badge>
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
