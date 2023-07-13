import { extractMatchClauseTokens, MatchType } from "@/lib/search";
import { buildBooleanQuery } from "@/lib/search/booleanQuery";

type InputFields = {
  shouldTerms: string;
  mustPhrases: string;
  mustNotTerms: string;
  mustNotPhrases: string;
};

enum InputType {
  ShouldTerms = 0,
  MustPhrases,
  MustNotTerms,
  MustNotPhrases,
}

type InputEvent = {
  type: InputType;
  content: string;
};

const tokensToCsv = (tokens: string[]) => {
  return tokens
    .reduce((csv, token) => csv + ", " + token, "")
    .slice(1)
    .trim();
};

export function createInitialInputState(query: string): InputFields {
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
  fields: InputFields,
  inputEvent: InputEvent
): InputFields {
  switch (inputEvent.type) {
    case InputType.MustPhrases: {
      return {
        ...fields,
        mustPhrases: inputEvent.content,
      };
    }
  }

  //TODO: Handle form input events

  return {
    shouldTerms: "",
    mustPhrases: "",
    mustNotTerms: "",
    mustNotPhrases: "",
  };
}
