import {
  type AdvancedSearchStore,
  type TextFieldsMap,
  type TextField,
  type DateType,
  type ReadTimeType,
  LESSER,
  GREATER,
  CREATED_BEFORE,
  CREATED_AFTER,
} from "@/lib/search";
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
    set((state) => {
      let lesser = state.readTime[LESSER];
      let greater = state.readTime[GREATER];

      //assure greater >= value >= lesser
      if (TIME_TYPE == GREATER) {
        greater = value;
        if (!!lesser && lesser < value) {
          lesser = value;
        }
      } else {
        lesser = value;
        if (!!greater && greater > value) {
          greater = value;
        }
      }

      return {
        readTime: {
          [LESSER]: lesser,
          [GREATER]: greater,
        },
      };
    });
  },
}));
