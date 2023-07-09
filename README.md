# Document Finder App

> WIP

- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com/)

## Elasticsearch TLS

The `elastic-cluster.yml` has TLS enabled by default, all https communication must be authenticated

It creates certificates authorizing `$ELASTIC_HOST_IP` as a valid ip to make https requests to

The certificate is required for all connections to the cluster, including the Elasticsearch JavaScript Client used in the app.

It can be copied from the container to the local FS

```bash
docker cp elasticsearch-es01-1:/usr/share/elasticsearch/config/certs/ca/ca.crt .
# communicate to Elasticsearch
curl --cacert ca.crt -u $ELASTIC_USER:$ELASTIC_PASSWORD $ELASTIC_HOST
```

The `ca.crt` is exported as the `$ELASTIC_CERT` variable to be consumed on the app and the python client on `build_index.py`

## Notes

- [Elasticsearch](./docs/elasticsearch.md)
- [tRPC](./docs/trpc.md)
- [Terraform](./terraform/README.md)

### Direnv

[direnv](https://github.com/direnv/direnv) is an awesome tool for managing project specific environment variables

```bash
# cool examples
export ELASTIC_HOST=https://localhost:9200
export ELASTIC_CERT=$(cat ./certs/ca.crt)
export TF_VAR_linode_pass=pass
export TF_VAR_linode_tk=$LINODE_TOKEN
export TF_VAR_ssh_key=$(cat ~/.ssh/my_key.pub)
```

## Refs

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
