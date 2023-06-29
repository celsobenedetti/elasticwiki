import { useRouter } from "next/router";
import React, { useEffect } from "react";

import {
  type SearchTotalHits,
  type SearchHit,
} from "@elastic/elasticsearch/lib/api/types";
import { InView } from "react-intersection-observer";

import { api } from "@/lib/api";
import { useSearch } from "@/store/search";
import { SEARCH_RESULTS_SIZE, type WikiDocument } from "@/lib/search";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { HeroIcon } from "@/components/HeroIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Search() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    api.elastic.infiniteSearch.useInfiniteQuery(
      { query: searchQuery },
      {
        initialCursor: 0,
        getNextPageParam: (lastPage) => {
          if (lastPage.docs.length < SEARCH_RESULTS_SIZE) {
            return undefined; // no more results
          }
          return lastPage.nextCursor;
        },
      }
    );

  useEffect(() => {
    const queryParam = (router.query["query"] || "") as string;
    if (queryParam != searchQuery) {
      setSearchQuery(queryParam);
      router.query = { query: queryParam };
    }
  }, [searchQuery, setSearchQuery, router]);

  if (!data) {
    return (
      <main className="mx-auto flex h-screen items-center justify-center pb-2 pt-header sm:w-10/12">
        {isFetching ? <LoadingSpinner /> : "No results to show"}
      </main>
    );
  }

  let elapsedTimeMS = 0;
  const searchResults = [] as SearchHit<WikiDocument>[];

  for (const page of data.pages) {
    searchResults.push(...page.docs);
    elapsedTimeMS += data.pages[0]?.elapsedTime || 0;
  }

  if (searchResults.length === 0) {
    return (
      <main className="mx-auto flex h-screen items-center justify-center pb-2 pt-header sm:w-10/12">
        No results to show
      </main>
    );
  }

  console.log({ searchResults, data });

  return (
    <main className="mx-auto pb-2 pt-header sm:w-10/12">
      <section className="my-4 flex flex-col items-center gap-6 px-4">
        <SearchMetadata />

        {searchResults.map((document) => (
          <SearchResult document={document} key={document._id} />
        ))}

        <SearchFooterBar />
      </section>
    </main>
  );

  function SearchMetadata() {
    const totalResults = data?.pages[0]?.total as SearchTotalHits;
    const numberOfResults = totalResults?.value || 0;
    const elapsedTime = (elapsedTimeMS / SECOND).toFixed(3);

    return (
      <p className="self-start text-sm text-slate-500">
        Found {numberOfResults} results ({elapsedTime} seconds)
      </p>
    );
  }

  /**Bar on the bottom of search page. Triggers fetch next page for infinite scrolling*/
  function SearchFooterBar() {
    if (searchResults.length === 0) return <></>;

    const pagesFetchedCount =
      data?.pages[data.pages.length - 1]?.nextCursor || 0;

    return (
      <InView
        onChange={(inView) => {
          if (inView && pagesFetchedCount <= MAX_SCROLL_FETCH) {
            fetchNextPage().catch(console.error);
          }
        }}
        role="status"
        className="my-8 flex h-0 w-full items-center justify-center border-b border-slate-300"
      >
        <SearchFooterContent pagesFetched={pagesFetchedCount} />
      </InView>
    );
  }

  function SearchFooterContent(props: { pagesFetched: number }) {
    if (!hasNextPage)
      return (
        <div className="rounded-2xl bg-slate-200 px-2 text-sm  text-slate-500 dark:bg-slate-900">
          no more results
        </div>
      );
    if (isFetchingNextPage) return <LoadingSpinner />;
    if (props.pagesFetched > MAX_SCROLL_FETCH)
      return (
        <Button
          onClick={() => {
            fetchNextPage().catch(console.error);
          }}
          variant="secondary"
          className="flex gap-3 rounded-full px-12 text-sm"
        >
          <p>More results</p>
          <HeroIcon shape="chevronDown" className="h-5 w-5 text-slate-500" />
        </Button>
      );
    return <div></div>;
  }
}

function SearchResult({ document }: { document: SearchHit<WikiDocument> }) {
  const doc = document._source;
  if (!doc) return <></>;

  return (
    <Card className="border-slate-100 dark:border-slate-900">
      <a href={doc.url} target="#">
        <CardHeader className="group">
          <CardTitle className="text-indigo-500 group-hover:underline">
            {doc.title}
          </CardTitle>
          <CardDescription className="text-xs">{doc.url}</CardDescription>
        </CardHeader>
      </a>
      <CardContent>{doc.content}</CardContent>
      {/* <CardFooter> */}
      {/*   <p>Card Footer</p> */}
      {/* </CardFooter> */}
    </Card>
  );
}

const SECOND = 1000;
const MAX_SCROLL_FETCH = 3;
