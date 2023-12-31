import { type QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

import { stripRegexMatchesFromString } from "./parse";
import { CONTENT_FIELD } from "./types";

const QUOTED_PHRASE = /"([^"]+)"/g;
const NEGATED_PHRASE = /!"([^"]+)"/g;
const NEGATED_WORD = /!([^ ]+)/g;

/**
Parses search options into Elasticsearch boolean query object

For each following {query}, returns:

"quoted phrases"            => must: { match_phrase: {query} }
!"negated quoted phrases"   => must_not: { match_phrase: {query} }
!negatedTerm                => must_not: { match: {query} }
regularTerms                => should: { match: {query}}
*/
export function buildMatchClauses(
  input: string,
  // { field = CONTENT_FIELD, mustIncludeTerms = false }: { field?: string, mustIncludeTerms?: boolean } = {}
  {
    field = CONTENT_FIELD,
    mustIncludeTerms = false,
  }: { field?: string; mustIncludeTerms?: boolean } = {}
) {
  return booleanQueryClauses(
    inputToBooleanOptions(input),
    field,
    mustIncludeTerms
  );
}

/** Parses query options tokens into Elasticsearch boolean query match clause objects */
function booleanQueryClauses(
  options: ReturnType<typeof inputToBooleanOptions>,
  field: string,
  mustIncludeTerms: boolean
) {
  const { terms, negatedTerms, quotedPhrases, negatedQuotedPhrases } = options;

  const should = [] as QueryDslQueryContainer[];
  const must = [] as QueryDslQueryContainer[];
  const must_not = [] as QueryDslQueryContainer[];

  const toFieldObject = (s: string) => ({ [field]: s });
  const toMatch = (s: string) => ({ match: toFieldObject(s) });
  const toMatchPhrase = (s: string) => ({ match_phrase: toFieldObject(s) });

  if (terms.length) {
    should.push(toMatch(terms));
    if (mustIncludeTerms) {
      must.push(toMatch(terms));
    }
  }

  must.push(...quotedPhrases.map(toMatchPhrase));
  must_not.push(...negatedTerms.map(toMatch));
  must_not.push(...negatedQuotedPhrases.map(toMatchPhrase));

  return { must, must_not, should, terms };
}

/** Parses input string into an search match options objects
Handles: "phrases", !negatedTerms, !"negated phrases"
*/
function inputToBooleanOptions(input: string) {
  let terms = input;

  const negatedQuotedPhrases = input.match(NEGATED_PHRASE);
  terms = stripRegexMatchesFromString(terms, negatedQuotedPhrases);

  const quotedPhrases = terms.match(QUOTED_PHRASE);
  terms = stripRegexMatchesFromString(terms, quotedPhrases);

  const negatedTerms = terms.match(NEGATED_WORD);
  terms = stripRegexMatchesFromString(terms, negatedTerms);

  return {
    terms: terms,
    negatedTerms: negatedTerms || [],
    quotedPhrases: quotedPhrases || [],
    negatedQuotedPhrases: negatedQuotedPhrases || [],
  };
}
