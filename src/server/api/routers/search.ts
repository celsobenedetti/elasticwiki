import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

interface Document {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

export const searchRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.elastic.search<Document>({
        index: "wikipedia",
        query: {
          match: { content: input.query },
        },
      });
    }),
});
