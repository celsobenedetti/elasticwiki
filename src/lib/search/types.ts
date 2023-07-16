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

export type TextFieldsMap = Map<TextField, string>;

export interface AdvancedSearchStore {
  textFields: TextFieldsMap;
  setInitialTextFields: (map: TextFieldsMap) => void;
  setTextField: (type: TextField, value: string) => void;
  dates: {
    [CREATED_BEFORE]: Date | undefined;
    [CREATED_AFTER]: Date | undefined;
  };
  setDate: (type: DateType, date: Date) => void;
  readTime: {
    [LESSER]: number | undefined;
    [GREATER]: number | undefined;
  };
  setReadTime: (type: ReadTimeType, value: number) => void;
}

export enum TextField {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

export const CREATED_BEFORE = "before";
export const CREATED_AFTER = "after";
export type DateType = typeof CREATED_BEFORE | typeof CREATED_AFTER;

export const LESSER = "lesser";
export const GREATER = "greater";
export type ReadTimeType = typeof LESSER | typeof GREATER;
