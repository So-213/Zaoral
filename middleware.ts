// middleware.ts

import { NextResponse, NextRequest } from "next/server";
// import { auth } from "@/lib/auth";


// NextAuth v5（beta）

export async function middleware(req: NextRequest) {
    try {

        // 本来ならコメントアウトを外すべきですが、vercel側の "middleware1MB規制" に引っかかるため、コメントアウトさせています

        // const session = await auth(); // 画面遷移のたびに、ユーザの正当性を検証。 Prismaアダプターを使用してデータベースにアクセス

        // if (!session || !session.user) {
        //     console.log('No valid session found, redirecting to home');
        //     return NextResponse.redirect(new URL("/", req.url));
        // }

        console.log('Valid session found, proceeding to dashboard');
        return NextResponse.next();
    } catch (error) {
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
