import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/create/:path*", "/account/:path*"]
};

export const runtime = 'edge';
