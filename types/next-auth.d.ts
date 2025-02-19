import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      accessToken?: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    accessToken?: string;
  }
}
