# ElasticWiki

Search engine web app based on Elasticsearch

### Built with

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)

## Features / Things Learned

### Elasticsearch

- Search text [highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting)
- Keywords suggestions with [significant text aggregation](https://www.elastic.co/guide/en/elasticsearch/reference/8.8/search-aggregations-bucket-significanttext-aggregation.html)
- "Did you mean" search suggestions with [Phrase Suggester](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#phrase-suggester) and [Shingle Token Filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-shingle-tokenfilter.html)
- Search bar autocompletion with [search_as_you_type field type](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html#search-as-you-type)
- [Stop words](https://en.wikipedia.org/wiki/Stop_words) handling with [Stop Token Filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-tokenfilter.html)
- Advanced query filtering with [Boolean Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)

### Web

- Modular and minimal styling with TailwindCSS and shadcn/ui
- Infinite scrolling with TanStack Query [useInfiniteQuery](https://tanstack.com/query/v4/docs/react/reference/useInfiniteQuery)
- E2E type safety with tRPC
- External state/context management with Zustand

## Points of improvement

- Scalable Elastic cluster on K8s
- TLS management with Traefik

## Notes

- [Elasticsearch](./docs/elasticsearch.md)
- [tRPC](./docs/trpc.md)
- [Terraform](./terraform/README.md)
- [direnv](./docs/direnv.md)

- ## Refs

- [shadcn/ui — Theming Wrapped in a Tailwind Plugin/Preset](https://www.youtube.com/watch?v=QJlTWj30krw&t=10s)
- [TanStack Query infinite scrolling](https://tanstack.com/query/v4/docs/react/examples/react/load-more-infinite-scroll)
- [Elasticsearch with Docker](https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html)
- [Elasticsearch Term Suggester](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#term-suggester)
- [Use Terraform to Provision Linode Environments ](https://www.linode.com/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/)
- [Python Elasticsearch Client](https://elasticsearch-py.readthedocs.io/en/v7.10.1/)
- [Linode: How do I check memory usage?](https://www.linode.com/community/questions/18654/how-do-i-check-memory-usage)
- [Elastricsearch Phrase Sugester](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html#phrase-suggester)
  - [Elasticsearch Shingle Token Filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-shingle-tokenfilter.html)
- [Elasticsearch search_as_you_type Field Type](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html#search-as-you-type)
- [Elasticsearch Stop Token Filter](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-stop-tokenfilter.html)
- [Elasticsearch Boolean Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html)

> This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
