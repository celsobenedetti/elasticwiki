import { z } from "zod";

const DateRangeSchema = z.object({
  before: z.date().optional(),
  after: z.date().optional(),
});

const ReadTimeSchema = z.object({
  lesser: z.number().optional(),
  greater: z.number().optional(),
});

export const BooleanQuerySchema = z.object({
  query: z.string(),
  dates: DateRangeSchema,
  readTime: ReadTimeSchema,
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
});

export type BooleanQueryInput = z.infer<typeof BooleanQuerySchema>;
export type RangeQuery = z.infer<typeof DateRangeSchema>;
export type ReadTimeQuery = z.infer<typeof ReadTimeSchema>;
