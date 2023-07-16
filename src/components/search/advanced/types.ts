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
