"use client";

import { signOut, useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">ホームページ</h1>
      {session ? (
        <>
          <p>ようこそ, {session.user?.name} さん</p>
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => signOut()}
          >
            ログアウト
          </button>
        </>
      ) : (
        <p>ログインしていません</p>
      )}
    </div>
  );
}
