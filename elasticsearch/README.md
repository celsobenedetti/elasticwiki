# Elasticsearch cluster

The `elastic-cluster.yml` docker compose file includes 2 Elasticsearch nodes, and Kibana

The `elastic-setup` container is responsible for generating the TLS certificates for the cluster

The certificates are configured to authorize `$ELASTIC_HOST_IP` for https requests, this is done through the `instances.yml` file in the Elasticsearch setup

## Highlights

The highlights feature in Elasticsearch allows for queries to return identifiers for the matches in the document fields

It returns _fragments_ containing the section of the document containing matches with the search query

By default, the matches are wrapped in a `<em></em>` tag. This is used for rendering highlights on the frontend result

Return the highlights for "content" field:

```json
highlight: {
    fields: {
        content: {
            number_of_fragments: 0,
        },
    },
}
```

Setting `number_of_fragments=0` returns the "content" text undivided
