"use client";

// =============================================
// Module: Dashboard Search UUID
// Description: 左下の UUID 検索エリアを描画する。
// =============================================

import { Code, Divider, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { UuidSearchResult } from "@/lib/shared/uuid-domain";
import { AppBadge } from "@/components/util/badge";

type SearchUuidCopy = {
  eyebrow: string;
  title: string;
  description: string;
  placeholder: string;
  searchingLabel: string;
  resultsLabel: string;
  itemsLabel: string;
  observedLabel: string;
  collisionLabel: string;
  firstSeenLabel: string;
  latestSeenLabel: string;
};

type SearchUuidProps = {
  copy: SearchUuidCopy;
  searchQuery: string;
  searchResults: UuidSearchResult[];
  isSearchLoading: boolean;
  onSearchQueryChange: (value: string) => void;
  formatDateTime: (value: string | null) => string;
};

/**
 * 目的: 生成済み UUID の探索を担当する。
 * 主要責務: 検索入力欄と検索結果一覧の描画
 * 使用例: DashboardClient から状態を受け取って描画する
 */
export function SearchUuid(props: SearchUuidProps): ReactElement {
  return (
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
        eyebrow={props.copy.eyebrow}
        title={props.copy.title}
        description={props.copy.description}
      />
      <TextInput
        mt="lg"
        size="md"
        value={props.searchQuery}
        onChange={(event) => {
          props.onSearchQueryChange(event.currentTarget.value);
        }}
        placeholder={props.copy.placeholder}
      />
      <Group justify="space-between" mt="sm">
        <Text size="sm" c="dimmed">
          {props.isSearchLoading ? props.copy.searchingLabel : props.copy.resultsLabel}
        </Text>
        <AppBadge
          backgroundColor="rgba(120, 131, 155, 0.08)"
          borderColor="rgba(120, 131, 155, 0.16)"
          color="var(--mantine-color-gray-7)"
        >
          {props.searchResults.length} {props.copy.itemsLabel}
        </AppBadge>
      </Group>
      <Divider my="lg" />
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {props.searchResults.map((result) => {
          return (
            <SearchResultSurface
              key={result.uuid}
              copy={props.copy}
              result={result}
              formatDateTime={props.formatDateTime}
            />
          );
        })}
      </SimpleGrid>
    </Paper>
  );
}

type SearchResultSurfaceProps = {
  copy: SearchUuidCopy;
  result: UuidSearchResult;
  formatDateTime: (value: string | null) => string;
};

/**
 * 概要: UUID 検索結果 1 件分をカードで描画する。
 * 引数: props: SearchResultSurfaceProps - 検索結果の集計情報と日時整形関数
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
          <AppBadge
            backgroundColor="rgba(34, 139, 230, 0.1)"
            borderColor="rgba(34, 139, 230, 0.18)"
            color="var(--mantine-color-sky-7)"
          >
            {props.copy.observedLabel} {props.result.seenCount.toLocaleString("ja-JP")}
          </AppBadge>
          <AppBadge
            backgroundColor="rgba(245, 159, 0, 0.12)"
            borderColor="rgba(245, 159, 0, 0.22)"
            color="var(--mantine-color-orange-7)"
          >
            {props.copy.collisionLabel} {props.result.collisionCount.toLocaleString("ja-JP")}
          </AppBadge>
          <AppBadge
            backgroundColor="rgba(120, 131, 155, 0.08)"
            borderColor="rgba(120, 131, 155, 0.16)"
            color="var(--mantine-color-gray-7)"
          >
            {props.result.lastSource}
          </AppBadge>
        </Group>
        <Text size="sm" c="dimmed">
          {props.copy.firstSeenLabel}: {props.formatDateTime(props.result.firstSeenAt)}
        </Text>
        <Text size="sm" c="dimmed">
          {props.copy.latestSeenLabel}: {props.formatDateTime(props.result.lastSeenAt)}
        </Text>
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
