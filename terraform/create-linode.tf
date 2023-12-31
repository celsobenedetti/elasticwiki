# Creates new linode instance with elasticsearch cluster running

terraform {
  required_providers {
    linode = {
      source  = "linode/linode"
      version = "2.5.2"
    }
  }
}

provider "linode" {
  token = var.linode_tk
}

resource "linode_instance" "elasticwiki-elasticsearch" {
  image           = "linode/ubuntu18.04"
  label           = "elasticwiki-elasticsearch"
  group           = "Terraform"
  region          = "us-west"
  type            = "g6-standard-2" # 4GB RAM required for elastic-cluster
  root_pass       = var.linode_pass
  authorized_keys = [var.ssh_key]
}

resource "terraform_data" "provisioner" {
  connection {
    type = "ssh"
    user = var.linode_user
    host = tolist(linode_instance.elasticwiki-elasticsearch.ipv4)[0]
  }

  provisioner "remote-exec" {
    inline = [
      "apt-get update",
      "apt-get install -y docker.io",
      "apt-get install -y docker-compose",
      "systemctl enable docker",
      "systemctl start docker",
      "sysctl -w vm.max_map_count=262144",
      "mkdir ${var.elastic_dir}",
    ]
  }

  provisioner "file" {
    source      = "../elasticsearch/elastic-cluster.yml"
    destination = "${var.elastic_dir}/docker-compose.yml"
  }

  provisioner "file" {
    source      = "../.env"
    destination = "${var.elastic_dir}/.env"
  }

  provisioner "remote-exec" {
    inline = [
      "cd ${var.elastic_dir}",

      # run elasticsearch cluster
      "export ELASTIC_HOST_IP=${tolist(linode_instance.elasticwiki-elasticsearch.ipv4)[0]} && docker-compose up -d",

      # copy certificate from inside the container to VM FS
      "docker cp $(docker ps | grep es01 | awk '{print $1}'):/usr/share/elasticsearch/config/certs/ca/ca.crt .",
    ]
  }

  # copy certificate from VM to local FS
  provisioner "local-exec" {
    command = "scp -o StrictHostKeyChecking=no -r ${var.linode_user}@${tolist(linode_instance.elasticwiki-elasticsearch.ipv4)[0]}:/${var.elastic_dir}/ca.crt ."
  }

  # build elasticsearch index
  provisioner "local-exec" {
    command = <<EOT
    python3 ../elasticsearch/build_index.py \
            --cert ca.crt \
            --host https://${tolist(linode_instance.elasticwiki-elasticsearch.ipv4)[0]}:${var.elastic_port} \
            --es-dir "../elasticsearch" \
    EOT
  }
}
