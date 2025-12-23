import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";
import { DEFAULT_LEFT_PROJECTS, generateProjectUrl } from "@/lib/config";
import { getS3PublicUrl } from "@/lib/s3";

interface Project {
  id: string;
  created_at: string;
  expires_at: string;
  user_id: string;
  slug: string;
  type: string;
  name?: string | null;
  url: string; // プロジェクトのURL（messageの場合はgenerateProjectUrl、pictureの場合はS3のURL）
  projectMessage?: {
    message: string;
  };
  projectPicture?: {
    s3_key: string;
  };
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
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

  // ユーザー情報を取得（project_limitを含む）
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // プロジェクトデータをサーバー側で取得
  const rawProjects = await prisma.project.findMany({
    where: {
      user_id: session.user.id,
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
}
