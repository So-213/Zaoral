# EC2バックエンドサーバー設定ガイド

## 概要
このフロントエンドアプリケーションは、文字列入力とランダム文字列をEC2バックエンドサーバーに送信する機能を提供します。

## バックエンドサーバーの要件

### 1. エンドポイント
```
POST /api/data
```

### 2. リクエスト形式
```json
{
  "inputText": "ユーザーが入力した文字列",
  "randomString": "生成された6文字のランダム文字列",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. レスポンス形式
```json
{
  "success": true,
  "message": "データが正常に受信されました",
  "receivedData": {
    "inputText": "ユーザーが入力した文字列",
    "randomString": "生成された6文字のランダム文字列",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

## 設定手順

### 1. フロントエンドの設定変更
`frontend/app/create/page.tsx` の以下の行を実際のEC2インスタンスのURLに変更してください：

```typescript
// 現在の設定
const response = await fetch('http://your-ec2-instance.com/api/data', {

// 実際のEC2インスタンスのURLに変更
const response = await fetch('http://your-ec2-public-ip:3000/api/data', {
```

### 2. CORS設定
バックエンドサーバーでCORSを有効にする必要があります：

```javascript
// Express.js の例
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // フロントエンドのURL
  credentials: true
}));
```

### 3. セキュリティ設定
- EC2セキュリティグループでポート3000（または使用するポート）を開放
- HTTPSを使用する場合は適切なSSL証明書を設定

## バックエンドサーバー実装例（Node.js/Express）

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/data', (req, res) => {
  try {
    const { inputText, randomString, timestamp } = req.body;
    
    // データの検証
    if (!inputText || !randomString) {
      return res.status(400).json({
        success: false,
        message: '必須フィールドが不足しています'
      });
    }
    
    // データの処理（データベース保存など）
    console.log('受信したデータ:', { inputText, randomString, timestamp });
    
    // レスポンス
    res.json({
      success: true,
      message: 'データが正常に受信されました',
      receivedData: { inputText, randomString, timestamp }
    });
    
  } catch (error) {
    console.error('エラー:', error);
    res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
});
```

## トラブルシューティング

### よくある問題

1. **CORSエラー**
   - バックエンドでCORS設定を確認
   - フロントエンドのURLが許可されているか確認

2. **接続エラー**
   - EC2インスタンスのパブリックIPアドレスを確認
   - セキュリティグループの設定を確認
   - バックエンドサーバーが起動しているか確認

3. **タイムアウトエラー**
   - ネットワーク接続を確認
   - ファイアウォール設定を確認

## 開発環境でのテスト

ローカル開発時は、以下のURLを使用してください：
```typescript
const response = await fetch('http://localhost:3001/api/data', {
```

バックエンドサーバーを別のポート（例：3001）で起動し、フロントエンド（3000）からアクセスします。 