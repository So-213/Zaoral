import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";
import { DEFAULT_LEFT_PROJECTS } from "@/lib/config";
import { generateProjectUrlByType } from "@/lib/dashboard-config";
import { requireAuth } from "@/lib/api-helpers";

interface Project {
  id: string;
  created_at: Date;
  expires_at: Date;
  user_id: string;
  slug: string;
  type: string;
  name?: string | null;
  url: string; // プロジェクトのURL（messageの場合はgenerateProjectUrl、pictureの場合はS3のURL）
  projectMessage?: {
    message: string;
  } | null;
  projectPicture?: {
    s3_key: string;
  } | null;
}

interface UserInfo {
  id: string;
  name: string | null;
  email: string | null;
  left_projects: number;
  plan: string;
}

export default async function DashboardPage() {
  try {
    const { userId } = await requireAuth();

    // ユーザー情報とプロジェクトデータを並列で取得
    const [user, rawProjects] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          left_projects: true,
          plan: true,
        },
      }),
      prisma.project.findMany({
        where: {
          user_id: userId,
        },
        include: {
          projectMessage: true,
          projectPicture: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
    ]);

    if (!user) {
      throw new Error('ユーザーが見つかりません');
    }

  // プロジェクトタイプに応じてURLを生成（設定ベースのアプローチ）
  const userProjects: Project[] = rawProjects.map((project) => {
    const url = generateProjectUrlByType(project);
    
    return {
      ...project,
      url,
    };
  });

    // ユーザー情報を整理
    const userInfo: UserInfo = {
      id: user.id,
      name: user.name,
      email: user.email,
      left_projects: user.left_projects ?? DEFAULT_LEFT_PROJECTS,
      plan: user.plan ?? 'FREE',
    };

    return (
      <DashboardClient 
        user={userInfo}
        userProjects={userProjects}
      />
    );
  } catch (error) {
    // 認証エラーの場合はログインページを表示
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h1>
          <Link 
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ログイン
          </Link>
        </div>
      </div>
    );
  }
}
