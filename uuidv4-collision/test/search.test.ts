import assert from "node:assert/strict";
import test from "node:test";
import { buildUuidSearchPattern, normalizeUuidSearchQuery, parsePositiveInteger } from "@/lib/shared/search";
import { formatSseEvent } from "@/lib/shared/sse";

test("normalizeUuidSearchQuery trims whitespace and lowercases the value", () => {
  assert.equal(normalizeUuidSearchQuery("  ABCD-EF  "), "abcd-ef");
});

test("buildUuidSearchPattern escapes wildcard characters for ILIKE", () => {
  assert.equal(buildUuidSearchPattern("ab%_cd"), "%ab\\%\\_cd%");
});

test("parsePositiveInteger falls back on invalid values and enforces a maximum", () => {
  assert.equal(parsePositiveInteger(null, 8, 25), 8);
  assert.equal(parsePositiveInteger("0", 8, 25), 8);
  assert.equal(parsePositiveInteger("99", 8, 25), 25);
  assert.equal(parsePositiveInteger("12", 8, 25), 12);
});

test("formatSseEvent renders a named SSE event", () => {
  assert.equal(
    formatSseEvent("dashboard", {
      count: 1,
    }),
    "event: dashboard\ndata: {\"count\":1}\n\n",
  );
});
