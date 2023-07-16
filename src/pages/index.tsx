import { Button } from "@/components/ui/button";
import { memo, useCallback, useState } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/search/SearchBar";

import { AdvancedSearch } from "@/components/search/advanced/AdvancedSearch";

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

  const [query, setQuery] = useState("");
  const MemoizedAdvancedSearch = memo(AdvancedSearch);

  const searchCallback = useCallback(
    (searchQuery: string) => {
      if (!searchQuery) return;

      setQuery(searchQuery);
      router
        .push({
          pathname: "/search",
          query: { query: searchQuery },
        })
        .catch(console.error);
    },
    [router, setQuery]
  );

  return (
    <section className="relative mb-20 flex w-10/12 max-w-sm flex-col items-center gap-6 overflow-visible sm:max-w-[36rem]">
      <SearchBar
        searchCallback={searchCallback}
        query={query}
        setQuery={setQuery}
        showIcons={!!query.length}
        isHome={true}
      />

      <div className="mt-4 flex items-center justify-center gap-3">
        <Button
          onClick={() => searchCallback(query)}
          variant="secondary"
          className="w-40"
        >
          Search
        </Button>

        <MemoizedAdvancedSearch searchQuery={query} />
      </div>
    </section>
  );
}
