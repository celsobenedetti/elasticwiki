import {
  type TextFieldsMap,
  extractMatchClauseTokens,
  MatchType,
  stripPunctuations,
  TextField,
  trimMultipleWhitespaces,
} from "@/lib/search";
import { buildMatchClauses } from "@/lib/search/booleanQuery";

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
