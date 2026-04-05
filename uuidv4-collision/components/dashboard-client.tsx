"use client";

// =============================================
// Module: Dashboard Client
// Description: UUIDv4 衝突観測ダッシュボードのクライアント体験を構築する。
// =============================================

import { startTransition, useDeferredValue, useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { DashboardSnapshot, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

type DashboardClientProps = {
  initialSnapshot: DashboardSnapshot;
  initialSearchResults: UuidSearchResult[];
};

/**
 * 目的: SSE、手動追加、検索をまとめて扱うダッシュボード UI を提供する。
 * 主要責務: 状態保持、リアルタイム更新、ユーザ操作の送信
 * 使用例: app/page.tsx から初期スナップショットを渡して描画する
 */
export function DashboardClient(props: DashboardClientProps): ReactElement {
  const [snapshot, setSnapshot] = useState<DashboardSnapshot>(props.initialSnapshot);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UuidSearchResult[]>(props.initialSearchResults);
  const [isManualTriggerRunning, setIsManualTriggerRunning] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [streamStatus, setStreamStatus] = useState<"connecting" | "live" | "retrying">("connecting");
  const [manualTriggerMessage, setManualTriggerMessage] = useState<string>(
    "手動追加を押すと、ワーカーとは別に 1 件だけ UUIDv4 を生成します。",
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);

  /**
   * 概要: 画面表示用に最新試行の派手さを少しだけ強調した要約文を作る。
   * 引数: なし
   * 戻り値: string - ヒーロー領域へ表示する要約文
   * 例外: なし
   * 計算量: O(1)
   * 注意: 衝突が無くても「まだ平穏」という文脈で体験価値を出す。
   */
  const latestAttempt = snapshot.recentAttempts[0];
  const latestAttemptSummary = !latestAttempt
    ? "まだ試行履歴はありません。ワーカーを起動すると 1 秒ごとに記録が積み上がります。"
    : latestAttempt.wasCollision
      ? `衝突発生: ${latestAttempt.uuid} が再登場しました。`
      : `最新の UUID は ${latestAttempt.uuid} です。いまのところ衝突は起きていません。`;

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.addEventListener("dashboard", (event) => {
      const nextSnapshot = JSON.parse(event.data) as DashboardSnapshot;

      startTransition(() => {
        setSnapshot(nextSnapshot);
        setStreamStatus("live");
      });
    });

    eventSource.onerror = () => {
      setStreamStatus("retrying");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const abortController = new AbortController();

    const runSearch = async (): Promise<void> => {
      setIsSearchLoading(true);

      try {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(deferredSearchQuery)}&limit=8`,
          {
            method: "GET",
            signal: abortController.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const payload = (await response.json()) as {
          results: UuidSearchResult[];
        };

        startTransition(() => {
          setSearchResults(payload.results);
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearchLoading(false);
        }
      }
    };

    void runSearch();

    return () => {
      abortController.abort();
    };
  }, [deferredSearchQuery]);

  /**
   * 概要: 手動追加ボタンから 1 件の UUID 生成イベントを実行する。
   * 引数: なし
   * 戻り値: Promise<void>
   * 例外: fetch 失敗時は内部で握りつぶさず console へ記録する
   * 計算量: O(1 + recentLimit)
   * 注意: SSE 更新を待たず、レスポンスの snapshot で直ちに UI を更新する。
   */
  const handleManualTrigger = async (): Promise<void> => {
    setIsManualTriggerRunning(true);

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Manual trigger request failed.");
      }

      const payload = (await response.json()) as {
        attempt: UuidAttempt;
        snapshot: DashboardSnapshot;
      };

      startTransition(() => {
        setSnapshot(payload.snapshot);
        setManualTriggerMessage(
          payload.attempt.wasCollision
            ? `手動追加で衝突しました: ${payload.attempt.uuid}`
            : `手動追加で新規 UUID を保存しました: ${payload.attempt.uuid}`,
        );
      });
    } catch (error) {
      console.error(error);
      setManualTriggerMessage("手動追加に失敗しました。コンテナと DB の状態を確認してください。");
    } finally {
      setIsManualTriggerRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(0,201,167,0.22),_transparent_28%),linear-gradient(180deg,_#08111d_0%,_#091625_35%,_#071018_100%)] text-white">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-12">
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-cyan-200/80">
              UUIDv4 Collision Observatory
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-6xl">
              1 秒ごとに UUIDv4 を追加して、衝突という天文学的な偶然を待つサイトです。
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              ワーカーが PostgreSQL に 1 件ずつ書き込み、Next.js が SSE でリアルタイム表示します。
              手動追加ボタンで観測頻度を少しだけ上げられます。
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/8 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/75">Latest Atmosphere</p>
              <p className="mt-3 text-lg leading-8 text-cyan-50">{latestAttemptSummary}</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0e1824]/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-amber-200/80">Manual Trigger</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">観測に 1 件だけ上乗せする</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">{manualTriggerMessage}</p>
            <button
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-cyan-300 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-500"
              type="button"
              onClick={() => {
                void handleManualTrigger();
              }}
              disabled={isManualTriggerRunning}
            >
              {isManualTriggerRunning ? "追加中..." : "手動で 1 件追加"}
            </button>
            <div className="mt-8 rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Stream Status</p>
              <p className="mt-3 text-lg text-white">
                {streamStatus === "live"
                  ? "LIVE"
                  : streamStatus === "retrying"
                    ? "RETRYING"
                    : "CONNECTING"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                SSE 接続が有効な間、ワーカーや手動追加の結果は自動で反映されます。
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="総試行回数"
            value={snapshot.stats.totalAttempts.toLocaleString("ja-JP")}
            accentClassName="text-cyan-200"
          />
          <StatCard
            label="一意 UUID 数"
            value={snapshot.stats.totalUniqueUuids.toLocaleString("ja-JP")}
            accentClassName="text-emerald-200"
          />
          <StatCard
            label="衝突回数"
            value={snapshot.stats.totalCollisions.toLocaleString("ja-JP")}
            accentClassName="text-rose-200"
          />
          <StatCard
            label="最終観測時刻"
            value={formatDateTime(snapshot.stats.latestAttemptAt)}
            accentClassName="text-amber-100"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Recent Attempts</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">直近の生成イベント</h2>
              </div>
              <p className="text-sm text-slate-400">{formatDateTime(snapshot.generatedAt)}</p>
            </div>
            <div className="mt-6 space-y-3">
              {snapshot.recentAttempts.map((attempt) => {
                return (
                  <article
                    key={attempt.id}
                    className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold tracking-[0.2em] ${
                          attempt.wasCollision
                            ? "bg-rose-400/18 text-rose-100"
                            : "bg-emerald-400/18 text-emerald-100"
                        }`}
                      >
                        {attempt.wasCollision ? "COLLISION" : "UNIQUE"}
                      </span>
                      <span className="rounded-full bg-white/8 px-3 py-1 text-xs tracking-[0.2em] text-slate-200">
                        {attempt.source}
                      </span>
                      <span className="text-xs text-slate-400">{formatDateTime(attempt.createdAt)}</span>
                    </div>
                    <p className="mt-4 break-all font-mono text-sm leading-7 text-cyan-100">
                      {attempt.uuid}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0e1824]/90 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">UUID Search</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">生成済み UUID を検索する</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              完全一致でも部分一致でも検索できます。空欄のままなら最近観測した UUID を表示します。
            </p>
            <label className="mt-6 block">
              <span className="sr-only">UUID search</span>
              <input
                className="w-full rounded-[1.1rem] border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300"
                type="search"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                }}
                placeholder="例: 6f8c8a32"
              />
            </label>
            <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-slate-500">
              <span>{isSearchLoading ? "Searching..." : "Results"}</span>
              <span>{searchResults.length} items</span>
            </div>
            <div className="mt-4 space-y-3">
              {searchResults.map((result) => {
                return (
                  <article key={result.uuid} className="rounded-[1.25rem] border border-white/10 bg-black/25 p-4">
                    <p className="break-all font-mono text-sm leading-7 text-cyan-100">{result.uuid}</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MetricChip label="観測回数" value={result.seenCount.toLocaleString("ja-JP")} />
                      <MetricChip label="衝突回数" value={result.collisionCount.toLocaleString("ja-JP")} />
                      <MetricChip label="最終ソース" value={result.lastSource} />
                    </div>
                    <div className="mt-4 flex flex-col gap-1 text-xs text-slate-500">
                      <span>初回: {formatDateTime(result.firstSeenAt)}</span>
                      <span>最新: {formatDateTime(result.lastSeenAt)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  accentClassName: string;
};

/**
 * 概要: 上部の統計カード 1 枚分を描画する。
 * 引数: props: StatCardProps - ラベル、値、アクセント色
 * 戻り値: JSX.Element - 統計カード
 * 例外: なし
 * 計算量: O(1)
 * 注意: 数字の視認性を上げるため大きめのタイポグラフィを使う。
 */
function StatCard(props: StatCardProps): ReactElement {
  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{props.label}</p>
      <p className={`mt-4 text-3xl font-semibold tracking-tight ${props.accentClassName}`}>{props.value}</p>
    </article>
  );
}

type MetricChipProps = {
  label: string;
  value: string;
};

/**
 * 概要: 検索結果内の小さな集計値を表示する。
 * 引数: props: MetricChipProps - ラベルと値
 * 戻り値: JSX.Element - 小型の表示チップ
 * 例外: なし
 * 計算量: O(1)
 * 注意: 情報量が増えても視線移動しやすいように縦並びにする。
 */
function MetricChip(props: MetricChipProps): ReactElement {
  return (
    <div className="rounded-[1rem] border border-white/8 bg-white/5 px-3 py-3">
      <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">{props.label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{props.value}</p>
    </div>
  );
}

/**
 * 概要: ISO 文字列を日本向けの見やすい日時表現へ整形する。
 * 引数: value: string | null - ISO 8601 文字列
 * 戻り値: string - 表示用の日時文字列
 * 例外: なし
 * 計算量: O(1)
 * 注意: null は「未観測」と表示し、初期状態の不自然な空白を避ける。
 */
function formatDateTime(value: string | null): string {
  if (!value) {
    return "未観測";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}
