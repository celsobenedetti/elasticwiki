import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo } from "react";

import {
  type SearchTotalHits,
  type SearchHit,
} from "@elastic/elasticsearch/lib/api/types";
import { InView } from "react-intersection-observer";

import { api } from "@/lib/api";
import { useSearchBar } from "@/store/search";
import {
  SEARCH_RESULTS_SIZE,
  type KeywordsAgg,
  type WikiDocument,
  type DidYouMeanSuggestion,
} from "@/lib/search";

import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";
import { HeroIcon } from "@/components/HeroIcon";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ParsedHighlightedText } from "@/components/ParsedHighlightedText";

export default function Search() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearchBar();

  const searchCallback = useCallback(
    (query: string) => {
      if (!query.length) return;
      setSearchQuery(query);
      router.query = { query: query };
    },
    [router, setSearchQuery]
  );

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

  const { searchResults, elapsedTimeMS, searchSuggestion } = useMemo(() => {
    const searchResults = [];
    let elapsedTimeMS = 0;
    const searchSuggestion = data?.pages[0]?.suggest;

    for (const page of data?.pages || []) {
      searchResults.push(...page.docs);
      elapsedTimeMS += data?.pages[0]?.elapsedTime || 0;
    }
    return { searchResults, elapsedTimeMS, searchSuggestion };
  }, [data]);

  const keywordRecommendations = useMemo(() => {
    const keywordsAgg = data?.pages[0]?.aggs?.suggestions as KeywordsAgg;
    return (keywordsAgg?.buckets || [])
      .map((suggestion) => suggestion.key)
      .filter((word) => !searchQuery.includes(word) && word.length > 3);
  }, [data, searchQuery]);

  useEffect(() => {
    const queryParam = (router.query["query"] || "") as string;
    if (queryParam != searchQuery) {
      searchCallback(queryParam);
    }
  }, [searchQuery, searchCallback, router]);

  if (!data) {
    return (
      <main className="mx-auto flex h-screen items-center justify-center pb-2 pt-header sm:w-10/12">
        {isFetching ? <LoadingSpinner /> : "No results to show"}
      </main>
    );
  }

  if (searchResults.length === 0) {
    return (
      <main className="bg-blue mx-auto flex h-screen flex-col items-center  pb-2 pt-header sm:w-10/12">
        <div className="m-1 h-1/2 self-start">
          {searchSuggestion?.hasSuggestionOustideQuery && (
            <DidYouMean
              suggestion={searchSuggestion}
              searchCallback={searchCallback}
            />
          )}
        </div>
        <h1>No results to show</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto pb-2 pt-header sm:w-10/12">
      <section className="my-4 flex flex-col items-center gap-6 px-4">
        <SearchMetadata />

        {searchSuggestion?.hasSuggestionOustideQuery && (
          <DidYouMean
            suggestion={searchSuggestion}
            searchCallback={searchCallback}
          />
        )}

        {keywordRecommendations.length > 0 && (
          <TermSuggestions
            suggestions={keywordRecommendations}
            searchCallback={searchCallback}
          />
        )}

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

    if (isFetchingNextPage)
      return (
        <div className="bg-background">
          <LoadingSpinner />
        </div>
      );

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

function DidYouMean(props: {
  suggestion: DidYouMeanSuggestion;
  searchCallback: (query: string) => void;
}) {
  return (
    <a
      className="group cursor-pointer self-start text-sm text-slate-600 dark:text-slate-500"
      onClick={() => {
        if (props.suggestion.text) {
          props.searchCallback(props.suggestion.text);
        }
      }}
    >
      Did you mean:{" "}
      <ParsedHighlightedText
        text={props.suggestion.highlighted || props.suggestion.text || ""}
        className="suggestion-highlight inline"
      />
    </a>
  );
}

function TermSuggestions(props: {
  suggestions: string[];
  searchCallback: (query: string) => void;
}): React.ReactNode {
  const { searchQuery } = useSearchBar();

  return (
    <div className="flex w-full gap-1 overflow-x-auto rounded-3xl py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-100 dark:scrollbar-thumb-slate-900">
      {props.suggestions.map((term) => (
        <Button
          variant="secondary"
          size="sm"
          className="rounded-full"
          key={term}
          onClick={() => {
            const newQuery = searchQuery + " " + term;
            props.searchCallback(newQuery);
          }}
        >
          {term}
        </Button>
      ))}
    </div>
  );
}

function SearchResult({ document }: { document: SearchHit<WikiDocument> }) {
  const { _source: doc, highlight } = document;
  if (!doc || !highlight || !highlight.content) return <></>;

  const { dt_creation: createdAt, reading_time } = doc;

  return (
    <Card className="max-w-full border-slate-100 dark:border-slate-900">
      <a href={doc.url} target="#">
        <CardHeader className="group">
          <CardTitle className="text-indigo-500 group-hover:underline">
            {doc.title}
          </CardTitle>
          <CardDescription className="overflow-hidden overflow-ellipsis whitespace-nowrap text-xs ">
            {doc.url}
          </CardDescription>
        </CardHeader>
      </a>
      <CardContent>
        <ParsedHighlightedText
          text={highlight.content.toString()}
          className="search-highlights"
        />
      </CardContent>
      <CardFooter className="justify-between gap-2 pr-8 text-slate-500">
        <p className="text-sm">{reading_time} min read</p>
        {createdAt && (
          <p className="text-xs">
            {/* HACK: strip weekday from date formatting */}
            {new Date(createdAt).toDateString().slice(4)}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}

const SECOND = 1000;
const MAX_SCROLL_FETCH = 3;
