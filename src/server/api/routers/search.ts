import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  type AggregationsAggregate,
  type SearchResponse as ClientSearchResponse,
} from "@elastic/elasticsearch/lib/api/types";

interface Document {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

type DocumentResponse = ClientSearchResponse<
  Document,
  Record<string, AggregationsAggregate>
>;

interface SearchResponse extends DocumentResponse {
  elapsedTime?: number;
}

interface InfiniteSearchResponse extends SearchResponse {
  nextCursor: number;
}

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query<SearchResponse>(async ({ ctx, input }) => {
      const results = await ctx.elastic.search<Document>({
        index: "wikipedia",
        size: SIZE,
        query: {
          match: { content: input.query },
        },
      });
      return results;
    }),

  infiniteSearch: publicProcedure
    .input(
      z.object({
        query: z.string(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
      })
    )
    .query<InfiniteSearchResponse>(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 1;

      const results = await ctx.elastic.search<Document>({
        index: "wikipedia",
        size: SIZE,
        from: SIZE * cursor,
        query: {
          match: { content: input.query },
        },
      });

      return { ...results, nextCursor: cursor + 1 };
    }),
});

const SIZE = 10;
