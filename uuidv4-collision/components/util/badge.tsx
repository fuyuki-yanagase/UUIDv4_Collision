"use client";

// =============================================
// Module: Utility Badge
// Description: 画面全体で使う共通バッジ表示を提供する。
// =============================================

import { Box } from "@mantine/core";
import type { CSSProperties, ReactElement, ReactNode } from "react";

type AppBadgeSize = "sm" | "md";

type AppBadgeProps = {
  backgroundColor: string;
  borderColor?: string;
  children: ReactNode;
  color: string;
  size?: AppBadgeSize;
};

const SIZE_STYLES: Record<AppBadgeSize, CSSProperties> = {
  sm: {
    fontSize: "0.72rem",
    minHeight: "1.7rem",
    padding: "0.32rem 0.62rem",
  },
  md: {
    fontSize: "0.8rem",
    minHeight: "1.9rem",
    padding: "0.38rem 0.74rem",
  },
};

/**
 * 概要: ページ全体で統一して使う角丸バッジを描画する。
 * 引数: props.backgroundColor: string - 背景色
 * 引数: props.borderColor: string | undefined - 枠線色。省略時は背景色を使う
 * 引数: props.children: ReactNode - バッジに表示する文言やアイコン
 * 引数: props.color: string - 文字色
 * 引数: props.size: "sm" | "md" | undefined - バッジの大きさ
 * 戻り値: ReactElement - 共通バッジ要素
 * 例外: なし
 * 計算量: O(1)
 * 注意: 行高と上下余白を固定し、和文や英数字でも上下が見切れないことを優先する。
 */
export function AppBadge(props: AppBadgeProps): ReactElement {
  const size = props.size ?? "sm";
  const borderColor = props.borderColor ?? props.backgroundColor;

  return (
    <Box
      component="span"
      style={{
        alignItems: "center",
        background: props.backgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "7.5px",
        color: props.color,
        display: "inline-flex",
        fontFeatureSettings: "\"tnum\"",
        fontWeight: 700,
        letterSpacing: "0.02em",
        lineHeight: 1,
        verticalAlign: "middle",
        whiteSpace: "nowrap",
        ...SIZE_STYLES[size],
      }}
    >
      {props.children}
    </Box>
  );
}
