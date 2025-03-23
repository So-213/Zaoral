// app/api/auth/session/route.ts
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
   const session = await auth(); //session情報というよりJWTが正規なものか否かの判定を返しているだけ
  return NextResponse.json({ session });
}
