import { type SearchTotalHits } from "@elastic/elasticsearch/lib/api/types";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";

import React, { useEffect } from "react";

import { useSearch } from "@/store/search";

export default function Search() {
  const router = useRouter();
  const { results, searchQuery, doSearch } = useSearch();

  const totalHits = results?.hits.total as SearchTotalHits;
  const queryParam = parseQuery(router.query);

  const elapsedTime = (results?.elapsedTime || MILISECONDS) / MILISECONDS;

  useEffect(() => {
    if (queryParam != searchQuery) {
      doSearch(queryParam);
    }
  }, [searchQuery, queryParam, doSearch]);

  return (
    <main className="mx-auto pt-header sm:w-10/12">
      <section className="my-4 flex flex-col items-center gap-6 px-4">
        {totalHits && (
          <p className="self-start text-sm text-slate-500">
            Found {totalHits.value} results ({elapsedTime.toFixed(3)} seconds)
          </p>
        )}
        {results?.hits.hits.map((document) => {
          return <h1 key={document._id}>{document._source?.content}</h1>;
        })}
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
