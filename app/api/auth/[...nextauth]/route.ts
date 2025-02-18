import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import GitLabProvider from "next-auth/providers/gitlab";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";
import { getServerSession } from "next-auth/next";

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
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID ?? "",
      clientSecret: process.env.GITLAB_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
        },
      },
    }),
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error("Auth error: Missing credentials");
          return null;
        }

        try {
          const tokenUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/token/`;
          console.log("Attempting token fetch from:", tokenUrl);

          const response = await fetch(tokenUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error("Token fetch failed:", {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
            });
            return null;
          }

          const tokens = await response.json();
          console.log("Token fetch successful");

          // Fetch user data
          const userUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me/`;
          console.log("Attempting user data fetch from:", userUrl);

          const userResponse = await fetch(userUrl, {
            headers: {
              Authorization: `Bearer ${tokens.access}`,
            },
          });

          if (!userResponse.ok) {
            const errorData = await userResponse.text();
            console.error("User data fetch failed:", {
              status: userResponse.status,
              statusText: userResponse.statusText,
              error: errorData,
            });
            return null;
          }

          const user = await userResponse.json();
          console.log("User data fetch successful");

          return {
            ...user,
            backendTokens: {
              accessToken: tokens.access,
              refreshToken: tokens.refresh,
            },
          } as ExtendedUser;
        } catch (error) {
          console.error("Auth error:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
          });
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", {
        hasToken: !!token,
        hasUser: !!user,
        hasAccount: !!account,
        accountDetails: account,
        userDetails: user,
      });

      if (account && user) {
        token.backendTokens = (user as ExtendedUser).backendTokens;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback:", {
        hasSession: !!session,
        hasToken: !!token,
        tokenDetails: token,
      });

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
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback:", {
        provider: account?.provider,
        hasUser: !!user,
        hasProfile: !!profile,
        profileDetails: profile,
      });

      return true;
    },
  },
  logger: {
    error(code, metadata) {
      console.error("Auth error occurred:", {
        code,
        metadata,
        timestamp: new Date().toISOString(),
      });
    },
    warn(code) {
      console.warn("Auth warning:", {
        code,
        timestamp: new Date().toISOString(),
      });
    },
    debug(code, metadata) {
      console.log("Auth debug:", {
        code,
        metadata,
        timestamp: new Date().toISOString(),
      });
    },
  },
  session: {
    strategy: "jwt",
  },
};

// Replace these lines at the bottom of the file:
// export const auth = () => getServerSession(authOptions);
// export const { GET, POST } = NextAuth(authOptions);

// With this:
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
