"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import AuthLayout from "./layout";
import { useState } from "react";
const FormSchema = z.object({
  otp: z.string().min(9, {
    message: "The code must be exactly 9 digits.",
  }),
});

export default function VerifyAccountForm() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const verifyPath = process.env.NEXT_PUBLIC_USER_ACTIVATE_PATH;
  const [isDialogOpen, setDialogOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  function onSubmit(data) {
    fetch(backendUrl + verifyPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => data.json())
      .then((response) => {
        console.log(response);
        if (response.status == "error") {
          toast({
            title: "The code you entered is incorrect.",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
                <code className="text-red-200 overflow-auto">
                  {JSON.stringify(
                    {
                      data: "the code is not correct , verify it and try again!",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
          });
        } else if (response.status == "success") {
          toast({
            title: "Your account was activated.",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-green-950 p-4">
                <code className="text-green-200 overflow-auto">
                  {JSON.stringify(
                    {
                      success:
                        "Youpi , you are now an official devsplug member , login now",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
            action: (
              <ToastAction altText="Goto login">
                <Link href="/auth/login">Login to your account</Link>
              </ToastAction>
            ),
          });
          setDialogOpen(true);
        } else {
          toast({
            title: "Something went wrong,it is not your fault",
            description: (
              <div className="mt-2 w-[340px] rounded-md bg-red-950 p-4">
                <code className="text-red-200 overflow-auto">
                  {JSON.stringify(
                    {
                      error:
                        "We are facing a potential issue , please report it to the team in the feedback section , or click to retry",
                    },
                    null,
                    2
                  )}
                </code>
              </div>
            ),
            action: (
              <ToastAction onClick={() => onSubmit()} altText="Goto login">
                Retry now
              </ToastAction>
            ),
          });
        }
      });
  }
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
            <DialogTitle>Account activated</DialogTitle>
            <DialogDescription>
              Great now that your account is activated , you can login to your
              account and start solving any programming problem to improve your
              skills
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-12">
            <Button type="submit">
              <Link href="/auth/login">Get Started</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex items-center justify-center mt-24 ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={9} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                        <InputOTPSlot index={8} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the verification code sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </AuthLayout>
  );
}
