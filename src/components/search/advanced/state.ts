import {
  extractMatchClauseTokens,
  MatchType,
  stripPunctuations,
  trimMultipleWhitespaces,
} from "@/lib/search";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

export type SearchState = {
  textFields: Map<TextField, string>;
  dates: {
    before: Date | undefined;
    after: Date | undefined;
  };
  readTime: {
    greater: number | undefined;
    lesser: number | undefined;
  };
};

export function buildInitialState(query: string): SearchState {
  return {
    textFields: parseQueryToTextFieldsState(query),
    dates: { before: undefined, after: undefined },
    readTime: { lesser: undefined, greater: undefined },
  };
}

export type TextFieldsState = SearchState["textFields"];

export enum TextField {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

export enum DateField {
  Before = 100,
  After,
}

export enum ReadTimeField {
  Lesser = 1000,
  Greater,
}

export type InputAction =
  | { type: TextField; content: string }
  | { type: DateField; content: Date }
  | { type: ReadTimeField; content: number };

const tokensToSeparatedValues = (tokens: string[]) => {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
};

function parseQueryToTextFieldsState(query: string): TextFieldsState {
  const { terms, must, must_not } = buildBooleanQuery(query);
  const fields = new Map<TextField, string>();

  fields.set(TextField.ShouldTerms, stripPunctuations(terms));
  fields.set(
    TextField.MustPhrases,
    tokensToSeparatedValues(extractMatchClauseTokens(must, MatchType.Phrase))
  );

  fields.set(
    TextField.MustNotTerms,
    tokensToSeparatedValues(extractMatchClauseTokens(must_not, MatchType.Term))
  );

  fields.set(
    TextField.MustNotPhrases,
    tokensToSeparatedValues(
      extractMatchClauseTokens(must_not, MatchType.Phrase)
    )
  );
  return fields;
}

export function searchStateReducer(
  state: SearchState,
  action: InputAction
): SearchState {
  switch (action.type) {
    //handle all text field changes with same logic
    case TextField.ShouldTerms:
    case TextField.MustNotTerms:
    case TextField.MustPhrases:
    case TextField.MustNotPhrases: {
      return {
        ...state,
        textFields: new Map(state.textFields).set(action.type, action.content),
      };
    }

    // TODO: Handle dates and readtimes
    case DateField.Before: {
    }
    case DateField.After: {
    }
    case ReadTimeField.Lesser: {
    }
    case ReadTimeField.Greater: {
    }

    default:
      return state;
  }
}

export function buildQuery(fields: TextFieldsState) {
  let result = "";
  const shouldTerms = fields.get(TextField.ShouldTerms);
  const mustPhrases = fields.get(TextField.MustPhrases);
  const mustNotTerms = fields.get(TextField.MustNotTerms);
  const mustNotPhrases = fields.get(TextField.MustNotPhrases);

  const toPhrase = (phrase: string) => `"${phrase}" `;
  const toNegatedTerm = (term: string) => `!${term} `;
  const toNegatedPhrase = (phrase: string) => `!"${phrase}" `;

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
