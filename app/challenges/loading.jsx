import { Skeleton } from "@/components/ui/skeleton";
export default function Test() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex  border-b w-full justify-between md:px-12 px-3 py-2 items-center">
        <div className="image">
          <Skeleton className="w-14 h-14 rounded-full" />
        </div>
        <div className="texts md:flex hidden gap-4">
          <Skeleton className="w-36 p-2" />
          <Skeleton className="w-36 p-2" />
          <Skeleton className="w-36 p-2" />
          <Skeleton className="w-36 p-2" />
        </div>
        <div className="texts flex md:hidden gap-4">
          <Skeleton className="w-16 p-2" />
        </div>
      </div>
    </div>
  );
}
