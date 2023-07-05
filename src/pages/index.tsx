import { useSearch } from "@/store/search";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/router";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <>
      <main className="bg flex h-screen flex-col items-center justify-center pt-header">
        <h1 className="mb-20 text-7xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-indigo-500">T3</span> ElasticWiki
        </h1>

        <section className="flex w-10/12 max-w-sm flex-col items-center gap-6 sm:max-w-[36rem]">
          <Search />
        </section>
      </main>
    </>
  );
}

function Search() {
  const router = useRouter();

  const { setSearchQuery } = useSearch();
  const [query, setQuery] = useState("");

  const searchCallback = () => {
    if (!query) return;

    setSearchQuery(query);
    router
      .push({
        pathname: "/search",
        query: { query },
      })
      .catch(console.error);
  };

  return (
    <>
      <SearchBar
        searchCallback={searchCallback}
        query={query}
        setQuery={setQuery}
      />

      <Button onClick={searchCallback} variant="secondary" className="w-40">
        Search
      </Button>
    </>
  );
}
