## Linode Terraform

The `create-linode.tf` creates and provisions a new Linode instance to run the Elasticsearch cluster:

1. Creates a new Linode instance
2. Installs docker
3. Copies the necessary docker-compose files
4. Runs the cluster with docker-compose
5. Copies the `ca.crt` from the Elasticsearch container to local file system
6. Builds and populates the `/wikipedia` Elasticsearch index

The provisioning is all done using [Terraform provisioners](https://developer.hashicorp.com/terraform/language/resources/provisioners/syntax), which is discouraged, but simple enough

## Env variables

```bash
export TF_VAR_linode_tk=$LINODE_TOKEN
export TF_VAR_linode_user=user
export TF_VAR_linode_pass=pas
export TF_VAR_ssh_key=$(cat ~/.ssh/my_key.pub)
export TF_VAR_elastic_dir=dir
export TF_VAR_elastic_port=$ES_PORT
```

### Get resource information

```bash
curl https://api.linode.com/v4/regions | jq
curl https://api.linode.com/v4/linode/types/ | jq
curl https://api.linode.com/v4/images/ | jq
```

## Refs

- [Use Terraform to Provision Linode Environments ](https://www.linode.com/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/)
