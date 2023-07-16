import {
  type QueryDslTextQueryType,
  type SearchRequest,
  type SearchSuggest,
  type SearchTermSuggestOption,
} from "@elastic/elasticsearch/lib/api/types";

import {
  type WikiDocument,
  INDEX,
  POST_TAG,
  PRE_TAG,
  SEARCH_RESULTS_SIZE,
  TITLE_FIELD,
  DATE_FIELD,
  TIME_FIELD,
} from "@/lib/search";
import { buildMatchClauses } from "@/lib/search/booleanQuery";
import { buildDateQuery, buildReadTimeRange } from "@/lib/search/rangeQuery";
import { type BooleanQueryInput } from "@/lib/search/schema";

export function buildInfiniteSearchRequest(
  cursor: number,
  input: BooleanQueryInput
): SearchRequest {
  const { query, dates, readTime } = input;

  const { must, must_not, should } = buildMatchClauses(query);
  const dateRange = buildDateQuery(dates);
  const readTimeRange = buildReadTimeRange(readTime);

  return {
    index: INDEX,
    size: SEARCH_RESULTS_SIZE,
    from: SEARCH_RESULTS_SIZE * cursor,
    _source_excludes: "content_unstemmed",
    query: {
      bool: {
        should,
        must: [
          { range: { [DATE_FIELD]: dateRange } },
          { range: { [TIME_FIELD]: readTimeRange } },
          ...must,
        ],
        must_not,
      },
    },
    aggs: {
      keywords: {
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
      pre_tags: [PRE_TAG],
      post_tags: [POST_TAG],
    },

    suggest: {
      text: query,

      phrase_suggester: {
        phrase: {
          field: "content_unstemmed.shingle",
          confidence: 1,
          size: 1,
          max_errors: 2,
          direct_generator: [
            {
              field: "content_unstemmed.shingle",
            },
          ],

          highlight: {
            pre_tag: PRE_TAG,
            post_tag: POST_TAG,
          },
        },
      },
    },
  };
}

export function parseKeywordSuggestions(
  query: string,
  phrase_suggester: SearchSuggest<WikiDocument>[] | undefined
) {
  const options = phrase_suggester?.at(0)?.options as SearchTermSuggestOption[];
  const suggestion = options?.at(0);

  if (!suggestion) return { hasSuggestionOustideQuery: false };

  const hasSuggestionOustideQuery = suggestion?.text
    .split(" ")
    .some((term) => !query.includes(term));

  return { ...suggestion, hasSuggestionOustideQuery };
}

export function buildAutocompleteSearchRequest(query: string): SearchRequest {
  const { must, must_not, terms } = buildMatchClauses(query, TITLE_FIELD);

  return {
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: terms,
              type: "bool_prefix" as QueryDslTextQueryType,

              fields: [
                "title.autocomplete",
                "title.autocomplete._2gram",
                "title.autocomplete._3gram",
              ],
            },
          },
        ],
        must,
        must_not,
      },
    },
    highlight: {
      fields: {
        title: {
          type: "unified",
          highlight_query: {
            bool: {
              should: [
                {
                  match_phrase_prefix: {
                    title: {
                      query: query,
                      slop: 10,
                      max_expansions: 50,
                    },
                  },
                },
                {
                  match: {
                    title: {
                      query: query,
                      operator: "and",
                      fuzziness: "AUTO",
                      prefix_length: 2,
                    },
                  },
                },
              ],
              minimum_should_match: 1,
            },
          },
          require_field_match: false,
          fragment_size: 400,
          number_of_fragments: 4,
          no_match_size: 20,
        },
      },
      pre_tags: [PRE_TAG],
      post_tags: [POST_TAG],
    },
  };
}
