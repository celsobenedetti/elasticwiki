import { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import { CREATED_BEFORE, CREATED_AFTER, LESSER, GREATER } from "@/lib/search";
import { useSearch } from "@/store/search";
import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { HeroIcon } from "@/components/HeroIcon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { DatePicker } from "./Date";
import SearchForm from "./Form";
import { buildQueryFromState, parseQueryToTextFieldsState } from "./state";
import ReadTimeSlider from "./Slider";

export function AdvancedSearch({
  searchQuery,
  className,
}: {
  searchQuery: string;
  className?: string;
}) {
  const { setSearchQuery, textFields, setInitialTextFields } = useSearch();

  useEffect(
    () => setInitialTextFields(parseQueryToTextFieldsState(searchQuery)),
    [searchQuery, setInitialTextFields]
  );

  const router = useRouter();
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
    <Sheet>
      <SheetTrigger>
        <TriggerButton className={className} />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
        </SheetHeader>

        <Separator />

        <SheetDescription>Resulting documents:</SheetDescription>
        <SearchForm />

        <Separator />

        <DatePicker DATE_TYPE={CREATED_BEFORE} />
        <DatePicker DATE_TYPE={CREATED_AFTER} />

        <Separator />

        <ReadTimeSlider TIME_TYPE={LESSER} />
        <ReadTimeSlider TIME_TYPE={GREATER} />

        <Button
          onClick={() => searchCallback(buildQueryFromState(textFields))}
          variant="secondary"
          className="mx-auto w-1/2"
        >
          Search
        </Button>
      </SheetContent>
    </Sheet>
  );
}

function TriggerButton({ className }: { className?: string }) {
  return (
    <HeroIcon
      shape="adjustments-horizontal"
      className={cn(className, "text-active dark:text-active-dark")}
    />
  );
}
