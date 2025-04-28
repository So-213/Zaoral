// lib/auth.ts


import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import LINE from "next-auth/providers/line"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
    // adapter: PrismaAdapter(prisma), //認証時のDB保存　//providerが違ってもidが一意になるようにする
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
        clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
      LINE({
        clientId: process.env.AUTH_LINE_CLIENT_ID,
        clientSecret: process.env.AUTH_LINE_CLIENT_SECRET,
        issuer: 'https://access.line.me',
        checks: ['pkce', 'state'],
        allowDangerousEmailAccountLinking: true,
      }),
    ],
    session: { strategy: "jwt" },// jwtから情報を取得してくるようにする設定
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
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
    }
  })
  




