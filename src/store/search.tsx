import { type RouterOutputs } from "@/lib/api";
import { create } from "zustand";

type SearchOutput = RouterOutputs["elastic"]["search"] | undefined;

interface SearchStore {
  results: SearchOutput;
  setResults: (results: SearchOutput) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useSearch = create<SearchStore>((set) => ({
  results: undefined,
  setResults: (results: SearchOutput) => set({ results }),
  searchQuery: "",
  setSearchQuery: (query: string) => {
    if (query) set({ searchQuery: query });
  },
}));
