import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import GitLabProvider from "next-auth/providers/gitlab";
import type { DefaultSession, NextAuthOptions, User } from "next-auth";

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
          scope: "read:user user:email",
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
          scope: "openid email profile",
        },
      },
    }),
    GitLabProvider({
      clientId: process.env.GITLAB_ID ?? "",
      clientSecret: process.env.GITLAB_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          scope: "read_user",
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
          const tokenUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/token/`;
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
          // Fetch user data
          const userUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/users/me/`;
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
          return {
            ...user,
            backendTokens: {
              accessToken: tokens.access,
              refreshToken: tokens.refresh,
            },
          } as ExtendedUser;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/en/auth/login",
    newUser: "/en/auth/register",
    error: "/en/auth/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only process social logins (non-credentials)
      if (account?.provider !== "credentials") {
        try {
          // Build social login data based on provider
          const socialData = {
            access_token: account?.access_token,
            id_token: account?.id_token,
            email: user.email,
            name: user.name,
            ...(account?.provider === "github" && { username: profile?.login }),
            ...(account?.provider === "google" && {
              first_name: profile?.given_name,
              last_name: profile?.family_name,
            }),
            ...(account?.provider === "gitlab" && {
              username: profile?.username,
            }),
          };

          // Use provider-specific endpoints
          const endpoint = `/users/auth/${account?.provider}/`;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(socialData),
            }
          );

          if (!response.ok) {
            console.error("Social login failed:", response.statusText);
            return false;
          }

          const tokens = await response.json();
          // Add backend tokens to the user object
          user.backendTokens = {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
          };

          // Fetch additional user data
          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/users/me/`,
            {
              headers: {
                Authorization: `Bearer ${tokens.access_token}`,
              },
            }
          );

          if (!userResponse.ok) {
            console.error("User data fetch failed:", userResponse.statusText);
            return false;
          }

          const userData = await userResponse.json();
          Object.assign(user, userData);
        } catch (error) {
          console.error("Social auth error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        return {
          ...token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            profile: user.profile,
            score: user.score,
            title: user.title,
            motivation: user.motivation,
            followers_count: user.followers_count,
            following_count: user.following_count,
          },
          backendTokens: user.backendTokens,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = { ...session.user, ...token.user };
      }
      if (token.backendTokens) {
        session.backendTokens = token.backendTokens;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
