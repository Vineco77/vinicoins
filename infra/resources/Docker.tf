data "aws_caller_identity" "current" {}
data "aws_ecr_authorization_token" "token" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
  region     = "us-east-1"
}

provider "docker" {
  registry_auth {
    address  = "${local.account_id}.dkr.ecr.${local.region}.amazonaws.com"
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
}

resource "docker_registry_image" "imagem_ecr" {
  name = "${aws_ecr_repository.vinicoins_repository.repository_url}:latest"

  build {
    context    = "../../backend"
    dockerfile = "Dockerfile"
  }
}