// =============================================
// Module: Root Layout
// Description: Mantine テーマとグローバルスタイルを全体へ適用する。
// =============================================

import type { Metadata } from "next";
import type { ReactElement, ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { appMantineTheme } from "@/lib/shared/mantine-theme";
import "@mantine/core/styles.css";
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
  title: "UUIDv4衝突観測所",
  description:
    "UUIDv4をひたすら生成し、衝突が起きる瞬間を観測・検索できるサイト。",
  metadataBase: new URL("https://uuid-v4.fuyuki-connect.net"),
  icons: {
    icon: "/uuid-v4-icon.png",
    shortcut: "/uuid-v4-icon.png",
    apple: "/uuid-v4-icon.png",
  },
  openGraph: {
    title: "UUIDv4衝突観測所",
    description:
      "UUIDv4をひたすら生成し、衝突が起きる瞬間を観測・検索できるサイト。",
    url: "https://uuid-v4.fuyuki-connect.net",
    siteName: "UUIDv4 Collision Observatory",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/uuidv4-collision-check-and-monitor.png",
        width: 1200,
        height: 630,
        alt: "UUIDv4 Collision Observatory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UUIDv4衝突観測所",
    description:
      "UUIDv4をひたすら生成し、衝突が起きる瞬間を観測・検索できるサイト。",
    images: ["/uuidv4-collision-check-and-monitor.png"],
  },
};

/**
 * 概要: 全ページ共通の HTML 骨格と MantineProvider を返す。
 * 引数: children: ReactNode - 画面ごとの本文
 * 戻り値: ReactElement - HTML ルートレイアウト
 * 例外: なし
 * 計算量: O(1)
 * 注意: 色スキームは light 固定とし、白基調の読みやすさを優先する。
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactElement {
  return (
    <html
      lang="ja"
      data-mantine-color-scheme="light"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <MantineProvider theme={appMantineTheme} forceColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
