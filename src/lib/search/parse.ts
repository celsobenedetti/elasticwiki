import {
  type QueryDslBoolQuery,
  type QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";
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
export function buildBooleanQueryDsl(input: string) {
  return searchOptionsToBoolQuery(inputToSearchOptions(input));
}

/** Parses search options into Elasticsearch boolean query object */
function searchOptionsToBoolQuery(
  options: ReturnType<typeof inputToSearchOptions>
) {
  const { terms, negatedTerms, quotedPhrases, negatedQuotedPhrases } = options;

  const should = [] as QueryDslQueryContainer[];
  const must = [] as QueryDslQueryContainer[];
  const must_not = [] as QueryDslQueryContainer[];

  const toContentObject = (s: string) => ({ [CONTENT_FIELD]: s });
  const toMatch = (s: string) => ({ match: toContentObject(s) });
  const toMatchPhrase = (s: string) => ({ match_phrase: toContentObject(s) });

  if (terms.length) {
    should.push(toMatch(terms));
  }

  must.push(...quotedPhrases.map(toMatchPhrase));
  must_not.push(...negatedTerms.map(toMatch));
  must_not.push(...negatedQuotedPhrases.map(toMatchPhrase));

  const result = {} as QueryDslBoolQuery;

  if (should.length) result.should = should;
  if (must.length) result.must = must;
  if (must_not.length) result.must_not = must_not;

  return result;
}

/** Parses input string into an search match options object
eg: "quotes" into match_phrase objects
eg: !negation into NOT match word 
eg: !"some phrase" into NOT match phrase */
function inputToSearchOptions(input: string) {
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

function stripRegexMatchesFromString(
  text: string,
  matches: RegExpMatchArray | null
) {
  let output = text;
  for (const match of matches || []) {
    output = output.replaceAll(match, "");
  }

  return output.replaceAll(/\s+/g, " ").trim(); //replace multiple whitespaces
}
