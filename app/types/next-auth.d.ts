import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      username?: string;
      email?: string | null;
      image?: string | null;
      title?: string;
      score?: number;
      bio?: string;
      followers_count?: number;
      following_count?: number;
    } & DefaultSession["user"];
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }

  interface User {
    id: string;
    username?: string;
    email?: string | null;
    image?: string | null;
    title?: string;
    score?: number;
    bio?: string;
    followers_count?: number;
    following_count?: number;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    email?: string | null;
    image?: string | null;
    title?: string;
    score?: number;
    bio?: string;
    followers_count?: number;
    following_count?: number;
    backendTokens: {
      accessToken: string;
      refreshToken: string;
    };
  }
}
