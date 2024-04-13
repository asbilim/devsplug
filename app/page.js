import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/buttons/toggle-theme";
import LoginButton from "@/components/signin";
import Link from "next/link";

export const metadata = {
  title: "Devsplug - Master Programming with Challenges",
  description:
    "Enhance your coding skills with Devsplug's diverse array of programming challenges. Dive into our platform for an interactive learning experience in Cameroon.",
  canonical: "https://www.devsplug.com/",
  image:
    "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  openGraph: {
    url: "https://www.devsplug.com/",
    title: "Devsplug - Programming Challenges to Boost Your Skills",
    description:
      "Join Devsplug to solve exciting programming problems and elevate your coding skills. Engage with a community passionate about technology and development.",
    images: [
      {
        url: "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1200,
        height: 630,
        alt: "Programming challenges on Devsplug",
        type: "image/jpeg",
      },
    ],
    siteName: "Devsplug",
    type: "website",
    locale: "en_CM",
    imageSecureUrl:
      "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  },
  twitter: {
    handle: "@devsplug",
    site: "@devsplug",
    cardType: "summary_large_image",
  },
  robots: "index, follow",
  keywords:
    "Programming, Coding Challenges, Learn Programming, Cameroon, Devsplug, Coding in Cameroon, Software Development",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Camerdevs : discover who we are and our goals
      </h1>
      <ThemeToggle />
      <Button size="lg">
        <Link href="/dashboard">Get started now for free</Link>
      </Button>
      <p className="text-center tracking-wider">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloremque
        vero sunt praesentium ipsum facilis quam quis minus suscipit
        exercitationem. Rem temporibus quisquam adipisci accusantium corrupti
        expedita explicabo cum placeat! Possimus!
      </p>
      <div className="flex flex-col gap-16 items-center justify-center">
        <h3 className="tracking-wider font-medium">
          This is some of our goals
        </h3>
        <div className="flex items-center justify-center gap-8">
          <Button variant="link" className="underline">
            Empower youngs
          </Button>
          <Button variant="link" className="underline">
            training
          </Button>
          <Button variant="link" className="underline">
            mentoring
          </Button>
          <Button variant="link" className="underline">
            collaboration
          </Button>
        </div>
      </div>
      <h2 className="scroll-m-20 text-2xl font-extrabold tracking-tight pb-2 border-b">
        Camerdevs : discover who we are and our goals
      </h2>

      <LoginButton />
    </main>
  );
}
