"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">ログイン</h1>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
      >
        Googleでログイン
      </button>
    </div>
  );
}

