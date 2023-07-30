# Direnv

[direnv](https://github.com/direnv/direnv) is an awesome tool for managing project specific environment variables

```bash
# cool examples
export ELASTIC_HOST=https://localhost:9200
export ELASTIC_CERT=$(cat ./certs/ca.crt)
export TF_VAR_linode_pass=pass
export TF_VAR_linode_tk=$LINODE_TOKEN
export TF_VAR_ssh_key=$(cat ~/.ssh/my_key.pub)
```
