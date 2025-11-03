# 詳細設計書

## 2. 画面/フロー

- `/` → ホーム（Hero、ナビゲーション）
- `/auth/signin` → Google/LINEログイン開始
- `/dashboard` → 新規作成ボタン・プロジェクト一覧・詳細表示・URLコピー機能
- `/create` → 入力→作成→URL表示
- `/p/:slug` → 公開ページ（プロジェクト表示）
- `/zaoral` → サービス説明ページ
- `/account` → アカウント設定ページ

## 3. API（MVP）

### 認証
- `GET/POST /api/auth/[...nextauth]` → NextAuth認証ハンドラ

### プロジェクト管理
- `POST /api/projects` 
  - リクエスト: `{ slug: string, message: string }`
  - レスポンス: `{ id, slug, user_id, user_name, type: 'message', created_at, expires_at, published, projectMessage: { message } }`
  - 機能: プロジェクト作成（自動で31日後の有効期限設定、publishedはfalseで作成）
  
- `GET /api/projects`
  - レスポンス: `{ projects: [{ id, slug, created_at, expires_at, published, projectMessage: { message }, ... }] }`
  - 機能: 自分のプロジェクト一覧取得（有効期限が切れていないもののみ、作成日時降順）
  
- `DELETE /api/projects?id=:id`
  - 機能: プロジェクト削除（認証必須、所有者のみ）
  
### 公開機能（未実装）
- `PATCH /api/projects/:id/publish` 
  - リクエスト: `{ published: boolean }`
  - 機能: プロジェクトの公開/非公開切り替え（認証必須、所有者のみ）
  
- `GET /api/public/:slug`
  - レスポンス: `{ id, slug, published, projectMessage: { message }, ... }`
  - 機能: 公開プロジェクト取得（published=true かつ有効期限内のみ、開封ログ記録は任意）

