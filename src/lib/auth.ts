import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

interface ExtendedToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

interface ExtendedSession extends Session {
  accessToken?: string;
}

interface AccountInfo {
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      account,
    }: {
      token: ExtendedToken;
      account: AccountInfo | null;
    }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: ExtendedToken;
    }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
