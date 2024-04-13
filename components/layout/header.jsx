"use client";
import Link from "next/link";
import { ThemeToggle } from "../buttons/toggle-theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useDarkMode from "@/providers/dark-mode-checker";
import logo from "@/public/logo-dark.png";
import logoLight from "@/public/logo-light.png";
import Image from "next/image";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const { data: session } = useSession();
  const [mode, setMode] = useState("dark");
  const isDarkMode = useDarkMode();

  useEffect(() => {
    setMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <div className="fixed py-3 md:px-12 px-4 border-b-[1px] top-0 z-40 w-full bg-white dark:border-b-slate-700 dark:bg-background flex items-center gap-4">
      <div className="items-container flex items-center justify-start gap-4 w-full ">
        <Image
          src={mode ? logo : logoLight}
          alt="devsplug logo"
          className="md:w-44 w-32"
        />
      </div>
      <div className="items-container md:flex items-center justify-end gap-4 lg:gap-8 w-full hidden text-sm lg:text-md">
        <Link href="/leaderboard" className="font-medium hover:text-[#8482ee]">
          Leaderboard
        </Link>
        <Link href="/challenges" className="font-medium hover:text-[#8482ee]">
          challenges
        </Link>
        <Link href="/community" className="font-medium hover:text-[#8482ee] ">
          community
        </Link>
        <Link href="/learn" className="font-medium hover:text-[#8482ee]">
          Learn
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={
                  session?.user?.profile ||
                  "https://cdn.pixabay.com/photo/2022/02/14/02/52/monkey-7012380_960_720.png"
                }
                alt={
                  session?.user?.username + " devsplug profile" ||
                  "devsplug user profile"
                }
                className="object-cover ring-2"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            {session?.user?.username && (
              <>
                <DropdownMenuRadioItem value="bottom">
                  <Link href={"/user/" + session?.user?.username}>
                    Portfolio
                  </Link>
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value="top">
                <Link href="/dashboard">Profile</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <Link href="/settings/user/profile">Settings</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="right">
                {session?.user ? (
                  <span onClick={() => signOut()}>Logout</span>
                ) : (
                  <span onClick={() => signIn()}>Login</span>
                )}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
      </div>
      <div className="flex md:hidden gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={
                  session?.user?.profile ||
                  "https://cdn.pixabay.com/photo/2022/02/14/02/52/monkey-7012380_960_720.png"
                }
                className="object-cover ring-2"
                alt="@l@sd3p1k"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="">
            <DropdownMenuRadioGroup>
              {session?.user?.username && (
                <>
                  <DropdownMenuRadioItem value="bottom">
                    <Link href={"/user/" + session?.user?.username}>
                      Portfolio
                    </Link>
                  </DropdownMenuRadioItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="top">
                <Link href="/dashboard">Profile</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <Link href="/settings/user/profile">Settings</Link>
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="right">
                <span onClick={() => signOut()}>Logout</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ThemeToggle />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="p-2 border-0">
              <Menu className="" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-center">
                <Image
                  src={isDarkMode ? logo : logoLight}
                  alt="devsplug logo"
                  className="md:w-44 w-32"
                />
              </SheetTitle>
              <SheetDescription>
                <div className="flex flex-col gap-8 items-center mt-24 ">
                  <Link
                    href="/leaderboard"
                    className="font-medium hover:text-[#8482ee]"
                  >
                    Leaderboard
                  </Link>
                  <Link
                    href="/challenges"
                    className="font-medium hover:text-[#8482ee]"
                  >
                    challenges
                  </Link>
                  <Link
                    href="/community"
                    className="font-medium hover:text-[#8482ee] "
                  >
                    community
                  </Link>
                  <Link
                    href="/learn"
                    className="font-medium hover:text-[#8482ee]"
                  >
                    Learn
                  </Link>
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
