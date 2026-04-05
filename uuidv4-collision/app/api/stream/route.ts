// =============================================
// Module: Dashboard Stream API
// Description: PostgreSQL の LISTEN/NOTIFY を使ってダッシュボードを SSE 配信する。
// =============================================

import { createPostgresClient } from "@/lib/server/database";
import { getUuidGenerationService } from "@/lib/server/container";
import { getDashboardChannelName } from "@/lib/server/uuid-attempt-repository";
import { formatSseEvent } from "@/lib/shared/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * 概要: SSE 接続を開始し、ダッシュボードの最新状態を継続配信する。
 * 引数: request: Request - 接続の中断通知を受けるための HTTP リクエスト
 * 戻り値: Promise<Response> - text/event-stream レスポンス
 * 例外: PostgreSQL 接続や初回取得に失敗した場合は例外を送出する
 * 計算量: 接続中の更新回数に依存
 * 注意: 1 接続につき 1 本の LISTEN 用 DB 接続を確保する。
 */
export async function GET(request: Request): Promise<Response> {
  const encoder = new TextEncoder();
  const postgresClient = createPostgresClient();
  const uuidGenerationService = getUuidGenerationService();
  const dashboardChannelName = getDashboardChannelName();

  await postgresClient.connect();
  await postgresClient.query(`LISTEN ${dashboardChannelName}`);

  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  let isClosed = false;

  const closeStream = async (): Promise<void> => {
    if (isClosed) {
      return;
    }

    isClosed = true;

    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }

    postgresClient.removeAllListeners("notification");
    await postgresClient.end();
  };

  request.signal.addEventListener("abort", () => {
    void closeStream();
  });

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      /**
       * 概要: 最新スナップショットを取得して 1 イベント分送信する。
       * 引数: なし
       * 戻り値: Promise<void>
       * 例外: DB 取得失敗時は例外を送出する
       * 計算量: O(recentLimit)
       * 注意: 送信に失敗した場合は呼び出し側でストリームを終了する。
       */
      const sendSnapshot = async (): Promise<void> => {
        const snapshot = await uuidGenerationService.getDashboardSnapshot(10);
        controller.enqueue(encoder.encode(formatSseEvent("dashboard", snapshot)));
      };

      const handleNotification = (): void => {
        void sendSnapshot().catch(async () => {
          controller.error(new Error("Failed to send dashboard snapshot."));
          await closeStream();
        });
      };

      postgresClient.on("notification", handleNotification);

      try {
        await sendSnapshot();
      } catch (error) {
        controller.error(error);
        await closeStream();
        return;
      }

      heartbeatTimer = setInterval(() => {
        controller.enqueue(encoder.encode(": keep-alive\n\n"));
      }, 15000);
    },
    cancel: async () => {
      await closeStream();
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
