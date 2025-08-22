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
    },
    async signIn({ user, account, profile }) {
      // サインイン時のログ出力
      console.log('Sign in attempt:', { 
        user: user?.email, 
        provider: account?.provider,
        profile: profile?.email 
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      // リダイレクト時のログ出力
      console.log('Redirect:', { url, baseUrl });
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  // Edge Runtime互換性のための設定
  experimental: {
    enableWebAuthn: false,
  },
  // エラーページの設定
  pages: {
    signIn: '/',
    error: '/auth/error',
  }
})












