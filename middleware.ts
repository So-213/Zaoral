// middleware.ts

import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";




export async function middleware(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            console.log('No valid session found, redirecting to home');
            return NextResponse.redirect(new URL("/", req.url));
        }

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
