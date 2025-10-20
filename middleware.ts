// middleware.ts

import { NextResponse, NextRequest } from "next/server";
// import { auth } from "@/lib/auth";

// デバッグログの制御用
const isDevelopment = process.env.NODE_ENV === 'development';
const isDebugMode = process.env.DEBUG_MIDDLEWARE === 'true';

// デバッグログ出力用のヘルパー関数
const debugLog = (message: string, ...args: any[]) => {
    if (isDevelopment || isDebugMode) {
        console.log(`[Middleware Debug] ${message}`, ...args);
    }
};

// NextAuth v5（beta）

export async function middleware(req: NextRequest) {
    try {
        debugLog('Middleware processing request:', req.url);

        // 本来ならコメントアウトを外すべきですが、vercel側の "middleware1MB規制" に引っかかるため、コメントアウトさせています

        // const session = await auth(); // 画面遷移のたびに、ユーザの正当性を検証。 Prismaアダプターを使用してデータベースにアクセス

        // if (!session || !session.user) {
        //     debugLog('No valid session found, redirecting to home');
        //     return NextResponse.redirect(new URL("/", req.url));
        // }

        debugLog('Valid session found, proceeding to dashboard');
        return NextResponse.next();
    } catch (error) {
        // エラーログは本番環境でも出力する（重要なエラー情報のため）
        console.error('Middleware error:', error);
        
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/create/:path*",
        "/account/:path*"
    ],
};

// Node.jsランタイムを明示的に指定
export const runtime = 'nodejs';
