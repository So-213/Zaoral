import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AccountClient from "@/components/AccountClient";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">ログインが必要です</h1>
          <a 
            href="/auth/signin"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            ログイン
          </a>
        </div>
      </div>
    );
  }

  // ユーザー情報を取得（プラン情報を含む）
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const userPlan = (user as any)?.plan ?? 'FREE';

  return <AccountClient session={session} userPlan={userPlan} />;
}
