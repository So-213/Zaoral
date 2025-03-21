"use client";

import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>ログインしてください</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>こんにちは, {session.user?.name} さん</p>
    </div>
  );
}
