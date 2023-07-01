#
output "linode_ip" {
  description = "New Linode instance ip address"
  value       = linode_instance.t3-elasticsearch.ipv4
}
