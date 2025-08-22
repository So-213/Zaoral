import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const session = await auth();

    if (!session) {
        // ログインしていない場合は `/login` にリダイレクト
        return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: "/dashboard/:path*",
};

// Edge Runtimeの設定を追加
export const runtime = 'nodejs'
