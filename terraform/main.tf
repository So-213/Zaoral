terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# S3バケット（画像アップロード用）
resource "aws_s3_bucket" "project_pictures" {
  bucket = var.s3_bucket_name

  tags = {
    Name        = "Zaoral Project Pictures"
    Environment = var.environment
    Project     = "zaoral"
  }
}

# S3バケットのバージョニング設定
resource "aws_s3_bucket_versioning" "project_pictures" {
  bucket = aws_s3_bucket.project_pictures.id

  versioning_configuration {
    status = "Enabled"
  }
}

# S3バケットのパブリックアクセスブロック設定
# 読み取りは許可、書き込みはブロック
resource "aws_s3_bucket_public_access_block" "project_pictures" {
  bucket = aws_s3_bucket.project_pictures.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls     = false
  restrict_public_buckets = false
}

# S3バケットポリシー（パブリック読み取りを許可）
resource "aws_s3_bucket_policy" "project_pictures" {
  bucket = aws_s3_bucket.project_pictures.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.project_pictures.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.project_pictures]
}

# S3バケットのCORS設定（必要に応じて）
resource "aws_s3_bucket_cors_configuration" "project_pictures" {
  bucket = aws_s3_bucket.project_pictures.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = var.allowed_origins
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# S3バケットのライフサイクル設定（31日後に自動削除）
resource "aws_s3_bucket_lifecycle_configuration" "project_pictures" {
  bucket = aws_s3_bucket.project_pictures.id

  rule {
    id     = "delete_expired_pictures"
    status = "Enabled"

    filter {}

    expiration {
      days = 31
    }
  }
}

# IAMポリシー（アプリケーションからS3へのアップロード用）
resource "aws_iam_policy" "s3_upload_policy" {
  name        = "${var.environment}-zaoral-s3-upload-policy"
  description = "Policy for uploading pictures to S3 bucket"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.project_pictures.arn}/*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket"
        ]
        Resource = aws_s3_bucket.project_pictures.arn
      }
    ]
  })
}

