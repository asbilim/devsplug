import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github"; // Ensure the import is correct
import CredentialsProvider from "next-auth/providers/credentials";

const auth = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_TOKEN_OBTAIN_PATH}`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If the user object exists, it means the login was successful
      if (user) {
        token.accessToken = user.access;
        token.refreshToken = user.refresh;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the JWT and any other user details you want to the session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      //get user datas

      const userDataPath = process.env.NEXT_PUBLIC_USER_PATH;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${userDataPath}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );
      const user = await res.json();

      session.user = {};
      session.user.id = user[0].id;
      session.user.username = user[0].username;
      session.user.profile = user[0].profile;
      session.user.title = user[0].title;
      session.user.score = user[0].score;
      session.user.motivation = user[0].motivation;
      session.user.problems = user[0].problems;

      return session;
    },
  },
});

export { auth as GET, auth as POST };
