import { z } from "zod";

import { createTRPCRouter, searchProcedure } from "@/server/api/trpc";
import {
  type AggregationsAggregate,
  type SearchResponse as ClientSearchResponse,
} from "@elastic/elasticsearch/lib/api/types";
import { SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";

type DocumentResponse = ClientSearchResponse<
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
  search: searchProcedure
    .input(z.object({ query: z.string() }))
    .query<SearchResponse>(async ({ ctx, input }) => {
      const results = await ctx.elastic.search<WikiDocument>({
        index: "wikipedia",
        size: SEARCH_RESULTS_SIZE,
        query: {
          match: { content: input.query },
        },
      });
      return results;
    }),

  infiniteSearch: searchProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query<InfiniteSearchResponse>(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 1;

      const results = await ctx.elastic.search<WikiDocument>({
        index: "wikipedia",
        size: SEARCH_RESULTS_SIZE,
        from: SEARCH_RESULTS_SIZE * cursor,
        query: {
          match: { content: input.query },
        },
      });

      return { ...results, nextCursor: cursor + 1 };
    }),
});
