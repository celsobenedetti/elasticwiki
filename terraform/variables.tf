variable "linode_tk" {
  type = string
}

variable "ssh_key" {
  type = string
}

variable "linode_pass" {
  type = string
}

variable "linode_user" {
  type = string
}

variable "elastic_dir" {
  type        = string
  description = "location inside VM where the elasticsearch cluster compose file will be placed"
}

variable "elastic_port" {
  type = string
}
