import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
export default function Test() {
  return (
    <div className="flex flex-col gap-4 min-h-screen ">
        <Header />
        <div className="content flex   mt-36 w-full justify-center  overflow-hidden px-4">
            <div className="content w-full max-w-6xl flex flex-col flex-wrap">
                <div className="flex justify-between w-full gap-12 flex-wrap">
                    <Skeleton className="flex p-4 w-full" />
                    <div className="flex  w-full gap-4 justify-center md:justify-end  overflow-hidden"> 
                        <Skeleton className="flex p-4 w-full" />
                        <Skeleton className="flex p-4 w-full" />
                    </div>
                </div>
            </div>
        </div>
        <div className="content flex   mt-36 w-full justify-center mb-36 px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-6xl gap-y-16">
                <Skeleton className="card   w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer " />
                <Skeleton className="card   w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer " />
                <Skeleton className="card   w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer" />
                <Skeleton className="card   w-full p-4 flex flex-col h-[20rem] overflow-auto gap-3 cursor-pointer" />
            </div>
        </div>
        <div className="flex items-center justify-center w-full  mb-24 px-4">
            <div className="flex w-full max-w-6xl justify-start ">
                <Skeleton className="p-6 w-48" />
            </div>
        </div>
      <Footer />
    </div>
  );
}
