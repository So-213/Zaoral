// lib/auth.ts

import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma), //認証時のDB保存　//providerが違ってもidが一意になるようにする
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    LINE({
      clientId: process.env.AUTH_LINE_ID,
      clientSecret: process.env.AUTH_LINE_SECRET,
      issuer: 'https://access.line.me',
      checks: ['pkce', 'state'],
      allowDangerousEmailAccountLinking: true,
    }),
    // テストユーザープロバイダー
    {
      id: "test",
      name: "テストユーザー",
      type: "credentials",
      credentials: {},
      async authorize() {
        // 固定のテストユーザーを返す
        return {
          id: "test_user_001",
          name: "テストユーザ",
          email: "test@example.com",
          image: null,
        };
      }
    }
  ],
  session: { strategy: "jwt" },// jwtから情報を取得してくるようにする設定
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // 開発環境でのデバッグを有効化
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {//userはプロバイダーから取得したユーザー情報
      if (user) {
        token.userId = user.id;// User.idとJWTを紐付けるために、userIdをJWTの方に渡す
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  },
  experimental: {
    enableWebAuthn: false,
  },
  pages: {
    signIn: '/',
    error: '/auth/error',
  }
})




