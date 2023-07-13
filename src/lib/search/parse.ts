import { type QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { CONTENT_FIELD, type MatchType } from "./types";

type BoolClauses = QueryDslQueryContainer[];

export const trimMultipleWhitespaces = (s: string) =>
  s.replaceAll(/\s+/g, " ").trim();

export const stripPunctuations = (s: string) => s.replaceAll(/"|!|,/g, "");

/**Extracts the tokens of a boolean match clause into string[]
eg.:
{clauses} must_not.match_phrase.[CONTENT_FIELD] = "must not match"
{match}: "phrase" | "match_phrase"
*/
export function extractMatchClauseTokens(
  clauses: BoolClauses,
  match: MatchType
) {
  const removeDuplicates = (array: string[]) => [...new Set(array)];
  return removeDuplicates(
    clauses
      .map((clause) =>
        stripPunctuations(clause[match]?.[CONTENT_FIELD]?.toString() || "")
      )
      .filter((token) => !!token)
  );
}

export function stripRegexMatchesFromString(
  text: string,
  matches: RegExpMatchArray | null
) {
  let output = text;
  for (const match of matches || []) {
    output = output.replaceAll(match, "");
  }

  return trimMultipleWhitespaces(output);
}
