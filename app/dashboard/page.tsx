import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>認証が必要です</p>;
  }

  return <p>ようこそ、{session.user?.name} さん！</p>;
}
