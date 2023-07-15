import { type Dispatch } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";

import { TextField, type InputAction, type TextFieldsState } from "./state";

export default function SearchForm({
  inputFields,
  dispatch,
}: {
  inputFields: TextFieldsState;
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
            defaultValue={inputFields.get(TextField.ShouldTerms)}
            onChange={(e) =>
              dispatch({ type: TextField.ShouldTerms, content: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-green-500">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={inputFields.get(TextField.MustPhrases)}
            onChange={(e) =>
              dispatch({ type: TextField.MustPhrases, content: e.target.value })
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
            defaultValue={inputFields.get(TextField.MustNotTerms)}
            onChange={(e) =>
              dispatch({
                type: TextField.MustNotTerms,
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
            defaultValue={inputFields.get(TextField.MustNotPhrases)}
            onChange={(e) =>
              dispatch({
                type: TextField.MustNotPhrases,
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
