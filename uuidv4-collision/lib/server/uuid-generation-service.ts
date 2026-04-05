// =============================================
// Module: UUID Generation Service
// Description: UUIDv4 の生成、保存、検索をまとめるアプリケーションサービス。
// =============================================

import { randomUUID } from "crypto";
import { normalizeUuidSearchQuery } from "@/lib/shared/search";
import type { DashboardSnapshot, GenerationSource, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

type UuidAttemptRepository = {
  recordAttempt(input: { uuid: string; source: GenerationSource }): Promise<UuidAttempt>;
  getDashboardSnapshot(recentLimit: number): Promise<DashboardSnapshot>;
  searchRegistries(normalizedQuery: string, limit: number): Promise<UuidSearchResult[]>;
};

/**
 * 目的: UUIDv4 の生成と永続化をユースケース単位でまとめる。
 * 主要責務: UUID 生成、ダッシュボード取得、検索語の正規化
 * 使用例: API Route やワーカーから this.recordGeneratedAttempt("AUTO") を呼ぶ
 */
export class UuidGenerationService {
  private readonly repository: UuidAttemptRepository;

  private readonly uuidFactory: () => string;

  /**
   * 概要: サービスを生成する。
   * 引数: repository: UuidAttemptRepository - 永続化と検索を担うリポジトリ
   * 引数: uuidFactory: () => string - テスト差し替え可能な UUID 生成関数
   * 戻り値: UuidGenerationService - 構築済みサービス
   * 例外: なし
   * 計算量: O(1)
   * 注意: uuidFactory の既定値には crypto.randomUUID を使う。
   */
  public constructor(repository: UuidAttemptRepository, uuidFactory: () => string = () => randomUUID()) {
    this.repository = repository;
    this.uuidFactory = uuidFactory;
  }

  /**
   * 概要: 新しい UUIDv4 を生成して保存する。
   * 引数: source: GenerationSource - AUTO または MANUAL
   * 戻り値: Promise<UuidAttempt> - 保存された試行レコード
   * 例外: UUID 生成や永続化に失敗した場合は例外を送出する
   * 計算量: O(1)
   * 注意: 手動追加でもユーザは UUID 値を指定できず、常にサーバ側で生成する。
   */
  public async recordGeneratedAttempt(source: GenerationSource): Promise<UuidAttempt> {
    const generatedUuid = this.uuidFactory();

    return await this.repository.recordAttempt({
      uuid: generatedUuid,
      source,
    });
  }

  /**
   * 概要: ダッシュボード表示用スナップショットを取得する。
   * 引数: recentLimit: number - recentAttempts として返す件数
   * 戻り値: Promise<DashboardSnapshot> - 最新の統計と最近の試行一覧
   * 例外: リポジトリ取得に失敗した場合は例外を送出する
   * 計算量: リポジトリ実装に依存
   * 注意: recentLimit の上限制御は API 側で行う前提。
   */
  public async getDashboardSnapshot(recentLimit: number): Promise<DashboardSnapshot> {
    return await this.repository.getDashboardSnapshot(recentLimit);
  }

  /**
   * 概要: UUID の検索語を正規化して検索結果を返す。
   * 引数: rawQuery: string | null | undefined - ユーザが入力した検索語
   * 引数: limit: number - 返却件数上限
   * 戻り値: Promise<UuidSearchResult[]> - 検索結果
   * 例外: リポジトリ取得に失敗した場合は例外を送出する
   * 計算量: O(n + repository)
   * 注意: 空検索では最近更新された UUID 一覧を返す。
   */
  public async searchRegistries(
    rawQuery: string | null | undefined,
    limit: number,
  ): Promise<UuidSearchResult[]> {
    const normalizedQuery = normalizeUuidSearchQuery(rawQuery);

    return await this.repository.searchRegistries(normalizedQuery, limit);
  }
}
