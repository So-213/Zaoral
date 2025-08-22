import { auth } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    try {
        const session = await auth();

        if (!session) {
            // ログインしていない場合はホームページにリダイレクト
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.error('Middleware error:', error);
        // エラーが発生した場合はホームページにリダイレクト
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: "/dashboard/:path*",
};

// Edge Runtimeの設定を追加
export const runtime = 'nodejs'
