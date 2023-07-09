import { performance } from "perf_hooks";
import { z } from "zod";

import { createTRPCRouter, searchProcedure } from "@/server/api/trpc";
import { type WikiDocument } from "@/lib/search";
import {
  buildInfiniteSearchRequest,
  parseKeywordSuggestions,
  buildAutocompleteSearchRequest,
} from "@/server/api/utils/search";

export const searchRouter = createTRPCRouter({
  infiniteSearch: searchProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 0;

      const startTime = performance.now();

      const results = await ctx.elastic.search<WikiDocument>(
        buildInfiniteSearchRequest(cursor, input.query)
      );

      const suggestion = parseKeywordSuggestions(
        input.query,
        results.suggest?.phrase_suggester
      );

      return {
        suggest: suggestion,
        aggs: results.aggregations,
        elapsedTime: performance.now() - startTime,
        total: results.hits.total,
        nextCursor: cursor + 1,
        docs: results.hits.hits,
      };
    }),

  autocomplete: searchProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.elastic.search<WikiDocument>(
        buildAutocompleteSearchRequest(input.query)
      );
    }),
});
