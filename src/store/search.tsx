import {
  type TextField,
  type AdvancedSearchStore,
  type TextFieldsMap,
} from "@/components/search/advanced";
import { CREATED_AFTER, CREATED_BEFORE, type DateType } from "@/lib/search";
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
}));
