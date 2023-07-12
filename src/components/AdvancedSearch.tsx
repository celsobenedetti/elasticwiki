import { cn } from "@/lib/utils";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HeroIcon } from "@/components/HeroIcon";
import { useSearch } from "@/store/search";
import { useMemo } from "react";
import { CONTENT_FIELD, buildBooleanQuery } from "@/lib/search";
import { type QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

type Clauses = QueryDslQueryContainer[];

enum MatchField {
  Term = "match",
  Phrase = "match_phrase",
}

export function AdvancedSearch({ className }: { className?: string }) {
  return (
    <Sheet>
      <SheetTrigger>
        <TriggerButton className={className} />
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Advanced Search</SheetTitle>
        </SheetHeader>

        <Separator />

        <SearchForm />
      </SheetContent>
    </Sheet>
  );
}

function SearchForm() {
  const { searchQuery } = useSearch();

  const { shouldTerms, mustPhrases, mustNotTerms, mustNotPhrases } =
    useMemo(() => {
      const { terms, must, must_not } = buildBooleanQuery(searchQuery);

      return {
        shouldTerms: terms,
        mustPhrases: extractMatchStrings(must, MatchField.Phrase),
        mustNotTerms: extractMatchStrings(must_not, MatchField.Term),
        mustNotPhrases: extractMatchStrings(must_not, MatchField.Phrase),
      };
    }, [searchQuery]);

  console.log({ shouldTerms, mustPhrases, mustNotTerms, mustNotPhrases });

  const toCsv = (tokens: string[]) => {
    return tokens
      .reduce((csv, token) => csv + ", " + token, "")
      .slice(1)
      .trim();
  };

  return (
    <section className="flex w-full flex-col gap-4 rounded-lg">
      <div className="border-l border-l-green-500 pl-2">
        <div>
          <Label htmlFor="terms">
            <span className=" text-green-500">should</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input defaultValue={shouldTerms} />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-green-500">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input defaultValue={toCsv(mustPhrases)} />
        </div>
      </div>
      <div className="border-l border-l-red-500 pl-2">
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input defaultValue={toCsv(mustNotTerms)} />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input defaultValue={toCsv(mustNotPhrases)} />
        </div>
      </div>
      <SheetDescription>Phrases are comma separated</SheetDescription>
    </section>
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

function extractMatchStrings(clauses: Clauses, field: MatchField) {
  return clauses
    .map((clause) =>
      clause[field]?.[CONTENT_FIELD]?.toString().replaceAll(/"|!/g, "")
    )
    .filter((clause) => !!clause) as string[];
}
