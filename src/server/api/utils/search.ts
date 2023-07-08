import { PRE_TAG, POST_TAG } from "@/lib/search";
import { INDEX, SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";
import {
  type SearchSuggest,
  type QueryDslTextQueryType,
  type SearchTermSuggestOption,
  type SearchRequest,
} from "@elastic/elasticsearch/lib/api/types";

export function infiniteSearchOptions(
  query: string,
  cursor: number
): SearchRequest {
  return {
    index: INDEX,
    size: SEARCH_RESULTS_SIZE,
    from: SEARCH_RESULTS_SIZE * cursor,
    _source_excludes: "content_unstemmed",
    query: {
      match: { content: query },
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
  const phraseSuggester = phrase_suggester;
  const suggestOptions = phraseSuggester?.at(0)
    ?.options as SearchTermSuggestOption[];
  const suggestion = suggestOptions[0];

  const hasSuggestionOustideQuery =
    !!suggestion &&
    suggestion?.text.split(" ").some((term) => !query.includes(term));

  return { ...suggestion, hasSuggestionOustideQuery };
}

export function autocompleteSearchOptions(query: string) {
  return {
    query: {
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
    highlight: {
      fields: {
        title: {
          require_field_match: false,
          fragment_size: 400,
          number_of_fragments: 1,
          no_match_size: 20,
        },
      },
      pre_tags: [PRE_TAG],
      post_tags: [POST_TAG],
    },
  };
}
