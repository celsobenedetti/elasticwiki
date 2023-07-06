import { performance } from "perf_hooks";
import { z } from "zod";

import { INDEX, SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";
import { createTRPCRouter, searchProcedure } from "@/server/api/trpc";
import { type SearchTermSuggestOption } from "@elastic/elasticsearch/lib/api/types";

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

        suggest: {
          text: input.query,
          phrase_suggester: {
            phrase: {
              field: "content_unstemmed.shingle",
              confidence: 1,
              size: 1,
              max_errors: 2,
              highlight: {
                pre_tag: "<bold>",
                post_tag: "</bold>",
              },
              direct_generator: [
                {
                  field: "content_unstemmed.shingle",
                },
              ],
            },
          },
        },
      });

      const phraseSuggester = results.suggest?.phrase_suggester;
      const suggestOptions = phraseSuggester?.at(0)
        ?.options as SearchTermSuggestOption[];
      const suggestion = suggestOptions[0];

      const hasSuggestionOustideQuery =
        suggestion != undefined &&
        suggestion?.text.split(" ").some((term) => !input.query.includes(term));

      return {
        suggest: { ...suggestion, hasSuggestionOustideQuery },
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
      return ctx.elastic.search<WikiDocument>({
        query: {
          multi_match: {
            query: input.query,
            type: "bool_prefix",
            fields: [
              "title.autocomplete",
              "title.autocomplete._2gram",
              "title.autocomplete._3gram",
            ],
          },
        },
        highlight: {
          fields: {
            title: {
              require_field_match: false,
              fragment_size: 400,
              number_of_fragments: 1,
              no_match_size: 20,
            },
          },
          pre_tags: ["<bold>"],
          post_tags: ["</bold>"],
        },
      });
    }),
});
