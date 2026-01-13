import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";
import { DEFAULT_LEFT_PROJECTS, generateProjectUrl } from "@/lib/config";
import { getS3PublicUrl } from "@/lib/s3";
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

export default async function DashboardPage() {
  try {
    const { session, userId } = await requireAuth();

    // ユーザー情報を取得（project_limitを含む）
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // プロジェクトデータをサーバー側で取得
    const rawProjects = await prisma.project.findMany({
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
  });

  // プロジェクトタイプに応じてURLを生成
  const userProjects: Project[] = rawProjects.map((project) => {
    let url: string;
    if (project.type === 'picture' && project.projectPicture?.s3_key) {
      url = getS3PublicUrl(project.projectPicture.s3_key);
    } else {
      url = generateProjectUrl(project.slug);
    }
    
    return {
      ...project,
      url,
    };
  });

    // 統計情報を計算（残機を取得）
    const leftProjects = (user as any)?.left_projects ?? DEFAULT_LEFT_PROJECTS;
    const userPlan = (user as any)?.plan ?? 'FREE';

    return (
      <DashboardClient 
        session={session}
        userProjects={userProjects}
        leftProjects={leftProjects}
        userPlan={userPlan}
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
