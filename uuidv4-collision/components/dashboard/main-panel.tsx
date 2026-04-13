"use client";

// =============================================
// Module: Dashboard Main Panel
// Description: 左上のメインヒーローと統計帯を描画する。
// =============================================

import { Box, Group, SegmentedControl, Stack, Text, Title } from "@mantine/core";
import type { CSSProperties, ReactElement } from "react";
import styles from "@/components/dashboard/dashboard.module.css";
import type { DashboardSnapshot } from "@/lib/shared/uuid-domain";

type DashboardLocale = "ja" | "en";

type MainPanelCopy = {
  heroTitle: string;
  totalAttemptsLabel: string;
  totalAttemptsDescription: string;
  totalUniqueUuidsLabel: string;
  totalUniqueUuidsDescription: string;
  totalCollisionsLabel: string;
  totalCollisionsDescription: string;
};

type MainPanelProps = {
  copy: MainPanelCopy;
  locale: DashboardLocale;
  latestAttemptSummary: string;
  onLocaleChange?: (locale: DashboardLocale) => void;
  snapshot: DashboardSnapshot;
  showHero?: boolean;
  showMetrics?: boolean;
};

/**
 * 目的: ページ冒頭の物語性と主要統計を担う。
 * 主要責務: 見出し表示、統計帯表示
 * 使用例: DashboardClient から最新スナップショットを渡して描画する
 */
export function MainPanel(props: MainPanelProps): ReactElement {
  const showHero = props.showHero ?? true;
  const showMetrics = props.showMetrics ?? true;

  return (
    <Stack gap={24}>
      {showHero ? (
        <Stack gap={12}>
          <Title order={1} style={{ fontSize: "clamp(2.3rem, 6vw, 4.8rem)", lineHeight: 1.06 }}>
            {props.copy.heroTitle.split("\n").map((line, index) => {
              return (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < props.copy.heroTitle.split("\n").length - 1 ? <br /> : null}
                </span>
              );
            })}
          </Title>
          <Group justify="space-between" align="flex-end" gap="md" wrap="wrap">
            <Text c="dimmed" size="lg" maw={700} style={{ lineHeight: 1.85, whiteSpace: "pre-line" }}>
              {props.latestAttemptSummary}
            </Text>
            <SegmentedControl
              radius="xl"
              size="sm"
              value={props.locale}
              onChange={(value) => {
                props.onLocaleChange?.(value as DashboardLocale);
              }}
              data={[
                { label: "🇯🇵 日本語", value: "ja" },
                { label: "🇬🇧 English", value: "en" },
              ]}
            />
          </Group>
        </Stack>
      ) : null}

      {showMetrics ? (
        <div className={styles.metricsRow}>
          <MetricBand
            label={props.copy.totalAttemptsLabel}
            description={props.copy.totalAttemptsDescription}
            value={props.snapshot.stats.totalAttempts.toLocaleString("ja-JP")}
            toneColor="var(--mantine-color-sky-7)"
          />
          <MetricBand
            label={props.copy.totalUniqueUuidsLabel}
            description={props.copy.totalUniqueUuidsDescription}
            value={props.snapshot.stats.totalUniqueUuids.toLocaleString("ja-JP")}
            toneColor="var(--mantine-color-teal-7)"
          />
          <MetricBand
            label={props.copy.totalCollisionsLabel}
            description={props.copy.totalCollisionsDescription}
            value={props.snapshot.stats.totalCollisions.toLocaleString("ja-JP")}
            toneColor="var(--mantine-color-orange-6)"
          />
        </div>
      ) : null}
    </Stack>
  );
}

type MetricBandProps = {
  label: string;
  description: string;
  value: string;
  toneColor: string;
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
      className={styles.metricBand}
      style={{
        "--metric-color": props.toneColor,
      } as CSSProperties}
    >
      <Text
        size="2.35rem"
        fw={700}
        lh={1.05}
        style={{
          color: props.toneColor,
        }}
      >
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
