provider "aws" {
  region = var.region
}

module "dev" {
  source = "../resources"
}
