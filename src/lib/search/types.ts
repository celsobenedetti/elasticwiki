export interface WikiDocument {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

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

export const CREATED_BEFORE = "before";
export const CREATED_AFTER = "after";
export type DateType = typeof CREATED_BEFORE | typeof CREATED_AFTER;
