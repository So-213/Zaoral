export const authConfig = {
    providers: [
      {
        id: "google",
        name: "Google",
        type: "oauth",
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          url: "https://accounts.google.com/o/oauth2/auth",
          params: {
            scope: "openid email profile",
            prompt: "select_account",
          },
        },
      },
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, user }: any) {
        return session;
      },
    },
  };
  