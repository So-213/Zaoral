"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";





export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const login = async () => {
      try {
        const response = await fetch("/api/login", {
          method: "GET",
          credentials: "include", // クッキーを含める（セッション管理用）
        });

        if (response.ok) {
          // バックエンドからのリダイレクトURLを取得
          const data = await response.json();
          window.location.href = data.redirectUrl; // Cognito の認証ページへ遷移
        } else {
          console.error("Login request failed");
        }
      } catch (error) {
        console.error("Error during login:", error);
      }
    };

    login();
  }, []);

  return <p>ログイン処理中...</p>;
}
