# Terraform設定 - Zaoral S3 Infrastructure

このディレクトリには、ZaoralプロジェクトのS3バケットを管理するTerraform設定が含まれています。

## セットアップ

### 1. AWS認証情報の設定

AWS CLIがインストールされ、認証情報が設定されていることを確認してください：

```bash
aws configure
```

または、環境変数で設定：

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=ap-northeast-1
```

### 2. 変数ファイルの作成

`terraform.tfvars.example`をコピーして`terraform.tfvars`を作成し、値を設定してください：

```bash
cp terraform.tfvars.example terraform.tfvars
```

`terraform.tfvars`ファイルを編集して、適切な値を設定してください。

**注意**: `terraform.tfvars`は`.gitignore`に含まれているため、機密情報を含めても安全です。

### 3. Terraformの初期化

```bash
cd terraform
terraform init
```

### 4. 実行計画の確認

```bash
terraform plan
```

### 5. リソースの作成

```bash
terraform apply
```

確認プロンプトで`yes`と入力すると、リソースが作成されます。

## リソース

このTerraform設定は以下のリソースを作成します：

- **S3バケット**: プロジェクト画像のアップロード用
- **S3バケットバージョニング**: 有効化
- **S3バケットパブリックアクセスブロック**: セキュリティのため有効化
- **S3バケットCORS設定**: フロントエンドからのアクセス許可
- **S3バケットライフサイクル設定**: 31日後に自動削除
- **IAMポリシー**: S3へのアップロード用

## 出力値

`terraform apply`実行後、以下の出力値が表示されます：

- `s3_bucket_name`: S3バケット名
- `s3_bucket_arn`: S3バケットのARN
- `s3_bucket_domain_name`: S3バケットのドメイン名
- `iam_policy_arn`: IAMポリシーのARN

これらの値は、アプリケーションの環境変数に設定する必要があります。

## リソースの削除

```bash
terraform destroy
```

## 注意事項

- S3バケット名はグローバルで一意である必要があります
- 本番環境では、`allowed_origins`を適切なドメインに制限してください
- IAMポリシーは、アプリケーションが使用するIAMユーザーまたはロールにアタッチする必要があります

