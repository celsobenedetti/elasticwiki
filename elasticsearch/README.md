# Elasticsearch cluster

The `elastic-cluster.yml` docker compose file includes 2 Elasticsearch nodes, and Kibana

The `elastic-setup` container is responsible for generating the TLS certificates for the cluster

The certificates are configured to authorize `$ELASTIC_HOST_IP` for https requests, this is done through the `instances.yml` file in the Elasticsearch setup
