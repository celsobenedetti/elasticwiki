import { useSearch } from "@/store/search";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";

import { TextField } from "./types";

export default function SearchForm() {
  const { textFields, setTextField } = useSearch();
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg">
      <div className="border-l border-l-green-500 pl-2">
        <div>
          <Label htmlFor="terms">
            <span className=" text-green-500">should</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.ShouldTerms)}
            onChange={(e) =>
              setTextField(TextField.ShouldTerms, e.target.value)
            }
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-green-500">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.MustPhrases)}
            onChange={(e) =>
              setTextField(TextField.MustPhrases, e.target.value)
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
            defaultValue={textFields.get(TextField.MustNotTerms)}
            onChange={(e) =>
              setTextField(TextField.MustNotTerms, e.target.value)
            }
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-red-400">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.MustNotPhrases)}
            onChange={(e) =>
              setTextField(TextField.MustNotPhrases, e.target.value)
            }
          />
        </div>
      </div>
      <SheetDescription>Phrases must be comma separated</SheetDescription>
    </section>
  );
}
