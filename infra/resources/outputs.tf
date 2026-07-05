output "repository_url" {
  description = "ECR repository URL of Docker image"
  value       = aws_ecr_repository.vinicoins_repository.repository_url
}
