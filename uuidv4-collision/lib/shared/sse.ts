// =============================================
// Module: SSE Utilities
// Description: Server-Sent Events の payload を安定した形式で構築する。
// =============================================

/**
 * 概要: SSE 1 イベント分の文字列を組み立てる。
 * 引数: eventName: string - EventSource 側で購読するイベント名
 * 引数: payload: unknown - JSON へシリアライズするデータ
 * 戻り値: string - text/event-stream へそのまま書き込める文字列
 * 例外: JSON.stringify が循環参照で失敗した場合に例外を伝播する
 * 計算量: O(n)
 * 注意: データ部は複数行に分割し、SSE の仕様に合わせて各行へ `data:` を付与する。
 */
export function formatSseEvent(eventName: string, payload: unknown): string {
  const serializedPayload = JSON.stringify(payload);
  const dataLines = serializedPayload.split("\n").map((line) => `data: ${line}`).join("\n");

  return `event: ${eventName}\n${dataLines}\n\n`;
}
