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

export const SEARCH_RESULTS_SIZE = 10;
export const INDEX = "wikipedia";
