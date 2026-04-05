// =============================================
// Module: Root Layout
// Description: アプリ全体のメタデータとグローバルタイポグラフィを定義する。
// =============================================

import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "UUIDv4 Collision Observatory",
  description: "UUIDv4 を 1 秒ごとに PostgreSQL へ追加し、衝突をリアルタイム観測するサイト。",
};

/**
 * 概要: 全ページ共通の HTML 骨格を返す。
 * 引数: children: React.ReactNode - 画面ごとの本文
 * 戻り値: JSX.Element - HTML ルートレイアウト
 * 例外: なし
 * 計算量: O(1)
 * 注意: フォントは CSS 変数経由で Tailwind テーマへ接続する。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html lang="ja" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
