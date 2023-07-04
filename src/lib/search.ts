export interface WikiDocument {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

export interface SuggestionsAgg {
  buckets: {
    bg_count: number;
    doc_count: number;
    key: string;
    score: number;
  }[];
}

export const SEARCH_RESULTS_SIZE = 10;
export const INDEX = "wikipedia";
