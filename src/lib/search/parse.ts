import { type QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { CONTENT_FIELD, type MatchType } from "./types";

type BoolClauses = QueryDslQueryContainer[];

const trimMultipleWhitespaces = (s: string) => s.replaceAll(/\s+/g, " ").trim();

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
        clause[match]?.[CONTENT_FIELD]?.toString().replaceAll(/"|!/g, "")
      )
      .filter((token) => !!token) as string[]
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
