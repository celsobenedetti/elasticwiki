import {
  type CREATED_BEFORE,
  type CREATED_AFTER,
  type DateType,
} from "@/lib/search";

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
}

export enum TextField {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}
