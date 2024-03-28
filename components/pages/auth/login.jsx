"use client";
import AuthLayout from "@/components/pages/auth/layout";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/buttons/action-button";

export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const onsubmit = async (data) => {
    setLoading(true);
    const result = await signIn("credentials", { redirect: false, ...data });
    setLoading(false);
    if (result.ok) {
      return router.push("/");
    } else {
      setError(true);
    }
  };
  return (
    <AuthLayout>
      <Card className="mx-auto max-w-xs w-full md:max-w-md md:w-full mt-16 ">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          {error && (
            <CardDescription className="text-red-500 font-bold text-xs">
              error:the credentials provided does not match
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="L@sd3p1k"
                  required
                  {...register("username", {
                    required: "Specify a username to login",
                  })}
                />
                {errors.username && (
                  <Label htmlFor="password" className="text-red-500">
                    {errors.username.message}
                  </Label>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password", {
                    required: "you cannot login without a password",
                  })}
                />
              </div>
              <ActionButton
                isLoading={loading}
                type="submit"
                className="w-full"
                loading={loading}
              >
                Login
              </ActionButton>
              <span className="text-center">or</span>
              <hr />
              <Button
                onClick={() =>
                  toast({
                    title: "Functionality not yet enabled",
                    description:
                      "This functionality is not yet available , we are working on making it ready as fast as possible",
                  })
                }
                variant="outline"
                className="w-full text-[#d9d9d9] hover:text-[#d9d9d9] hover:bg-white cursor-not-allowed"
              >
                Login with Github
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
