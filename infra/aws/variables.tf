variable "region" {
  type    = string
  default = "us-east-1"
}

variable "ecr_name" {
  type    = string
  default = "vinicoins-dev-ecr"
}

variable "environment" {
  type    = string
  default = "dev"
}