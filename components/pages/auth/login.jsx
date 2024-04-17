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
import { PasswordInput } from "@/components/inputs/password";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSearchParams } from "next/navigation";
export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [cloading, setCLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const registerForm = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { register, formState, handleSubmit } = useForm();
    return { register, formState, handleSubmit };
  };

  const forms = {
    username: registerForm(),
  };

  const onsubmit = async (data) => {
    setLoading(true);
    const result = await signIn("credentials", { redirect: false, ...data });
    setLoading(false);
    if (result.ok) {
      return callback ? router.push(callback) : router.push("/dashboard");
    } else {
      setError(true);
    }
  };

  const sendCode = async (data) => {
    setCLoading(true);
    const endpoint =
      process.env.NEXT_PUBLIC_BACKEND_URL +
      process.env.NEXT_PUBLIC_USER_ACTIVATION_CODE_CLAIM_PATH;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((answer) => {
        if (answer.status == "error") {
          toast({
            title: "The username does not exist.",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
                <code className="text-red-200 overflow-auto">
                  {JSON.stringify(
                    {
                      data: "the user does not exists , please make sure you entered a correct username",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
          });
        } else if (answer.status == "success") {
          toast({
            title: "A new code was sent.",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
                <code className="text-green-200 overflow-auto">
                  {JSON.stringify(
                    {
                      data: "A new code have been send to your email , use it to activate your account",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
          });
          setDialogOpen(false);
          setSuccess(true);
        } else {
          toast({
            title: "Something went wrong, it is not your fault",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
                <code className="text-red-200 overflow-auto">
                  {JSON.stringify(
                    {
                      data: "we are actually unable to send a verification code to your email",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
          });
        }
      })
      .catch((e) =>
        toast({
          title: "Something went wrong",
          description: (
            <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
              <code className="text-red-200 overflow-auto">
                {JSON.stringify(
                  {
                    data: e.message,
                  },
                  null,
                  2
                )}
              </code>
            </div>
          ),
        })
      )
      .finally(() => setCLoading(false));
  };
  return (
    <AuthLayout>
      <Dialog
        modal={true}
        defaultOpen={isDialogOpen}
        onOpenChange={() => setDialogOpen(!isDialogOpen)}
        open={isDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Claim verification code</DialogTitle>
            <DialogDescription>
              To claim a new verification code , please enter your username here
              <form onSubmit={forms.username.handleSubmit(sendCode)}>
                <Input
                  defaultValue={user}
                  {...forms.username.register("username", { required: true })}
                  type="text"
                  placeholder="username"
                  className="mt-8"
                />
                <div className="flex mt-12 items-center justify-end">
                  <ActionButton type="submit" variant="" isLoading={cloading}>
                    Send Code
                  </ActionButton>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className=""></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        modal={true}
        defaultOpen={success}
        onOpenChange={() => setDialogOpen(!success)}
        open={success}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verification code sent</DialogTitle>
            <DialogDescription>
              Congratulation a new verification code has been sent to your email
              use it to verify your account , click the button below to verify
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-12">
            <ActionButton type="submit" variant="">
              <Link href="/auth/account/confirm/">Verify account</Link>
            </ActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="mx-auto max-w-xs w-full md:max-w-md md:w-full mt-16 shadow-md border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
          {error && (
            <CardDescription className="text-red-200 bg-red-950 p-3 tracking-widest font-bold text-xs">
              The credentials pair does not match any of our users , verify it
              or make sure your account is activated , you can click here to{" "}
              <ActionButton
                variant="link"
                className="p-0 text-xs  text-red-200 underline"
                onclick={() => setDialogOpen(true)}
                isLoading={isDialogOpen}
              >
                request a new verification code
              </ActionButton>
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
                <PasswordInput
                  id="password"
                  required
                  value="dzd"
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
                type="disabled"
                className="w-full bg-secondary cursor-not-allowed"
                disabled
              >
                Login with Github
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="underline">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
