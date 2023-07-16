import { z } from "zod";

const DateRangeSchema = z.object({
  before: z.date().optional(),
  after: z.date().optional(),
});

export const BooleanQuerySchema = z.object({
  query: z.string(),
  dates: DateRangeSchema,
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export type BooleanQueryInput = z.infer<typeof BooleanQuerySchema>;
export type RangeQuery = z.infer<typeof DateRangeSchema>;
