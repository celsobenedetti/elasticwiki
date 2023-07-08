import {
  QueryDslMatchQuery,
  type QueryDslBoolQuery,
  type QueryDslQueryContainer,
} from "@elastic/elasticsearch/lib/api/types";
import { CONTENT_FIELD } from "./types";

const PHRASE = /"([^"]+)"/g;
const NEGATED_PHRASE = /!"([^"]+)"/g;
const NEGATED_WORD = /!([^ ]+)/g;

function stripRegexMatchesFromString(
  text: string,
  matches: RegExpMatchArray | null
) {
  let output = text;
  for (const match of matches || []) {
    output = output.replaceAll(match, "");
  }
  return output;
}

export function buildBooleanQuery(input: string) {
  return searchOptionsToBoolQuery(inputToSearchOptions(input));
}

/** Parses input string into an search match options object
eg: "quotes" into match_phrase objects
eg: !negation into NOT match word 
eg: !"some phrase" into NOT match phrase */
function inputToSearchOptions(input: string) {
  let terms = input;

  const negatedQuotedPhrases = input.match(NEGATED_PHRASE);
  terms = stripRegexMatchesFromString(terms, negatedQuotedPhrases);

  const quotedPhrases = terms.match(PHRASE);
  terms = stripRegexMatchesFromString(terms, quotedPhrases);

  const negatedTerms = terms.match(NEGATED_WORD);
  terms = stripRegexMatchesFromString(terms, negatedTerms);

  return {
    terms,
    negatedTerms: negatedTerms || [],
    quotedPhrases: quotedPhrases || [],
    negatedQuotedPhrases: negatedQuotedPhrases || [],
  };
}

/**Parses search options into Elasticsearch boolean query object*/
function searchOptionsToBoolQuery(
  options: ReturnType<typeof inputToSearchOptions>
) {
  const { terms, negatedTerms, quotedPhrases, negatedQuotedPhrases } = options;

  const must = [] as QueryDslQueryContainer[];
  const must_not = [] as QueryDslQueryContainer[];

  const match = (s: string) => ({ match: { [CONTENT_FIELD]: s } });
  const matchPhrase = (s: string) => ({ match_phrase: { [CONTENT_FIELD]: s } });

  must.push(...[terms].map(match));
  must.push(...quotedPhrases.map(matchPhrase));

  must_not.push(...negatedTerms.map(match));
  must_not.push(...negatedQuotedPhrases.map(matchPhrase));

  const result = {} as QueryDslBoolQuery;
  if (must.length) result.must = must;
  if (must_not.length) result.must_not = must_not;

  return result;
}
