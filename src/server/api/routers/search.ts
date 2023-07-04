import { performance } from "perf_hooks";
import { z } from "zod";

import { INDEX, SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";
import { createTRPCRouter, searchProcedure } from "@/server/api/trpc";

export const searchRouter = createTRPCRouter({
  infiniteSearch: searchProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 1;

      const startTime = performance.now();
      const results = await ctx.elastic.search<WikiDocument>({
        index: INDEX,
        size: SEARCH_RESULTS_SIZE,
        from: SEARCH_RESULTS_SIZE * cursor,
        _source_excludes: "content_unstemmed",
        query: {
          match: { content: input.query },
        },
        aggs: {
          suggestions: {
            significant_text: {
              field: "content_unstemmed",
            },
          },
        },

        highlight: {
          fields: {
            content: {
              number_of_fragments: 0,
            },
          },
        },
      });

      return {
        aggs: results.aggregations,
        elapsedTime: performance.now() - startTime,
        total: results.hits.total,
        nextCursor: cursor + 1,
        docs: results.hits.hits,
      };
    }),
});
