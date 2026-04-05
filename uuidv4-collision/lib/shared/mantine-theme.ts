// =============================================
// Module: Mantine Theme
// Description: アプリ全体で共有する Mantine テーマを定義する。
// =============================================

import { createTheme } from "@mantine/core";

/**
 * 概要: UUIDv4 ダッシュボード向けの配色とタイポグラフィを定義する。
 * 引数: なし
 * 戻り値: MantineThemeOverride - MantineProvider へ渡すテーマ設定
 * 例外: なし
 * 計算量: O(1)
 * 注意: Zenn の読みやすさと Nani 翻訳の柔らかい青系トーンを両立させる。
 */
export const appMantineTheme = createTheme({
  primaryColor: "sky",
  primaryShade: 5,
  fontFamily: "var(--font-space-grotesk), sans-serif",
  fontFamilyMonospace: "var(--font-ibm-plex-mono), monospace",
  headings: {
    fontFamily: "var(--font-space-grotesk), sans-serif",
    fontWeight: "700",
  },
  colors: {
    sky: [
      "#eef7ff",
      "#d9edff",
      "#b9ddff",
      "#8ec9ff",
      "#63b4ff",
      "#389ffb",
      "#1b90f2",
      "#0b75d5",
      "#085daf",
      "#083f76",
    ],
    ink: [
      "#f5f8fc",
      "#e7edf5",
      "#cdd8e8",
      "#a8b9d1",
      "#7f97b7",
      "#5e789f",
      "#486187",
      "#374d6d",
      "#283b56",
      "#182537",
    ],
  },
  defaultRadius: "md",
  components: {
    Paper: {
      defaultProps: {
        radius: "xl",
        withBorder: true,
      },
    },
    Button: {
      defaultProps: {
        radius: "xl",
      },
    },
    TextInput: {
      defaultProps: {
        radius: "xl",
      },
    },
    Badge: {
      defaultProps: {
        radius: "sm",
        variant: "light",
      },
    },
  },
});
