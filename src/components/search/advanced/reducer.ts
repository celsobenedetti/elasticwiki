import { extractMatchClauseTokens, MatchType } from "@/lib/search";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

export type InputState = {
  shouldTerms: string;
  mustPhrases: string;
  mustNotTerms: string;
  mustNotPhrases: string;
};

export type InputAction = {
  type: InputType;
  content: string;
};

enum InputType {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

const tokensToCsv = (tokens: string[]) => {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
};

export function parseQueryToInputstate(query: string): InputState {
  const { terms, must, must_not } = buildBooleanQuery(query);

  return {
    shouldTerms: terms,
    mustPhrases: tokensToCsv(extractMatchClauseTokens(must, MatchType.Phrase)),
    mustNotTerms: tokensToCsv(
      extractMatchClauseTokens(must_not, MatchType.Term)
    ),
    mustNotPhrases: tokensToCsv(
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
