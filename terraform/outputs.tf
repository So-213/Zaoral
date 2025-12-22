output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.project_pictures.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.project_pictures.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.project_pictures.bucket_domain_name
}

output "iam_policy_arn" {
  description = "ARN of the IAM policy for S3 upload"
  value       = aws_iam_policy.s3_upload_policy.arn
}

output "runtime_user_name" {
  description = "Name of the runtime IAM user"
  value       = aws_iam_user.runtime_user.name
}

output "runtime_access_key_id" {
  description = "Access Key ID for the runtime user (set this in your application environment variables)"
  value       = aws_iam_access_key.runtime_user_key.id
  sensitive   = false
}

output "runtime_secret_access_key" {
  description = "Secret Access Key for the runtime user (set this in your application environment variables - shown only once!)"
  value       = aws_iam_access_key.runtime_user_key.secret
  sensitive   = true
}

