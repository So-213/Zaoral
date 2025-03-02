"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState<{ email: string; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ユーザー情報を取得
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("https://zrl213.com/userinfo", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data);
        } else {
          router.push("/login"); // 未ログインならログインページへ
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        router.push("/login");
      }
    };

    fetchUserInfo();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
        {userInfo ? (
          <div>
            <p>ログイン中: <strong>{userInfo.email}</strong></p>
            {userInfo.name && <p>ユーザー名: {userInfo.name}</p>}
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={async () => {
                await fetch("https://zrl213.com/logout", { method: "POST", credentials: "include" });
                router.push("/login");
              }}
            >
              ログアウト
            </button>
          </div>
        ) : (
          <p>読み込み中...</p>
        )}
      </div>
    </main>
  );
}
