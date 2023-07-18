import { TextField } from "@/lib/search";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SheetDescription } from "@/components/ui/sheet";
import { useAdvancedSearch } from "./state";

export default function SearchForm() {
  const { textFields, setTextField } = useAdvancedSearch();
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg">
      <div className="border-l border-l-success pl-2">
        <div>
          <Label htmlFor="terms">
            <span className=" text-success">must</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.ShouldTerms)}
            onChange={(e) =>
              setTextField(TextField.ShouldTerms, e.target.value)
            }
            placeholder="calculus mathematics..."
            className="placeholder:text-slate-500 placeholder:text-opacity-50"
            id="terms"
          />
        </div>
        <div>
          <Label htmlFor="phrases">
            <span className="text-success">must</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.MustPhrases)}
            onChange={(e) =>
              setTextField(TextField.MustPhrases, e.target.value)
            }
            placeholder="arithmetic operations, differential calculus..."
            className="placeholder:text-slate-500 placeholder:text-opacity-50"
            id="phrases"
          />
        </div>
      </div>
      <div className="border-l border-l-danger pl-2">
        <div>
          <Label htmlFor="not_terms">
            <span className="text-danger">must not</span> match{" "}
            <span className="font-bold">terms</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.MustNotTerms)}
            onChange={(e) =>
              setTextField(TextField.MustNotTerms, e.target.value)
            }
            placeholder="matrices algebra..."
            className="placeholder:text-slate-500 placeholder:text-opacity-50"
            id="not_terms"
          />
        </div>
        <div>
          <Label htmlFor="not_phrases">
            <span className="text-danger">must not</span> match{" "}
            <span className="font-bold">phrases</span>:
          </Label>
          <Input
            defaultValue={textFields.get(TextField.MustNotPhrases)}
            onChange={(e) =>
              setTextField(TextField.MustNotPhrases, e.target.value)
            }
            placeholder="euclidean geomtry, linear algebra..."
            className="placeholder:text-slate-500 placeholder:text-opacity-50"
            id="not_phrases"
          />
        </div>
      </div>
      <SheetDescription>Phrases must be comma separated</SheetDescription>
    </section>
  );
}
