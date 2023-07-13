import { type Dispatch } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";

import { InputType, type InputAction, type InputState } from "./reducer";

export default function SearchForm({
  inputs,
  dispatch,
}: {
  inputs: InputState;
  dispatch: Dispatch<InputAction>;
}) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg">
      <div className="border-l border-l-green-500 pl-2">
        <div>
          <Label htmlFor="terms">
            <span className=" text-green-500">should</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input
            defaultValue={inputs.shouldTerms}
            onChange={(e) =>
              dispatch({ type: InputType.ShouldTerms, content: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-green-500">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={inputs.mustPhrases}
            onChange={(e) =>
              dispatch({ type: InputType.MustPhrases, content: e.target.value })
            }
          />
        </div>
      </div>
      <div className="border-l border-l-red-500 pl-2">
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input
            defaultValue={inputs.mustNotTerms}
            onChange={(e) =>
              dispatch({
                type: InputType.MustNotTerms,
                content: e.target.value,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={inputs.mustNotPhrases}
            onChange={(e) =>
              dispatch({
                type: InputType.MustNotPhrases,
                content: e.target.value,
              })
            }
          />
        </div>
      </div>
      <SheetDescription>Phrases must be comma separated</SheetDescription>
    </section>
  );
}
