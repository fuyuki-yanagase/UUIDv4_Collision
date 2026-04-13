// =============================================
// Module: Request Country Detection
// Description: 手動追加リクエストから国コードを推定する。
// =============================================

/**
 * 概要: 手動追加リクエストのヘッダから 2 文字の国コードを推定する。
 * 引数: request: Request - Next.js Route Handler で受け取ったリクエスト
 * 戻り値: string | null - ISO 3166-1 alpha-2 形式の国コード。判定不能なら null
 * 例外: なし
 * 計算量: O(n)
 * 注意: 本番では CDN ヘッダを優先し、ローカルでは Accept-Language を補助的に使う。
 */
export function inferCountryCodeFromRequest(request: Request): string | null {
  const prioritizedHeaderNames = [
    "x-vercel-ip-country",
    "cf-ipcountry",
    "x-country-code",
    "cloudfront-viewer-country",
  ];

  for (const headerName of prioritizedHeaderNames) {
    const normalizedCountryCode = normalizeCountryCode(request.headers.get(headerName));

    if (normalizedCountryCode) {
      return normalizedCountryCode;
    }
  }

  return inferCountryCodeFromAcceptLanguage(request.headers.get("accept-language"));
}

/**
 * 概要: Accept-Language ヘッダから国コード部分だけを取り出す。
 * 引数: acceptLanguageHeader: string | null - 生の Accept-Language ヘッダ
 * 戻り値: string | null - 判定できた国コード
 * 例外: なし
 * 計算量: O(n)
 * 注意: `ja-JP,ja;q=0.9` のような形式から `JP` を抽出する。
 */
function inferCountryCodeFromAcceptLanguage(acceptLanguageHeader: string | null): string | null {
  if (!acceptLanguageHeader) {
    return null;
  }

  const firstLanguageToken = acceptLanguageHeader.split(",")[0]?.trim();

  if (!firstLanguageToken) {
    return null;
  }

  const localeToken = firstLanguageToken.split(";")[0]?.trim();
  const localeParts = localeToken?.split("-") ?? [];
  const regionCandidate = localeParts[1] ?? null;

  return normalizeCountryCode(regionCandidate);
}

/**
 * 概要: 任意文字列を 2 文字の国コードへ正規化する。
 * 引数: rawCountryCode: string | null - 生の候補値
 * 戻り値: string | null - 妥当な国コードなら大文字 2 文字で返す
 * 例外: なし
 * 計算量: O(1)
 * 注意: `XX` や `T1` のような無効値は弾く。
 */
function normalizeCountryCode(rawCountryCode: string | null): string | null {
  if (!rawCountryCode) {
    return null;
  }

  const trimmedCountryCode = rawCountryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(trimmedCountryCode)) {
    return null;
  }

  return trimmedCountryCode;
}
