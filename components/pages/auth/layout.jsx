"use client";
import logo from "@/public/logo-dark.png";
import logoLight from "@/public/logo-light.png";
import Image from "next/image";
import useDarkMode from "@/providers/dark-mode-checker";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthLayout({ children }) {
  const { data: session } = useSession();
  const isDarkMode = useDarkMode();
  return (
    <div className="flex md:p-2 items-center justify-center flex-col">
      <div className="logo flex items-center justify-center mt-12">
        <Image
          src={isDarkMode ? logo : logoLight}
          alt="devsplug logo"
          className="object-contain  "
        />
      </div>
      {session ? (
        <div className="flex items-center justify-center">
          <div className="w-full max-w-sm flex  items-center justify-center gap-4 flex-col p-3">
            <p className="text-center">
              You are already connected and cannot access this page
            </p>
            <p>click here to go back!!</p>
            <Button>
              <Link href="/">Go back to website</Link>
            </Button>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
