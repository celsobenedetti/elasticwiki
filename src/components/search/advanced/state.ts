import {
  extractMatchClauseTokens,
  MatchType,
  stripPunctuations,
  trimMultipleWhitespaces,
} from "@/lib/search";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

export type SearchState = {
  inputFields: Map<InputType, string>;
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
    inputFields: parseQueryToInputstate(query),
    dates: { before: undefined, after: undefined },
    readTime: { lesser: undefined, greater: undefined },
  };
}

export type InputState = SearchState["inputFields"];

export enum InputType {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

export enum DateType {
  Before = 0,
  After,
}

export enum ReadTime {
  Lesser = 0,
  Greater,
}

export type InputAction =
  | { type: InputType; content: string }
  | { type: DateType; content: Date }
  | { type: ReadTime; content: number };

const tokensToSeparatedValues = (tokens: string[]) => {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
};

function parseQueryToInputstate(query: string): InputState {
  const { terms, must, must_not } = buildBooleanQuery(query);
  const inputFields = new Map<InputType, string>();

  inputFields.set(InputType.ShouldTerms, stripPunctuations(terms));
  inputFields.set(
    InputType.MustPhrases,
    tokensToSeparatedValues(extractMatchClauseTokens(must, MatchType.Phrase))
  );

  inputFields.set(
    InputType.MustNotTerms,
    tokensToSeparatedValues(extractMatchClauseTokens(must_not, MatchType.Term))
  );

  inputFields.set(
    InputType.MustNotPhrases,
    tokensToSeparatedValues(
      extractMatchClauseTokens(must_not, MatchType.Phrase)
    )
  );
  return inputFields;
}

export function inputReducer(
  state: SearchState,
  action: InputAction
): SearchState {
  switch (action.type) {
    //handle all input fields with same logic
    case InputType.ShouldTerms:
    case InputType.MustNotTerms:
    case InputType.MustPhrases:
    case InputType.MustNotPhrases: {
      return {
        ...state,
        inputFields: new Map(state.inputFields).set(
          action.type,
          action.content
        ),
      };
    }

    // TODO: Handle dates and readtimes
    case DateType.Before: {
    }
    case DateType.After: {
    }
    case ReadTime.Lesser: {
    }
    case ReadTime.Greater: {
    }

    default:
      return state;
  }
}

export function buildQuery(input: InputState) {
  let result = "";
  const shouldTerms = input.get(InputType.ShouldTerms);
  const mustPhrases = input.get(InputType.MustPhrases);
  const mustNotTerms = input.get(InputType.MustNotTerms);
  const mustNotPhrases = input.get(InputType.MustNotPhrases);

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
