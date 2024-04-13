import RegisterComponent from "@/components/pages/auth/register";
import AuthLayout from "@/components/pages/auth/layout";

export const metadata = {
  title: "Join Devsplug - Register Today and Start Coding!",
  description:
    "Sign up now on Devsplug to participate in exciting coding challenges. Enhance your programming skills, compete with peers, and climb the leaderboard!",
  canonical: "https://www.devsplug.com/auth/register",
  openGraph: {
    title: "Register at Devsplug - Begin Your Coding Journey Today",
    description:
      "Create your account on Devsplug and gain access to a wide range of programming challenges across various difficulty levels. Join our community now!",
    url: "https://www.devsplug.com/auth/register",
    type: "website",
    images: [
      {
        url: "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        width: 1200,
        height: 630,
        alt: "Sign Up for Devsplug",
        type: "image/jpeg",
      },
    ],
    siteName: "Devsplug",
  },
  twitter: {
    card: "summary_large_image",
    site: "@devsplug",
    title: "Get Started with Devsplug - Register Today",
    description:
      "Ready to solve programming puzzles? Register at Devsplug to explore, learn, and compete in coding challenges. Start your developer journey with us!",
    image:
      "https://images.pexels.com/photos/1181280/pexels-photo-1181280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    imageAlt: "Devsplug Registration",
  },
  robots: "index, follow",
  keywords:
    "Register, Devsplug, Programming Challenges, Coding Competitions, Learn Coding",
};

export default function Register() {
  return (
    <AuthLayout>
      <RegisterComponent />
    </AuthLayout>
  );
}
