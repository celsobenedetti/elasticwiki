import {
  CREATED_AFTER,
  CREATED_BEFORE,
  type DateType,
  GREATER,
  LESSER,
  MatchType,
  type ReadTimeType,
  TextField,
  extractMatchClauseTokens,
  stripPunctuations,
  trimMultipleWhitespaces,
  type AdvancedSearchStore,
  type TextFieldsMap,
} from "@/lib/search";
import { buildMatchClauses } from "@/lib/search/booleanQuery";
import { create } from "zustand";

export const useAdvancedSearch = create<AdvancedSearchStore>((set, get) => ({
  textFields: new Map(),
  dates: {
    [CREATED_BEFORE]: undefined,
    [CREATED_AFTER]: undefined,
  },
  readTime: {
    [LESSER]: undefined,
    [GREATER]: undefined,
  },

  setInitialTextFields: (fields: TextFieldsMap) => set({ textFields: fields }),

  setTextField: (field: TextField, value: string) => {
    set((state) => ({
      textFields: new Map(state.textFields).set(field, value),
    }));
  },

  setDate: (DATE_TYPE: DateType, date: Date) => {
    set((state) => ({
      dates: {
        ...state.dates,
        [DATE_TYPE]: date,
      },
    }));
  },

  setReadTime: (TIME_TYPE: ReadTimeType, value: number) => {
    set((state) => {
      let lesser = state.readTime[LESSER];
      let greater = state.readTime[GREATER];

      //assure greater >= value >= lesser
      if (TIME_TYPE == GREATER) {
        greater = value;
        if (!!lesser && lesser < value) {
          lesser = value;
        }
      } else {
        lesser = value;
        if (!!greater && greater > value) {
          greater = value;
        }
      }

      return {
        readTime: {
          [LESSER]: lesser,
          [GREATER]: greater,
        },
      };
    });
  },

  getAdvancedSearchState: () => {
    const { textFields, dates, readTime } = get();
    return { textFields, dates, readTime };
  },
}));

export function parseQueryToTextFieldsState(query: string): TextFieldsMap {
  const { terms, must, must_not } = buildMatchClauses(query);
  const fields = new Map<TextField, string>();

  fields.set(TextField.ShouldTerms, stripPunctuations(terms));
  fields.set(
    TextField.MustPhrases,
    tokensToCsv(extractMatchClauseTokens(must, MatchType.Phrase))
  );

  fields.set(
    TextField.MustNotTerms,
    tokensToCsv(extractMatchClauseTokens(must_not, MatchType.Term))
  );

  fields.set(
    TextField.MustNotPhrases,
    tokensToCsv(extractMatchClauseTokens(must_not, MatchType.Phrase))
  );
  return fields;
}

function tokensToCsv(tokens: string[]) {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
}

export function buildQueryFromState(fields: TextFieldsMap) {
  let result = "";
  const shouldTerms = fields.get(TextField.ShouldTerms);
  const mustPhrases = fields.get(TextField.MustPhrases);
  const mustNotTerms = fields.get(TextField.MustNotTerms);
  const mustNotPhrases = fields.get(TextField.MustNotPhrases);

  const toPhrase = (phrase: string) => `"${phrase.trim()}" `;
  const toNegatedTerm = (term: string) => `!${term} `;
  const toNegatedPhrase = (phrase: string) => `!"${phrase.trim()}" `;

  if (!!shouldTerms) {
    result += stripPunctuations(shouldTerms) + " ";
  }

  if (!!mustPhrases) {
    result += mustPhrases.split(",").map(toPhrase);
  }

  if (!!mustNotTerms) {
    result += mustNotTerms.split(" ").map(toNegatedTerm);
  }

  if (!!mustNotPhrases) {
    result += mustNotPhrases.split(",").map(toNegatedPhrase);
  }

  return trimMultipleWhitespaces(result).replaceAll(",", "");
}
