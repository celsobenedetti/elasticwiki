# T3 Document Finder App with Elasticsearch

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [Elasticsearch JavaScript Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)

## Elasticsearch TLS

The `elastic-cluster.yml` has TLS security enabled by default. It creates certificates that need to be used for Elasticsearch JavaScript Client authentication.

They can be copied from the container to the local FS

```bash
docker cp elasticsearch-es01-1:/usr/share/elasticsearch/config/certs/ca .
# ca/ca.crt  ca/ca.key
```

The `ca.crt` certificate needs to be present in the root of the project for Elasticsearch JavaScript client to authenticate

## Notes

- [Note: Elasticsearch Javascrip Client](./docs/elasticsearch-js.md)
- [Note: tRPC](./docs/trpc.md)

## Refs

- [shadcn/ui — Theming Wrapped in a Tailwind Plugin/Preset](https://www.youtube.com/watch?v=QJlTWj30krw&t=10s)

> This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.
