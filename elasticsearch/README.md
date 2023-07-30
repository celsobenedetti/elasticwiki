# Elasticsearch cluster

| File                         | Desc                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `elastic-cluster.yml`        | Elasticsearch docker-compose cluster. Includes 2 Elasticsearch nodes, and Kibana <br> The `elastic-setup` container is responsible for generating the TLS certificates for the cluster <br> The certificates are configured to authorize `$ELASTIC_HOST_IP` for https requests, this is done through the `instances.yml` file in the Elasticsearch setup |
| `wikipedia_mapping.json`     | Contains index mapping configuration for the `/wikipedia` index                                                                                                                                                                                                                                                                                          |
| `wiki.json`                  | JSON with over 36k wikipedia documents, used to populate the Elasticsearch index                                                                                                                                                                                                                                                                         |
| `build_index.py`             | Python script with Elasticsearch client to build and populate the index                                                                                                                                                                                                                                                                                  |
| `elastic-cluster-unsafe.yml` | Unused. Elasticsearch docker-compose cluster without TLS                                                                                                                                                                                                                                                                                                 |

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
