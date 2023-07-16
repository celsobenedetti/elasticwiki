import { type RangeQuery } from "./schema";

export function buildDateQuery(dates: RangeQuery) {
  const { before, after } = dates;
  if (!before && !after) return {};

  return {
    lte: before?.toISOString().slice(0, 10),
    gte: after?.toISOString().slice(0, 10),
  };
}
