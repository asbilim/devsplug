import { LuGithub } from "react-icons/lu";
import { Button } from "../ui/button";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { HeroCards } from "../cards";
export default function Hero() {
  return (
    <section className="grid lg:px-24 md:px-12 px-12 lg:grid-cols-2 place-items-center pt-36 pb-24 md:pt-48 gap-10  overflow-x-hidden place-content-center">
      <div className="text-center lg:text-start space-y-6 ">
        <main className="text-3xl md:text-3xl lg:text-6xl font-bold flex flex-col md:gap-6 ">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-primary  to-[#8482ee] text-transparent bg-clip-text">
              Devsplug
            </span>{" "}
          </h1>{" "}
          <h2 className="inline">master programming with</h2>
          <h2 className="inline">
            <span className="inline bg-gradient-to-r from-secondary via-primary to-[#8482ee] text-transparent bg-clip-text">
              challenges
            </span>{" "}
            for developers
          </h2>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Enhance your coding skills with {"Devsplug's"} diverse array of
          programming challenges
        </p>

        <div className="space-y-4 md:space-y-0 md:space-x-4">
          <Link
            href="/dashboard"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({})}`}
          >
            Get started
          </Link>

          <Link
            href="https://github.com/leoMirandaa/shadcn-landing-page.git"
            target="_blank"
            className={`w-full md:w-1/3 ${buttonVariants({
              variant: "outline",
            })}`}
          >
            Github Repository
            <LuGithub className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
      <div className="z-10">
        <HeroCards />
      </div>
      <div className="shadow"></div>
    </section>
  );
}
