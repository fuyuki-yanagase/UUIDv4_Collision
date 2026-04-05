// =============================================
// Module: Search Utilities
// Description: UUID 検索 API とクライアント検索 UI で使う共通の入力整形を行う。
// =============================================

/**
 * 概要: UUID 検索語を比較しやすい形へ正規化する。
 * 引数: rawQuery: string | null | undefined - ユーザが入力した生の検索文字列
 * 戻り値: string - 前後空白を除去し小文字化した検索文字列
 * 例外: なし
 * 計算量: O(n)
 * 注意: 空文字も許可し、呼び出し側で「最近の UUID 一覧」を返す用途に使う。
 */
export function normalizeUuidSearchQuery(rawQuery: string | null | undefined): string {
  return (rawQuery ?? "").trim().toLowerCase();
}

/**
 * 概要: SQL の ILIKE で使う検索パターンを組み立てる。
 * 引数: normalizedQuery: string - normalizeUuidSearchQuery 済みの検索語
 * 戻り値: string - 部分一致検索用のパターン
 * 例外: なし
 * 計算量: O(n)
 * 注意: `%` と `_` はエスケープし、意図しないワイルドカード展開を防ぐ。
 */
export function buildUuidSearchPattern(normalizedQuery: string): string {
  const escapedQuery = normalizedQuery.replaceAll("\\", "\\\\").replaceAll("%", "\\%").replaceAll("_", "\\_");

  return `%${escapedQuery}%`;
}

/**
 * 概要: クエリ文字列から件数上限を安全に取り出す。
 * 引数: rawValue: string | null - URL パラメータの生値
 * 引数: fallbackValue: number - 不正値だった場合の既定値
 * 引数: maximumValue: number - 上限値
 * 戻り値: number - 1 以上 maximumValue 以下の整数
 * 例外: なし
 * 計算量: O(1)
 * 注意: NaN、0、負数、小数はすべて既定値に丸める。
 */
export function parsePositiveInteger(
  rawValue: string | null,
  fallbackValue: number,
  maximumValue: number,
): number {
  const parsedValue = Number(rawValue);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return fallbackValue;
  }

  return Math.min(parsedValue, maximumValue);
}
