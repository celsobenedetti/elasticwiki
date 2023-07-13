import {
  extractMatchClauseTokens,
  MatchType,
  trimMultipleWhitespaces,
} from "@/lib/search";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

export type InputState = {
  shouldTerms: string;
  mustPhrases: string;
  mustNotTerms: string;
  mustNotPhrases: string;
};

export enum InputType {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

export type InputAction = {
  type: InputType;
  content: string;
};

const tokensToSeparatedValues = (tokens: string[]) => {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
};

export function parseQueryToInputstate(query: string): InputState {
  const { terms, must, must_not } = buildBooleanQuery(query);

  // TODO: remove commas from query
  return {
    shouldTerms: terms,
    mustPhrases: tokensToSeparatedValues(
      extractMatchClauseTokens(must, MatchType.Phrase)
    ),
    mustNotTerms: tokensToSeparatedValues(
      extractMatchClauseTokens(must_not, MatchType.Term)
    ),
    mustNotPhrases: tokensToSeparatedValues(
      extractMatchClauseTokens(must_not, MatchType.Phrase)
    ),
  };
}

export function inputReducer(
  fields: InputState,
  action: InputAction
): InputState {
  switch (action.type) {
    case InputType.ShouldTerms: {
      return {
        ...fields,
        shouldTerms: action.content,
      };
    }

    case InputType.MustPhrases: {
      return {
        ...fields,
        mustPhrases: action.content,
      };
    }

    case InputType.MustNotTerms: {
      return {
        ...fields,
        mustNotTerms: action.content,
      };
    }

    case InputType.MustNotPhrases: {
      return {
        ...fields,
        mustNotPhrases: action.content,
      };
    }
  }
}

export function buildQuery(input: InputState) {
  let result = input.shouldTerms + " ";
  if (!!input.mustPhrases.length)
    result += input.mustPhrases.split(",").map((phrase) => `"${phrase}" `);

  if (!!input.mustNotTerms.length)
    result += input.mustNotTerms.split(" ").map((term) => `!${term} `);

  if (!!input.mustNotPhrases.length)
    result += input.mustNotPhrases.split(",").map((phrase) => `!"${phrase}" `);
  return trimMultipleWhitespaces(result).replaceAll(",", "");
}
