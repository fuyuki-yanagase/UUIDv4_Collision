"use client";

// =============================================
// Module: Dashboard Search UUID
// Description: 左下の UUID 検索エリアを描画する。
// =============================================

import { Badge, Code, Divider, Group, Paper, SimpleGrid, Stack, Text, TextInput, Title } from "@mantine/core";
import type { ReactElement } from "react";
import type { UuidSearchResult } from "@/lib/shared/uuid-domain";

type SearchUuidProps = {
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
        eyebrow="UUID Search"
        title="生成済み UUID を検索する"
        description="部分一致でも探せます。空欄のままなら最近観測した UUID を表示します。"
      />
      <TextInput
        mt="lg"
        size="md"
        value={props.searchQuery}
        onChange={(event) => {
          props.onSearchQueryChange(event.currentTarget.value);
        }}
        placeholder="例: 6f8c8a32"
      />
      <Group justify="space-between" mt="sm">
        <Text size="sm" c="dimmed">
          {props.isSearchLoading ? "Searching..." : "Results"}
        </Text>
        <Badge color="gray">{props.searchResults.length} items</Badge>
      </Group>
      <Divider my="lg" />
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {props.searchResults.map((result) => {
          return (
            <SearchResultSurface
              key={result.uuid}
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
          <Badge color="sky">観測 {props.result.seenCount.toLocaleString("ja-JP")}</Badge>
          <Badge color="orange">衝突 {props.result.collisionCount.toLocaleString("ja-JP")}</Badge>
          <Badge color="gray">{props.result.lastSource}</Badge>
        </Group>
        <Text size="sm" c="dimmed">
          初回: {props.formatDateTime(props.result.firstSeenAt)}
        </Text>
        <Text size="sm" c="dimmed">
          最新: {props.formatDateTime(props.result.lastSeenAt)}
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
