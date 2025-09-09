# Zaoral - フロントエンド

Zaoralは、メッセージを確実に読んでもらうためのWebアプリケーションです。ユーザーはメッセージを作成し、公開することで、受信者に確実にメッセージを届けることができます。


## 🚀 機能

- **ユーザー認証**: Google OAuthによる安全なログイン
- **メッセージ作成**: 簡単なメッセージ作成と公開機能
- **ダッシュボード**: 作成したプロジェクトの管理
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **ダークモード対応**: テーマ切り替え機能

## 技術スタック

### フロントエンド
- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **Radix UI** - アクセシブルなUIコンポーネント
- **NextAuth.js** - 認証システム
- **React Hook Form** - フォーム管理
- **Zod** - スキーマバリデーション

### バックエンド・データベース
- **Prisma** - ORM
- **PostgreSQL** - データベース
- **NextAuth.js** - 認証プロバイダー

## 📋 前提条件

- Node.js 18以上
- npm または yarn
- PostgreSQL データベース
- Google OAuth クライアントID（認証用）






## 🗄️ データベーススキーマ

### 主要なテーブル

- **User**: ユーザー情報
- **Project**: プロジェクト（メッセージ）の基本情報
- **ProjectMessage**: メッセージの詳細内容
- **Account**: OAuth認証情報
- **Session**: セッション管理
- **Subscription**: サブスクリプション情報

## 🔐 認証

Google OAuthを使用した認証システムを実装しています。ユーザーはGoogleアカウントでログインし、安全にアプリケーションを利用できます。

## 🎨 UI/UX

- **モダンなデザイン**: グラデーションとアニメーションを活用
- **レスポンシブ**: モバイルファーストデザイン
- **アクセシビリティ**: Radix UIによるアクセシブルなコンポーネント
- **ダークモード**: テーマ切り替え機能




## 🚀 デプロイ

### Vercel（推奨）
```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel
```

### その他のプラットフォーム
- Netlify
- AWS Amplify
- Railway

## 🔗 バックエンド連携

このフロントエンドは、別途用意されたバックエンドサーバーと連携します。詳細は `README_BACKEND_SETUP.md` を参照してください。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成
