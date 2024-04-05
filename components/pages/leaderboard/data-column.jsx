"use client";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTitleAttribute } from "@/data/name-icons";

export const columns = [
  {
    accessorKey: "position",
    header: "position",
    cell: ({ row }) => {
      const rank = row.getValue("position");
      return <div className="font-medium">#{rank}</div>;
    },
  },
  {
    accessorKey: "username",
    header: "username",
    cell: ({ row }) => {
      const username = row.getValue("username");
      const title = row.getValue("title");
      return (
        <div
          className="hover:underline"
          style={{ color: getTitleAttribute(title, 0) }}
        >
          <Link href="/">{username}</Link>
        </div>
      );
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: "title",
  },
  {
    accessorKey: "title",
    header: "rank",
    cell: ({ row }) => {
      const title = row.getValue("title");
      return <div className="font-medium">{getTitleAttribute(title, 1)}</div>;
    },
  },
];
