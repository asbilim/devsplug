import Header from "@/components/layout/header";
import Hero from "@/components/layout/hero";
import { Sponsors } from "@/components/layout/sponsors";
import DemoCode from "@/components/layout/demo";
import Footer from "@/components/layout/footer";

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
    <main className="">
      <Header />
      <Hero />
      <Sponsors />
      <DemoCode />
      <div className="flex my-12"></div>
      <Footer />
    </main>
  );
}
