import { describe, expect, it } from "vitest";

import { CONTENT_FIELD } from "../types";
import { buildBooleanQuery } from "../booleanQuery";

describe("buildBooleanQueryDsl", () => {
  it("should build boolean query with multiple conditions", () => {
    const result = buildBooleanQuery(
      '"some query" with !"negated quoted segments" eating banana not !apple-juice'
    );

    expect(result).toMatchObject({
      should: [{ match: { [CONTENT_FIELD]: "with eating banana not" } }],
      must: [{ match_phrase: { [CONTENT_FIELD]: '"some query"' } }],
      must_not: [
        { match: { [CONTENT_FIELD]: "!apple-juice" } },
        { match_phrase: { [CONTENT_FIELD]: '!"negated quoted segments"' } },
      ],
    });
  });

  it("should build boolean query with only quoted phrases", () => {
    const result = buildBooleanQuery('"some query"');

    expect(result).toMatchObject({
      must: [{ match_phrase: { [CONTENT_FIELD]: '"some query"' } }],
    });
  });

  it("should build boolean query with negated quoted phrases", () => {
    const result = buildBooleanQuery('!"negated quoted segments"');

    expect(result).toMatchObject({
      must_not: [
        { match_phrase: { [CONTENT_FIELD]: '!"negated quoted segments"' } },
      ],
    });
  });

  it("should build boolean query with negated terms", () => {
    const result = buildBooleanQuery("!apple-juice");

    expect(result).toMatchObject({
      must_not: [{ match: { [CONTENT_FIELD]: "!apple-juice" } }],
    });
  });

  it("should build boolean query with regular terms", () => {
    const result = buildBooleanQuery("eating banana not");

    expect(result).toMatchObject({
      should: [{ match: { [CONTENT_FIELD]: "eating banana not" } }],
    });
  });
});
