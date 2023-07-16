export interface KeywordsAgg {
  buckets: {
    bg_count: number;
    doc_count: number;
    key: string;
    score: number;
  }[];
}

export interface DidYouMeanSuggestion {
  hasSuggestionOustideQuery: boolean;
  text?: string | undefined;
  score?: number | undefined;
  freq?: number | undefined;
  highlighted?: string | undefined;
  collate_match?: boolean | undefined;
}

export enum MatchType {
  Term = "match",
  Phrase = "match_phrase",
}

export const SEARCH_RESULTS_SIZE = 10;
export const INDEX = "wikipedia";
export const CONTENT_FIELD = "content";
export const TITLE_FIELD = "title";
export const DATE_FIELD = "dt_creation";
export const TIME_FIELD = "reading_time";

export interface WikiDocument {
  url: string;
  [TITLE_FIELD]: string;
  [CONTENT_FIELD]: string;
  [TIME_FIELD]: number;
  [DATE_FIELD]: Date;
}
