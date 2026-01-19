export interface Project {
  id: string;
  created_at: Date;
  expires_at: Date;
  user_id: string;
  slug: string;
  type: string;
  name?: string | null;
  url: string; // プロジェクトのURL（サーバーサイドで生成済み）
  projectMessage?: {
    message: string;
  } | null;
  projectPicture?: {
    s3_key: string;
  } | null;
}

export interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
  left_projects: number;
  plan: string;
}

export interface DashboardClientProps {
  user: UserInfo;
  userProjects: Project[];
}
