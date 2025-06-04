variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1" # US East (N. Virginia) has the most free tier options
}

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "factura"
}

variable "db_name" {
  description = "Name of the database"
  type        = string
  default     = "factura"
}

variable "db_username" {
  description = "Username for the database"
  type        = string
  default     = "postgres"
}

variable "db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
  # Do not set a default for sensitive values
  # This will be provided via terraform.tfvars or environment variables
} 