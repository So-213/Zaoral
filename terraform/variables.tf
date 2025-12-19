variable "aws_region" {
  description = "AWS region for S3 bucket"
  type        = string
  default     = "ap-northeast-1"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for projects_picture"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "allowed_origins" {
  description = "List of allowed origins for CORS"
  type        = list(string)
  default     = ["*"]
}

