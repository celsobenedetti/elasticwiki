import {
  type TextField,
  type AdvancedSearchStore,
  type TextFieldsMap,
  type DateType,
  type ReadTimeType,
  CREATED_BEFORE,
  CREATED_AFTER,
  GREATER,
  LESSER,
} from "@/components/search/advanced";

import { create } from "zustand";

interface SearchStore extends AdvancedSearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearch = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  //advanced search
  textFields: new Map(),
  setInitialTextFields: (fields: TextFieldsMap) => set({ textFields: fields }),
  setTextField: (field: TextField, value: string) => {
    set((state) => ({
      textFields: new Map(state.textFields).set(field, value),
    }));
  },

  dates: {
    [CREATED_BEFORE]: undefined,
    [CREATED_AFTER]: undefined,
  },
  setDate: (DATE_TYPE: DateType, date: Date) => {
    set((state) => ({
      dates: {
        ...state.dates,
        [DATE_TYPE]: date,
      },
    }));
  },

  readTime: {
    [LESSER]: undefined,
    [GREATER]: undefined,
  },
  setReadTime: (TIME_TYPE: ReadTimeType, value: number) => {
    set((state) => ({
      readTime: {
        ...state.readTime,
        [TIME_TYPE]: value,
      },
    }));
  },
}));
