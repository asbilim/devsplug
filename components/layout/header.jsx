"use client";
import Link from "next/link";
import { ThemeToggle } from "../buttons/toggle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useDarkMode from "@/providers/dark-mode-checker";
import logo from "@/public/logo-dark.png";
import logoLight from "@/public/logo-light.png";
import Image from "next/image";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const isDarkMode = useDarkMode();
  return (
    <div className="header flex px-12 items-center py-4 border-b gap-4">
      <div className="items-container flex items-center justify-start gap-4 w-full ">
        <Image
          src={isDarkMode ? logo : logoLight}
          alt="devsplug logo"
          className="md:w-44 w-22"
        />
      </div>
      <div className="items-container flex items-center justify-end gap-8 w-full ">
        <Link href="/" className="underline">
          Leaderboard
        </Link>
        <Link href="/" className="underline">
          Learning
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src="https://cdn.pixabay.com/photo/2022/02/14/02/52/monkey-7012380_960_720.png"
                alt="@l@sd3p1k"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">
                <Link href="/">Profile</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <Link href="/">Settings</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="right">
                <Link href="/">Logout</Link>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
    </div>
  );
}
