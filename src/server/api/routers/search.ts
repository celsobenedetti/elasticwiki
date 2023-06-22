import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  type AggregationsAggregate,
  type SearchResponse,
} from "@elastic/elasticsearch/lib/api/types";

interface Document {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

interface Response
  extends SearchResponse<Document, Record<string, AggregationsAggregate>> {
  elapsedTime?: number;
}

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query<Response>(async ({ ctx, input }) => {
      const results = await ctx.elastic.search<Document>({
        index: "wikipedia",
        query: {
          match: { content: input.query },
        },
      });
      return results;
    }),
});
