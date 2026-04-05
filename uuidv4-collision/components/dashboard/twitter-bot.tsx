"use client";

// =============================================
// Module: Dashboard Twitter Bot
// Description: 右下の Twitter bot 集約エリアを描画する。
// =============================================

import { Badge, Divider, Group, Paper, Stack, Text, Title } from "@mantine/core";
import type { ReactElement } from "react";

/**
 * 目的: 将来の Twitter bot 情報集約エリアを先に確保する。
 * 主要責務: プレースホルダーセクションの描画
 * 使用例: DashboardClient から右下領域として描画する
 */
export function TwitterBot(): ReactElement {
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
