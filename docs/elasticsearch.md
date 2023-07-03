# Elasticsearch JavaScript Client

The Elasticsearch JavaScript provides a straightforward API to work with Elasticsearch

## Architecture

The client architecture can be followed as such

- **API**

  - The client callable interface

- **Transport**

  - The coordinator between the API and the connection pool

- **Connection Pool**

  - A class containing an _alive pool_ and a _dead pool_
  - It contains a _selector_, which picks a connection from the _alive pool_ and returns it to the _transport_ whenever a request is made
  - If the connection is healthy, it is marked alive and returned to the _alive pool_, otherwise it is returned to the _dead pool_ with the mark dead API

- **HTTP Connection**

  - Bare bones Node.js HTTP client with a keep-alive agent

## Authentication

It is always recommended for cluster authentication to be enabled

This can be done through custom TLS certificates, or issued API keys, as well as user credentials

## Highlights

The highlights feature in Elasticsearch allows for queries to return identifiers for the matches in the document fields

It returns _fragments_ containing the section of the document containing matches with the search query

By default, the matches are wrapped in a `<em></em>` tag. This is used for rendering highlights on the frontend result

Return the highlights for "content" field:

```javascript
{
    // ...
    highlight: {
        fields: {
            content: {
                number_of_fragments: 0,
            },
        },
    }
}
```

Setting `number_of_fragments=0` returns the "content" text undivided

## Refs

- [Docs: Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api)
- [Docs: Elasticsearch highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting)

2023-06-07
