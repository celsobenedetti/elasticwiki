import { Label } from "@radix-ui/react-label";
import { useReducer } from "react";

import { useSearch } from "@/store/search";

import { SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  inputReducer as formStateReducer,
  createInitialInputState,
} from "./reducer";

export default function SearchForm() {
  const { searchQuery } = useSearch();

  //TODO: dispatch form input events
  const [inputs, inputEvent] = useReducer(
    formStateReducer,
    createInitialInputState(searchQuery)
  );

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
          <Input defaultValue={inputs.mustPhrases} />
        </div>
      </div>
      <div className="border-l border-l-red-500 pl-2">
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input defaultValue={inputs.mustNotTerms} />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input defaultValue={inputs.mustNotPhrases} />
        </div>
      </div>
      <SheetDescription>Phrases must be comma separated</SheetDescription>
    </section>
  );
}
