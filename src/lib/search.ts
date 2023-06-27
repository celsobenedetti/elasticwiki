export interface WikiDocument {
  title: string;
  url: string;
  content: string;
  reading_time: number;
  dt_creation: Date;
}

export const SEARCH_RESULTS_SIZE = 10;
