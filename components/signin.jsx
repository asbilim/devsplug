"use client";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, update } = useSession();

  return (
    <>
      {session ? (
        <>
          <p>
            welcome {session.user.username} | {session.user.title} |{" "}
            {session.user.score}
          </p>
          <Button className="underline" onClick={() => signOut()}>
            SIGN OUT
          </Button>
        </>
      ) : (
        <>
          <Button className="underline" onClick={() => signIn("credentials")}>
            SIGN IN
          </Button>
        </>
      )}
    </>
  );
}
