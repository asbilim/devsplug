"use client";
import Markdown from "markdown-to-jsx";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getTitleAttribute } from "@/data/name-icons";
import useIsOwner from "@/providers/is-owner";
import { Pen } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "../states/empty";
export default function UserInfoDetails({ user }) {
  const isOwner = useIsOwner(user);

  return (
    <div className="flex w-full flex-col items-center justify-center my-12 md:my-16 lg:my-48 gap-12 px-4 lg:px-2 ">
      <div className="flex w-full max-w-6xl">
        <h1 className="font-semibold tracking-widest text-lg">
          {" "}
          {isOwner ? "your" : user?.username} records
        </h1>
      </div>
      <div className="header border flex max-w-6xl md:justify-between p-4 w-full flex-col md:flex-row items-center gap-4 justify-center">
        <div className="flex items-center justify-center gap-4 flex-col md:flex-row">
          <Avatar className="w-20 h-20 md:w-30 md:h-30 lg:w-40 lg:h-40 ">
            <AvatarImage
              src={
                user?.profile ||
                "https://images.pexels.com/photos/92129/pexels-photo-92129.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              alt={user?.username + "on devsplug , view profile "}
            />
            <AvatarFallback>
              {user?.username?.toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h3 style={{ color: getTitleAttribute(user?.title, 0) }}>
            {user?.username}
          </h3>
        </div>
        <div className="grid grid-cols-4 gap-2 place-content-center">
          <h2 className="lg:text-4xl text-xl">
            {getTitleAttribute(user?.title, 1)}
          </h2>
          <h2 className="lg:text-2xl text-sm md:text-lg font-semibold">
            {user?.score}
          </h2>
          <h2 className="lg:text-2xl text-sm md:text-lg font-semibold">
            #{user?.position}
          </h2>
          <h2 className="lg:text-2xl text-sm md:text-lg font-semibold">
            {user?.title}
          </h2>
        </div>
      </div>
      <div className="flex w-full max-w-6xl items-center">
        <h2 className="font-semibold tracking-widest text-lg">
          About {isOwner ? "you" : user?.username}
        </h2>
        {isOwner && (
          <Button variant="link">
            <Link href="/dashboard/bio/edit/">
              <Pen />
            </Link>
          </Button>
        )}
      </div>
      <div
        className="flex w-full flex-col max-w-6xl   p-3 prose prose-slate dark:prose-invert overflow-x-hidden"
        style={{ margin: 0 }}>
        {user?.motivation && (
          <Markdown>{user?.motivation && user?.motivation}</Markdown>
        )}
        {!user?.motivation && (
          <EmptyState message={`${user?.username} did not add any bio`} />
        )}
      </div>
    </div>
  );
}
