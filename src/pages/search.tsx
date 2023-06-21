import { useSearch } from "@/store/search";
import { useRouter } from "next/router";
import { type ParsedUrlQuery } from "querystring";
import React, { useEffect } from "react";

export default function Search() {
  const router = useRouter();
  const { results, searchQuery, doSearch } = useSearch();

  const queryParam = parseQuery(router.query);

  useEffect(() => {
    if (queryParam != searchQuery) {
      doSearch(queryParam);
    }
  }, [searchQuery, queryParam, doSearch]);

  return (
    <main className="mx-auto pt-header sm:w-10/12">
      <section className="my-4 flex flex-col items-center gap-6 ">
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
