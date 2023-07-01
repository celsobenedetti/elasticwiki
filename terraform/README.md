## Linode Terraform

The `create-linode.tf` creates and provisions a new Linode instance to run the Elasticsearch cluster:

1. Creates a new Linode instance
2. Installs docker
3. Copies the necessary docker-compose files
4. Runs the cluster with docker-compose
5. Copies the `ca.crt` from the Elasticsearch container, to the Linode FS, and then into local machine FS

### Get resource information

```bash
curl https://api.linode.com/v4/regions | jq
curl https://api.linode.com/v4/linode/types/ | jq
curl https://api.linode.com/v4/images/ | jq
```
