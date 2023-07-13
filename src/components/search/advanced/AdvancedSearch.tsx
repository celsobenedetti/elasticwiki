import { useMemo, useReducer } from "react";

import { useSearch } from "@/store/search";
import { cn } from "@/lib/utils";
import { MatchType, extractMatchTokens } from "@/lib/search";

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
import { Button } from "@/components/ui/button";
import { HeroIcon } from "@/components/HeroIcon";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

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

        <SheetDescription>Resulting documents:</SheetDescription>
        <SearchForm />

        <Button variant="secondary" className="mx-auto w-1/2">
          Search
        </Button>
      </SheetContent>
    </Sheet>
  );
}

function createInitialInputs(query: string) {
  const { terms, must, must_not } = buildBooleanQuery(query);

  return {
    shouldTerms: terms,
    mustPhrases: extractMatchTokens(must, MatchType.Phrase),
    mustNotTerms: extractMatchTokens(must_not, MatchType.Term),
    mustNotPhrases: extractMatchTokens(must_not, MatchType.Phrase),
  };
}

type InputFields = {
  shouldTerms: string;
  mustPhrases: string[];
  mustNotTerms: string[];
  mustNotPhrases: string[];
};

type FormEvent = {
  type: "";
  fields: InputFields;
};

function inputReducer(inputs: InputFields, action: FormEvent): InputFields {
  return {
    shouldTerms: "",
    mustPhrases: [""],
    mustNotTerms: [""],
    mustNotPhrases: [""],
  };
}

function SearchForm() {
  const { searchQuery } = useSearch();

  const [inputs, dispatch] = useReducer(
    inputReducer,
    createInitialInputs(searchQuery)
  );

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
          <Input defaultValue={inputs.shouldTerms} />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-green-500">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input defaultValue={toCsv(inputs.mustPhrases)} />
        </div>
      </div>
      <div className="border-l border-l-red-500 pl-2">
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input defaultValue={toCsv(inputs.mustNotTerms)} />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input defaultValue={toCsv(inputs.mustNotPhrases)} />
        </div>
      </div>
      <SheetDescription>Phrases must be comma separated</SheetDescription>
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