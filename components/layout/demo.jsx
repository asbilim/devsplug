"use client";
import lightDemo from "@/public/demo-light.jpeg";
import darkDemo from "@/public/demo-black.jpeg";
import useDarkMode from "@/providers/dark-mode-checker";
import Image from "next/image";
export default function DemoCode() {
  const state = useDarkMode();
  return (
    <div className="lg:flex  md:px-12 px-6 lg:px-24 w-full my-36 items-center justify-center flex-col gap-6 hidden">
      <h3 className="text-primary text-sm md:text-3xl font-extrabold  text-center ">
        Generate beautiful image of your code
      </h3>
      <div className="flex image">
        <Image
          src={state ? darkDemo : lightDemo}
          className="object-contain"
          alt="example of beautiful code"
        />
      </div>
    </div>
  );
}
