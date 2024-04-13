"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "./data-table";
import { columns } from "./data-column";

function addPositionToUsers(data) {
  return data.map((user, index) => ({
    ...user,
    position: index + 1,
  }));
}
export default function LeaderBoard({ users }) {
  return (
    <div className="flex w-full items-center justify-start flex-col my-16 min-h-screen px-4 lg:px-0">
      <div className="flex w-full max-w-6xl flex-col gap-6">
        <div className="w-full flex gap-4 flex-col">
          <h1 className="text-2xl font-medium">Devsplug ranking </h1>
          <p>Welcome to the wall of fame - Here are our top users.</p>
        </div>
        <DataTable columns={columns} data={addPositionToUsers(users)} />
      </div>
    </div>
  );
}
