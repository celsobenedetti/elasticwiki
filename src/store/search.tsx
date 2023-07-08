import { create } from "zustand";

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearchBar = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => {
    if (query) set({ searchQuery: query });
  },
}));
