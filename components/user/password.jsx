"use client";
import ActionButton from "../buttons/action-button";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";

const passwordSchema = yup.object().shape({
  current_password: yup.string().required("Current password is required"),
  new_password: yup
    .string()
    .required("New password is required")
    .min(10, "Password must be at least 10 characters long")
    .max(100, "Password must not exceed 100 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(
      /[!@#?\$*]/,
      "Password must contain at least one special character"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});

export default function UserPasswordChange() {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const token = session?.accessToken;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
  });

  const new_password = watch("new_password");

  const onSubmit = (data) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const change_path = process.env.NEXT_PUBLIC_USER_CHANGE_PASSWORD_PATH;
    console.log(token);
    setLoading(true);
    fetch(backendUrl + change_path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.content == "password set successfully") {
          toast.success(data.content);
        } else {
          toast.error(data.content);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => {
        setLoading(false);
        reset();
      });
  };

  const validateRequirement = (regex) => {
    return new_password && regex.test(new_password);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow rounded p-8"
    >
      <SnackbarProvider />
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-[#202142]">
          Password information
        </h2>
        <div className="mb-4">
          <Label for="current-password" className="block text-gray-700 mb-2">
            Current password
          </Label>
          <Input
            type="password"
            id="current-password"
            placeholder="••••••••"
            {...register("current_password")}
          />
          <Label
            for="current-password"
            className="block  mb-2 text-xs text-red-500"
          >
            {errors?.current_password?.message}
          </Label>
        </div>
        <div className="mb-4">
          <Label for="new-password" className="block text-gray-700 mb-2">
            New password
          </Label>
          <Input
            type="password"
            id="new-password"
            placeholder="••••••••"
            {...register("new_password")}
          />
          <Label
            for="current-password"
            className="block mb-2 text-xs text-red-500"
          >
            {errors?.new_password?.message}
          </Label>
        </div>
        <div className="mb-6">
          <Label for="confirm-password" className="block text-gray-700 mb-2">
            Confirm password
          </Label>
          <Input
            type="password"
            id="confirm-password"
            placeholder="••••••••"
            {...register("confirm_password")}
          />
          <Label
            for="confirm-password"
            className="block mb-2 text-xs text-red-500"
          >
            {errors?.confirm_password?.message}
          </Label>
        </div>
      </div>

      <div className="mb-6">
        <p className=" mb-1">Password requirements:</p>
        <ul className="list-disc pl-5 text-sm">
          <li
            style={{
              color:
                !errors.new_password || errors.new_password?.type !== "min"
                  ? "green"
                  : "red",
            }}
          >
            At least 10 characters (and up to 100 characters)
          </li>
          <li
            style={{
              color:
                !errors.new_password || errors.new_password?.type !== "matches"
                  ? "green"
                  : "red",
            }}
          >
            At least one lowercase character
          </li>
          <li
            style={{
              color:
                !errors.new_password || errors.new_password?.type !== "matches"
                  ? "green"
                  : "red",
            }}
          >
            Inclusion of at least one special character, e.g., ! @ # ?
          </li>
        </ul>
      </div>

      <ActionButton isLoading={loading} className="px-12" variant="">
        Save all
      </ActionButton>
    </form>
  );
}
