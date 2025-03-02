import { NextResponse } from "next/server";

export async function GET() {
  try {
    const backendUrl = "https://zrl213.com/login";

    // バックエンドにリクエストを送る
    const response = await fetch(backendUrl, {
      method: "GET",
      credentials: "include",// クッキーを含める
    });

    if (!response.ok) {
      console.error("🛑 バックエンドの /login がエラー", await response.text());
      return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }

    // バックエンドがリダイレクトするURLを取得      //cognito認証ページはバックエンドしかわからないのでそれをfetchしてくる
    // const data = response.url;
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Next.js /api/login のエラー:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

