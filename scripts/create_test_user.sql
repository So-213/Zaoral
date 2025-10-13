-- テストユーザー作成スクリプト
-- このスクリプトを実行してテストユーザーをデータベースに作成してください

-- テストユーザーを作成
INSERT INTO "User" (id, name, email, "created_at", "updated_at") 
VALUES ('test_user_001', 'テストユーザー', 'test@example.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 作成されたユーザーを確認
SELECT id, name, email, "created_at" FROM "User" WHERE id = 'test_user_001';
