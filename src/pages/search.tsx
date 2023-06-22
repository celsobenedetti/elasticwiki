import { type SearchTotalHits } from "@elastic/elasticsearch/lib/api/types";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";

import React, { useEffect } from "react";

import { useSearch } from "@/store/search";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function Search() {
  const router = useRouter();
  const { searchQuery, doSearch } = useSearch();

  const { data, fetchNextPage } = api.elastic.infiniteSearch.useInfiniteQuery(
    {
      query: searchQuery,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 1,
    }
  );
  console.log({ infinite: data });

  const totalHits = data?.pages.reduce((sum, curr) => {
    const total = curr.hits.total as SearchTotalHits;
    return sum + total.value;
  }, 0);

  const elapsedTime =
    (data?.pages[0]?.elapsedTime || MILISECONDS) / MILISECONDS;

  const queryParam = parseQuery(router.query);

  useEffect(() => {
    if (queryParam != searchQuery) {
      doSearch(queryParam);
    }
  }, [searchQuery, queryParam, doSearch]);

  return (
    <main className="mx-auto pt-header sm:w-10/12">
      <Button
        onClick={() => {
          fetchNextPage().catch(console.error);
        }}
      >
        Infinit
      </Button>
      <section className="my-4 flex flex-col items-center gap-6 px-4">
        {totalHits && (
          <p className="self-start text-sm text-slate-500">
            Found {totalHits} results ({elapsedTime.toFixed(3)} seconds)
          </p>
        )}
        {/* {results?.hits.hits.map((document) => { */}
        {/*   return <h1 key={document._id}>{document._source?.content}</h1>; */}
        {/* })} */}
      </section>
    </main>
  );
}

function parseQuery(query: ParsedUrlQuery) {
  let queryParam = "";

  for (const key in query) {
    queryParam += `${key} `;
  }

  return queryParam.slice(0, -1);
}

const MILISECONDS = 1000;
