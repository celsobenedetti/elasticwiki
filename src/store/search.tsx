import {
  LESSER,
  GREATER,
  CREATED_BEFORE,
  CREATED_AFTER,
  type AdvancedSearchState,
} from "@/lib/search";
import { create } from "zustand";

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  advancedSearchState: AdvancedSearchState;
  setAdvancedSearchOptions: (s: AdvancedSearchState) => void;
}

/**used to expose search related state throughout the app
this state is bound to the infiniteQuery requests
whenever this state changes, the query is invalidated and refetched*/
export const useSearch = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  advancedSearchState: {
    textFields: new Map(),
    dates: {
      [CREATED_BEFORE]: undefined,
      [CREATED_AFTER]: undefined,
    },
    readTime: {
      [LESSER]: undefined,
      [GREATER]: undefined,
    },
  },
  setAdvancedSearchOptions: (state) => set({ advancedSearchState: state }),
}));
