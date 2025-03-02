import { NextResponse } from "next/server";




export async function GET() {
  try {
    const backendUrl = "https://zrl213.com/login";

    // バックエンドにリクエストを送る
    const response = await fetch(backendUrl, {
      method: "GET",
      credentials: "include", // クッキーを含める
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }

    // バックエンドがリダイレクトするURLを取得      //cognito認証ページはバックエンドしかわからないのでそれをfetchしてくる
    const redirectUrl = response.url;

    return NextResponse.json({ redirectUrl });
    
  } catch (error) {
    console.error("Error in /api/login:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
