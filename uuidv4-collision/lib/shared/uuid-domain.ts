// =============================================
// Module: UUID Domain Types
// Description: Web とワーカーで共有する UUIDv4 観測ドメインの型を定義する。
// =============================================

/// 目的: UUID 生成イベントの発生源を厳密に表す。
export type GenerationSource = "AUTO" | "MANUAL";

/// 目的: 1 件の UUID 生成試行を時系列表示用に表現する。
export type UuidAttempt = {
  id: number;
  uuid: string;
  source: GenerationSource;
  countryCode: string | null;
  wasCollision: boolean;
  createdAt: string;
};

/// 目的: ダッシュボード上部に表示する累積統計を表す。
export type DashboardStats = {
  totalAttempts: number;
  totalUniqueUuids: number;
  totalCollisions: number;
  latestAttemptAt: string | null;
};

/// 目的: 初期描画と SSE 更新の両方で使うダッシュボード全体の状態を表す。
export type DashboardSnapshot = {
  stats: DashboardStats;
  recentAttempts: UuidAttempt[];
  generatedAt: string;
};

/// 目的: UUID 検索結果 1 件分の集計情報を表す。
export type UuidSearchResult = {
  uuid: string;
  seenCount: number;
  collisionCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  lastSource: GenerationSource;
};
