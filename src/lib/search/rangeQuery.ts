import { type ReadTimeQuery, type RangeQuery } from "./schema";

export function buildDateQuery(dates: RangeQuery) {
  const { before, after } = dates;

  return {
    lte: before?.toISOString().slice(0, 10),
    gte: after?.toISOString().slice(0, 10),
  };
}

export function buildReadTimeRange(readTime: ReadTimeQuery) {
  const { lesser, greater } = readTime;

  return {
    lte: lesser,
    gte: greater,
  };
}
