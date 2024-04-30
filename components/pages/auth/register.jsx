"use client";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import founder from "@/public/author.jpg";
import Image from "next/image";
import ActionButton from "@/components/buttons/action-button";
import { useRouter } from "next/navigation";
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

const schema = yup.object().shape({
  username: yup
    .string()
    .required("Name is required")
    .matches(
      /^[A-Za-z\d_-]*$/,
      "only  letters, numbers, underscores, and hyphens allowed"
    )
    .min(6, "Name must be at least 6 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Must be a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
      "Password must contain 8 characters, one letter, and one number"
    )
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  terms: yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

export default function RegisterComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${process.env.NEXT_PUBLIC_USER_CREATE_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    setLoading(false);

    const result = await response.json();

    if (result.status == "success") {
      setDialogOpen(true);
    } else {
      setError(true);
    }
  };

  return (
    <div className="register md:flex-row flex-col flex gap-12 mt-16 md:mx-16">
      <Dialog
        modal={true}
        defaultOpen={isDialogOpen}
        onOpenChange={() => setDialogOpen(!isDialogOpen)}
        open={isDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Account created</DialogTitle>
            <DialogDescription>
              You are now one step ahead to join the devsplug community , check
              your email inbox and verify your email address to activate your
              account
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-12">
            <Button type="submit">
              <Link href="/auth/account/confirm">Continue</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:mx-auto md:max-w-2xl md:w-full space-y-6 border-2  p-4 mx-4">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">Register</h1>
          <p className="text-gray-500">
            Enter your information to create an account
          </p>
          {error && (
            <div className="flex over">
              <div className="bg-red-950 p-3">
                <p className="text-red-200 font-medium text-xs tracking-widest">
                  the user you are trying to create already exists , please go
                  to the login page and try to login with the same credentials
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">nickname</Label>
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <Input {...field} id="name" placeholder="l@sd3p1k" />
            )}
          />
          {errors.username && (
            <p className="text-red-500 text-sm lowercase">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} id="email" placeholder="jane@example.com" />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm lowercase">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <PasswordInput {...field} id="password" value="dzd" />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm lowercase">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <PasswordInput {...field} id="confirmPassword" value="dzdzdz" />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm lowercase">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => <Checkbox {...field} id="terms" />}
          />
          <Label htmlFor="terms" className="ml-2 leading-none">
            I agree to the
            <Link href="#" className="underline">
              {" "}
              terms and conditions
            </Link>
          </Label>
        </div>
        <ActionButton className="w-full" type="submit" isLoading={loading}>
          Register
        </ActionButton>
        <p className="my-2 text-center">or</p>
        <hr />
        <div className="flex justify-between">
          <span className="underline">already have an account ?</span>
          <Button variant="secondary">
            <Link href="/auth/login">SignIn</Link>
          </Button>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm lowercase">
            {errors.terms.message}
          </p>
        )}
        {/* Submit button */}
      </form>
      <div className="author lg:flex flex-col items-center justify-center p-4 md:max-w-2xl w-full gap-4 hidden">
        <div className="cover w-44 h-44 p-1  rounded-full border-4">
          <Image
            src={founder}
            alt="devsplug founders"
            className="rounded-full  object-cover w-full h-full"
          />
        </div>
        <blockquote className="text-center leading-relaxed tracking-widest font-medium text-sm">
          Our primary objective in developing this application was to create a
          welcoming and supportive community specifically tailored for IT
          enthusiasts and professionals in Cameroon, and more broadly, across
          Africa. We aspire to offer a platform where members can engage, share
          knowledge, and collaborate, thereby enriching the tech ecosystem in
          the region. We hope you find value and inspiration here and enjoy
          being part of our community
        </blockquote>
        <div className="text-center">
          <Button variant="link" className="underline">
            @lasdepik
          </Button>
          <Button variant="link" className="font-normal ">
            founder of devsplug
          </Button>
        </div>
      </div>
    </div>
  );
}
