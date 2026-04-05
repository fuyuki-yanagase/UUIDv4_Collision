// =============================================
// Module: Service Container
// Description: API Route とページで共有するサービスの組み立てを担う。
// =============================================

import { PostgresUuidAttemptRepository } from "@/lib/server/uuid-attempt-repository";
import { UuidGenerationService } from "@/lib/server/uuid-generation-service";

const uuidAttemptRepository = new PostgresUuidAttemptRepository();

/**
 * 概要: アプリ全体で共有する UUID 生成サービスを返す。
 * 引数: なし
 * 戻り値: UuidGenerationService - 構築済みサービス
 * 例外: なし
 * 計算量: O(1)
 * 注意: 軽量なサービスのため、プロセス内シングルトンとして共有する。
 */
export function getUuidGenerationService(): UuidGenerationService {
  return new UuidGenerationService(uuidAttemptRepository);
}
