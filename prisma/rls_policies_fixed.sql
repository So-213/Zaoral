-- 修正版RLS設定ファイル（Prismaスキーマのカラム名に合わせて修正）

-- 1. 関数の作成（ユーザーIDを取得するため）
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS text AS $$
BEGIN
  RETURN current_setting('app.current_user_id', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. UserテーブルにRLSを適用
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分の情報のみ読み取り可能
CREATE POLICY "Users can read their own data"
  ON "User"
  FOR SELECT
  USING (id = get_user_id()::text);

-- ユーザーが自分の情報のみ更新可能
CREATE POLICY "Users can update their own data"
  ON "User"
  FOR UPDATE
  USING (id = get_user_id()::text);

-- ユーザーが自分の情報のみ挿入可能
CREATE POLICY "Users can insert their own data"
  ON "User"
  FOR INSERT
  WITH CHECK (id = get_user_id()::text);

-- 3. AccountテーブルにRLSを適用（userIdカラムを使用）
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分のアカウント情報のみ読み取り可能
CREATE POLICY "Users can read their own accounts"
  ON "Account"
  FOR SELECT
  USING ("userId" = get_user_id()::text);

-- ユーザーが自分のアカウント情報のみ更新可能
CREATE POLICY "Users can update their own accounts"
  ON "Account"
  FOR UPDATE
  USING ("userId" = get_user_id()::text);

-- ユーザーが自分のアカウント情報のみ挿入可能
CREATE POLICY "Users can insert their own accounts"
  ON "Account"
  FOR INSERT
  WITH CHECK ("userId" = get_user_id()::text);

-- 4. SessionテーブルにRLSを適用（userIdカラムを使用）
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;

-- ユーザーが自分のセッション情報のみ読み取り可能
CREATE POLICY "Users can read their own sessions"
  ON "Session"
  FOR SELECT
  USING ("userId" = get_user_id()::text);

-- ユーザーが自分のセッション情報のみ更新可能
CREATE POLICY "Users can update their own sessions"
  ON "Session"
  FOR UPDATE
  USING ("userId" = get_user_id()::text);

-- ユーザーが自分のセッション情報のみ挿入可能
CREATE POLICY "Users can insert their own sessions"
  ON "Session"
  FOR INSERT
  WITH CHECK ("userId" = get_user_id()::text);

-- 5. VerificationTokenテーブルにRLSを適用
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;

-- 認証トークンは認証システムのみアクセス可能
CREATE POLICY "Auth system can access verification tokens"
  ON "VerificationToken"
  FOR ALL
  USING (true);

-- 6. SubscriptionテーブルにRLSを適用（user_idカラムを使用）
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Users can read their own subscriptions" ON "Subscription";
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON "Subscription";
DROP POLICY IF EXISTS "Users can insert their own subscriptions" ON "Subscription";

-- ユーザーが自分のサブスクリプションのみ読み取り可能
CREATE POLICY "Users can read their own subscriptions"
  ON "Subscription"
  FOR SELECT
  USING (user_id = get_user_id()::text);

-- ユーザーが自分のサブスクリプションのみ更新可能
CREATE POLICY "Users can update their own subscriptions"
  ON "Subscription"
  FOR UPDATE
  USING (user_id = get_user_id()::text);

-- ユーザーが自分のサブスクリプションのみ挿入可能
CREATE POLICY "Users can insert their own subscriptions"
  ON "Subscription"
  FOR INSERT
  WITH CHECK (user_id = get_user_id()::text);

-- 7. SubscriptionTrashテーブルにRLSを適用（user_idカラムを使用）
ALTER TABLE "SubscriptionTrash" ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Users can read their own subscription trash" ON "SubscriptionTrash";

-- ユーザーが自分の削除されたサブスクリプションのみ読み取り可能
CREATE POLICY "Users can read their own subscription trash"
  ON "SubscriptionTrash"
  FOR SELECT
  USING (user_id = get_user_id()::text);

-- ユーザーが自分の削除されたサブスクリプションのみ挿入可能
CREATE POLICY "Users can insert their own subscription trash"
  ON "SubscriptionTrash"
  FOR INSERT
  WITH CHECK (user_id = get_user_id()::text);

-- 8. 管理者権限の設定（必要に応じて）
-- 管理者ユーザーIDの配列を設定
DO $$
BEGIN
  -- 管理者ユーザーIDを設定（実際の管理者IDに変更してください）
  PERFORM set_config('app.admin_user_ids', '["admin_user_id_1", "admin_user_id_2"]', false);
END $$;

-- 管理者用のポリシー（全テーブルに適用）
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN get_user_id() = ANY(string_to_array(current_setting('app.admin_user_ids', true), ','));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 管理者は全データにアクセス可能
CREATE POLICY "Admins have full access to users"
  ON "User"
  FOR ALL
  USING (is_admin());

CREATE POLICY "Admins have full access to accounts"
  ON "Account"
  FOR ALL
  USING (is_admin());

CREATE POLICY "Admins have full access to sessions"
  ON "Session"
  FOR ALL
  USING (is_admin());

CREATE POLICY "Admins have full access to subscriptions"
  ON "Subscription"
  FOR ALL
  USING (is_admin());

CREATE POLICY "Admins have full access to subscription trash"
  ON "SubscriptionTrash"
  FOR ALL
  USING (is_admin());

-- 9. インデックスの作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_user_id ON "User"(id);
CREATE INDEX IF NOT EXISTS idx_account_user_id ON "Account"("userId");
CREATE INDEX IF NOT EXISTS idx_session_user_id ON "Session"("userId");
CREATE INDEX IF NOT EXISTS idx_subscription_user_id ON "Subscription"(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_trash_user_id ON "SubscriptionTrash"(user_id);

-- 10. 監査ログテーブル（オプション）
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  user_id TEXT,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 監査ログ用のトリガー関数
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, get_user_id(), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, get_user_id(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (table_name, operation, user_id, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, get_user_id(), to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 監査ログトリガーの作成
CREATE TRIGGER audit_user_trigger
  AFTER INSERT OR UPDATE OR DELETE ON "User"
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_subscription_trigger
  AFTER INSERT OR UPDATE OR DELETE ON "Subscription"
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
