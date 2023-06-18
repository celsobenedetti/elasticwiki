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

## X-Opaque-Id

This is an Elasticsearch feature to attach a header to every request to identify the client making the request

This header is used to track requests across the cluster

## Refs

- [Docs: Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api)

2023-06-07
