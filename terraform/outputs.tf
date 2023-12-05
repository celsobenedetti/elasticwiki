output "linode_ip" {
  description = "New Linode instance ip address"
  value       = linode_instance.elasticwiki-elasticsearch.ipv4
}
