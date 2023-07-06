import { useSearchBar } from "@/store/search";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <>
      <main className="bg flex h-screen flex-col items-center justify-center pt-header">
        <h1 className="mb-20 text-7xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-indigo-500">T3</span> ElasticWiki
        </h1>

        <Search />
      </main>
    </>
  );
}

function Search() {
  const router = useRouter();

  const { setSearchQuery } = useSearchBar();
  const [query, setQuery] = useState("");

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
        query={query}
        setQuery={setQuery}
      />

      <Button
        onClick={() => searchCallback(query)}
        variant="secondary"
        className="w-40"
      >
        Search
      </Button>
    </section>
  );
}
