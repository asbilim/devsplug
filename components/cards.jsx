import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "@/components/icons";
import { LuGithub } from "react-icons/lu";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[500px]">
      {/* Testimonial */}
      <Card className="absolute w-[340px] -top-[15px] drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage alt="" src="https://i.pravatar.cc/150?img=3" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-lg">Jane Developer</CardTitle>
            <CardDescription>@jane_dev</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          DevsPlug has significantly boosted my coding skills!
        </CardContent>
      </Card>

      {/* Team */}
      <Card className="absolute right-[20px] top-4 w-80 flex flex-col justify-center items-center drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="mt-8 flex justify-center items-center pb-2">
          <img
            src="https://i.pravatar.cc/150?img=45"
            alt="team member avatar"
            className="absolute grayscale-[0%] -top-12 rounded-full w-24 h-24 aspect-square object-cover"
          />
          <CardTitle className="text-center">Alex Mentor</CardTitle>
          <CardDescription className="font-normal text-primary">
            Lead Developer
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center pb-2">
          <p>
            Leading projects at DevsPlug, helping turn ideas into real-world
            applications.
          </p>
        </CardContent>
        <CardFooter>{/* Social Media Links */}</CardFooter>
      </Card>

      {/* Pricing */}
      <Card className="absolute top-[150px] left-[50px] w-72  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Support Us
            <Badge variant="secondary" className="text-sm text-primary">
              Buy Me a Coffee
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">Support</span>
          </div>
          <CardDescription>
            Enjoying DevsPlug? Consider buying us a coffee to keep the site
            running!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Support with Coffee</Button>
        </CardContent>
      </Card>

      {/* Service */}
      <Card className="absolute w-[350px] -right-[10px] bottom-[35px]  drop-shadow-xl shadow-black/10 dark:shadow-white/10">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/20 p-1 rounded-2xl">
            <LightBulbIcon />
          </div>
          <div>
            <CardTitle>Personalized Learning</CardTitle>
            <CardDescription className="text-md mt-2">
              Get personalized tasks based on your skill level and interests.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
