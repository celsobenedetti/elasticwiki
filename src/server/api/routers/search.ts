import { z } from "zod";

import { createTRPCRouter, searchProcedure } from "@/server/api/trpc";
import {
  type AggregationsAggregate,
  type SearchResponse as ElasticSearchResponse,
} from "@elastic/elasticsearch/lib/api/types";
import { INDEX, SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";

type DocumentResponse = ElasticSearchResponse<
  WikiDocument,
  Record<string, AggregationsAggregate>
>;

interface SearchResponse extends DocumentResponse {
  elapsedTime?: number;
}

interface InfiniteSearchResponse extends SearchResponse {
  nextCursor: number;
}

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

      const results = await ctx.elastic.search<WikiDocument>({
        index: INDEX,
        size: SEARCH_RESULTS_SIZE,
        from: SEARCH_RESULTS_SIZE * cursor,
        query: {
          match: { content: input.query },
        },
        aggs: {
          keywords: {
            significant_text: {
              field: "content",
            },
          },
        },
      });

      return {
        total: results.hits.total,
        elapsedTime: ctx.elapsedTime,
        nextCursor: cursor + 1,
        docs: [...results.hits.hits],
      };
    }),
});
