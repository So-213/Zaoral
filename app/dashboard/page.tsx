import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

 return <p>ようこそ、{session!.user?.name} さん！</p>;

}
