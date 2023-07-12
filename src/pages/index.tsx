import { useSearch } from "@/store/search";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";

import { AdvancedSearch } from "@/components/AdvancedSearch";

export default function Home() {
  return (
    <>
      <main className="bg flex h-page flex-col items-center justify-center pt-header">
        <h1 className="mb-20 text-center text-7xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-indigo-500">T3</span> ElasticWiki
        </h1>

        <Search />
      </main>
    </>
  );
}

function Search() {
  const router = useRouter();

  const { searchQuery, setSearchQuery } = useSearch();

  const searchCallback = useCallback(
    (searchQuery: string) => {
      if (!searchQuery) return;

      setSearchQuery(searchQuery);
      router
        .push({
          pathname: "/search",
          query: { query: searchQuery },
        })
        .catch(console.error);
    },
    [router, setSearchQuery]
  );

  return (
    <section className="relative mb-20 flex w-10/12 max-w-sm flex-col items-center gap-6 overflow-visible sm:max-w-[36rem]">
      <SearchBar
        searchCallback={searchCallback}
        query={searchQuery}
        setQuery={setSearchQuery}
        showIcons={!!searchQuery.length}
        isHome={true}
      />

      <div className="mt-20 flex items-center justify-center gap-3">
        <Button
          onClick={() => searchCallback(searchQuery)}
          variant="secondary"
          className="w-40"
        >
          Search
        </Button>

        <AdvancedSearch />
      </div>
    </section>
  );
}
