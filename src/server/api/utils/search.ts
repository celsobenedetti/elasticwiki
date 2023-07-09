import {
  INDEX,
  POST_TAG,
  PRE_TAG,
  SEARCH_RESULTS_SIZE,
  type WikiDocument,
} from "@/lib/search";
import {
  type QueryDslBoolQuery,
  type QueryDslTextQueryType,
  type SearchRequest,
  type SearchSuggest,
  type SearchTermSuggestOption,
} from "@elastic/elasticsearch/lib/api/types";

export function buildInfiniteSearchRequest(
  cursor: number,
  input: string,
  boolQueryDsl: QueryDslBoolQuery
): SearchRequest {
  return {
    index: INDEX,
    size: SEARCH_RESULTS_SIZE,
    from: SEARCH_RESULTS_SIZE * cursor,
    _source_excludes: "content_unstemmed",
    query: {
      bool: boolQueryDsl,
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
      text: input,

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

export function getAutocompleteSearchOptions(query: string): SearchRequest {
  return {
    query: {
      bool: {
        should: [
          {
            multi_match: {
              query: query,
              type: "bool_prefix" as QueryDslTextQueryType,

              fields: [
                "title.autocomplete",
                "title.autocomplete._2gram",
                "title.autocomplete._3gram",
              ],
            },
          },
        ],
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
