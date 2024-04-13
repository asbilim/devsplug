import { Skeleton } from "@/components/ui/skeleton";

export default function ChallengeLoading() {
  return (
    <div className="flex my-12 w-full   items-center justify-center ">
      <div className="flex max-w-6xl w-full items-center justify-center px-3">
        <div className="flex flex-col space-y-3 w-full">
          <Skeleton className="rounded h-24 w-2/4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
