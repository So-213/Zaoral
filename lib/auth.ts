import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getServerSession } from "next-auth";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export const auth = () => getServerSession(authOptions); // ← 追加
