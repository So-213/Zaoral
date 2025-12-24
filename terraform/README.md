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

### 2. 変数ファイルの選択

環境ごとに異なる変数ファイルが用意されています：

- `terraform.tfvars.dev` - 開発環境用
- `terraform.tfvars.prod` - 本番環境用
- `terraform.tfvars.example` - テンプレート（参考用）


### 3. Terraformの初期化

```bash
cd terraform
terraform init
```

### 4. 実行計画の確認

開発環境の場合：
```bash
terraform plan -var-file="terraform.tfvars.dev"
```

本番環境の場合：
```bash
terraform plan -var-file="terraform.tfvars.prod"
```

### 5. リソースの作成

開発環境の場合：
```bash
terraform apply -var-file="terraform.tfvars.dev"
```

本番環境の場合：
```bash
terraform apply -var-file="terraform.tfvars.prod"
```

確認プロンプトで`yes`と入力すると、リソースが作成されます。

## リソース

このTerraform設定は以下のリソースを作成します：

- **S3バケット**: プロジェクト画像のアップロード用
- **S3バケットバージョニング**: 有効化
- **S3バケットCORS設定**: フロントエンドからのアクセス許可
- **S3バケットライフサイクル設定**: 31日後に自動削除
- **IAMポリシー**: S3へのアップロード用

## 出力値

`terraform apply`実行後、以下の出力値が表示されます：

- `s3_bucket_name`: S3バケット名
- `s3_bucket_arn`: S3バケットのARN（リソース識別子）
- `s3_bucket_domain_name`: S3バケットのドメイン名
- `iam_policy_arn`: IAMポリシーのARN
- `runtime_user_name`: IAMユーザー名（例: `dev-zaoral-app-runtime`）
- `runtime_access_key_id`: アクセスキーID（アプリケーションの環境変数に設定）
- `runtime_secret_access_key`: シークレットアクセスキー（アプリケーションの環境変数に設定）

### 環境変数の設定

アプリケーションの環境変数（`.env.local` または `.env`）に以下を設定してください：

```bash
# Terraformの出力から取得した値を設定
AWS_ACCESS_KEY_ID=<runtime_access_key_id>
AWS_SECRET_ACCESS_KEY=<runtime_secret_access_key>
AWS_REGION=ap-northeast-1
S3_BUCKET_NAME=<s3_bucket_name>
```

これらの値は、アプリケーションの環境変数に設定する必要があります。

## リソースの削除

```bash
terraform destroy
```

## 注意事項

- S3バケット名はグローバルで一意である必要があります
- 本番環境では、`allowed_origins`を適切なドメインに制限してください
- IAMポリシーは、アプリケーションが使用するIAMユーザーまたはロールにアタッチする必要があります

