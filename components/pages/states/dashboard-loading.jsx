import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex my-12 w-full items-center justify-center ">
      <div className="flex w-full max-w-6xl  items-center justify-center px-3">
        <div className="flex flex-col space-y-3 w-full gap-8">
          <Skeleton className="h-4 w-[250px] " />
          <div className="space-y-2 w-full">
            <div className="flex gap-4 items-center">
              <Skeleton className="w-20 aspect-square" />
              <Skeleton className="h-4 w-3/4 " />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="w-20 aspect-square" />
              <Skeleton className="h-4 w-3/4 " />
            </div>
            <div className="flex gap-4 items-center">
              <Skeleton className="w-20 aspect-square" />
              <Skeleton className="h-4 w-3/4 " />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
