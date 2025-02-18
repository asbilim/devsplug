import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import GitLab from "next-auth/providers/gitlab";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth";

// Extend the User type to include backendTokens
interface ExtendedUser extends User {
  backendTokens?: {
    accessToken: string;
    refreshToken: string;
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      profile?: string | null;
      score?: number;
      title?: string;
      motivation?: string;
      followers_count?: number;
      following_count?: number;
    } & DefaultSession["user"];
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendTokens?: {
      accessToken: string;
      refreshToken: string;
    };
    user?: {
      id?: string;
      username?: string;
      email?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      profile?: string | null;
      score?: number;
      title?: string;
      motivation?: string;
      followers_count?: number;
      following_count?: number;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    GitLab({
      clientId: process.env.GITLAB_ID ?? "",
      clientSecret: process.env.GITLAB_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) return null;

          const tokens = await response.json();

          // Fetch user data
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );

          if (!userResponse.ok) return null;

          const user = await userResponse.json();

          return {
            ...user,
            backendTokens: {
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
            },
          } as ExtendedUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.type === "credentials") {
          const extendedUser = user as ExtendedUser;
          token.backendTokens = extendedUser.backendTokens;
          token.user = user;
          return token;
        }

        // Handle OAuth providers
        try {
          const backendResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${account.provider}/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: account.access_token,
                code:
                  account.provider === "google" ? account.id_token : undefined,
              }),
            }
          );

          if (!backendResponse.ok) {
            throw new Error("Failed to authenticate with backend");
          }

          const data = await backendResponse.json();
          token.backendTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
          token.user = data.user;
        } catch (error) {
          console.error("OAuth error:", error);
          return token;
        }
      }

      // Check token expiration and refresh if needed
      if (token.backendTokens) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/refresh/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refresh: token.backendTokens.refreshToken,
              }),
            }
          );

          const data = await response.json();

          if (!response.ok) throw data;

          token.backendTokens.accessToken = data.access;
        } catch (error) {
          console.error("Error refreshing access token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.backendTokens) {
        session.backendTokens = token.backendTokens;
      }
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
  },
};

export const auth = () => getServerSession(authOptions);
