import assert from "node:assert/strict";
import test from "node:test";
import { UuidGenerationService } from "@/lib/server/uuid-generation-service";
import type { DashboardSnapshot, GenerationSource, UuidAttempt, UuidSearchResult } from "@/lib/shared/uuid-domain";

class FakeUuidAttemptRepository {
  public lastRecordedInput: { uuid: string; source: GenerationSource } | null = null;

  public async recordAttempt(input: {
    uuid: string;
    source: GenerationSource;
  }): Promise<UuidAttempt> {
    this.lastRecordedInput = input;

    return {
      id: 1,
      uuid: input.uuid,
      source: input.source,
      wasCollision: false,
      createdAt: "2026-04-05T00:00:00.000Z",
    };
  }

  public async getDashboardSnapshot(_recentLimit: number): Promise<DashboardSnapshot> {
    void _recentLimit;

    return {
      stats: {
        totalAttempts: 1,
        totalUniqueUuids: 1,
        totalCollisions: 0,
        latestAttemptAt: "2026-04-05T00:00:00.000Z",
      },
      recentAttempts: [],
      generatedAt: "2026-04-05T00:00:00.000Z",
    };
  }

  public async searchRegistries(normalizedQuery: string, _limit: number): Promise<UuidSearchResult[]> {
    void _limit;

    return [
      {
        uuid: normalizedQuery,
        seenCount: 1,
        collisionCount: 0,
        firstSeenAt: "2026-04-05T00:00:00.000Z",
        lastSeenAt: "2026-04-05T00:00:00.000Z",
        lastSource: "AUTO",
      },
    ];
  }
}

test("recordGeneratedAttempt uses the injected uuid factory and source", async () => {
  const fakeRepository = new FakeUuidAttemptRepository();
  const uuidGenerationService = new UuidGenerationService(fakeRepository, () => "00000000-0000-4000-8000-000000000001");

  const attempt = await uuidGenerationService.recordGeneratedAttempt("MANUAL");

  assert.deepEqual(fakeRepository.lastRecordedInput, {
    uuid: "00000000-0000-4000-8000-000000000001",
    source: "MANUAL",
  });
  assert.equal(attempt.uuid, "00000000-0000-4000-8000-000000000001");
});

test("searchRegistries normalizes the raw query before delegating", async () => {
  const fakeRepository = new FakeUuidAttemptRepository();
  const uuidGenerationService = new UuidGenerationService(fakeRepository, () => "ignored");

  const results = await uuidGenerationService.searchRegistries("  ABCD  ", 8);

  assert.equal(results[0]?.uuid, "abcd");
});
