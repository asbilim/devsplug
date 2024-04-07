"use client";
import logo from "@/public/logo-dark.png";
import logoLight from "@/public/logo-light.png";
import Image from "next/image";
import useDarkMode from "@/providers/dark-mode-checker";
import { useSession } from "next-auth/react";


export default function NotFoundLayout({ children }) {
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
      {children}
    </div>
  );
}
