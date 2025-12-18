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

