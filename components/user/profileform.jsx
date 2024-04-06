"use client";
import avatar from "@/public/avatar.jpg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ActionButton from "../buttons/action-button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useSession, update } from "next-auth/react";
import { toast } from "sonner";
const validFileExtensions = {
  image: [
    "jpg",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "gif",
    "png",
    "jpeg",
    "svg",
    "webp",
  ],
};

function isValidFileType(fileName, fileType) {
  if (!fileName) return false;
  const extension = fileName.split(".").pop().toLowerCase();
  return validFileExtensions[fileType].includes(extension);
}

const MAX_FILE_SIZE = 102400 * 10;
const schema = yup.object({
  first_name: yup
    .string()
    .min(3, "first name must be at least 3 characters long")
    .matches(/^[a-zA-Z]+$/, "First name must contain only letters")
    .optional(),
  last_name: yup
    .string()
    .min(3, "last name must be at least 3 characters long")
    .matches(/^[a-zA-Z]+$/, "Last name must contain only letters")
    .optional(),
  email: yup.string().email("Must be a valid email"),
  username: yup
    .string()
    .min(6, "Username must be at least 6 characters long")
    .optional(),
  bio: yup.string().optional(),
  profile: yup
    .mixed()
    .test("is-valid-type", "Not a valid image type", (value) => {
      if (!value || value.length === 0) return false;
      const file = value[0];
      try {
        return isValidFileType(file.name, "image");
      } catch (e) {
        console.log(e.message);
        return false;
      }
    })
    .test(
      "is-valid-size",
      "Max allowed size is 1MB",
      (value) => !value || !value[0] || value[0].size <= MAX_FILE_SIZE
    )
    .nullable()
    .optional(),
});

export default function UserProfilePage() {
  const [loading, setLoading] = useState(false);

  const { data: session, update } = useSession();
  const user = session?.user;
  const user_id = user?.id;
  const token = session?.accessToken;

  const [avatar_, setAvatar] = useState(
    user?.profile
      ? user.profile
      : "https://cdn.pixabay.com/photo/2022/02/14/02/52/monkey-7012380_960_720.png"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    const updatePath = process.env.NEXT_PUBLIC_USER_UPDATE_PATH;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const endpoint = `${backendUrl}${updatePath}/${user_id}`;
    setLoading(true);

    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key] instanceof FileList) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      }
    }

    fetch(endpoint, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    })
      .then((result) => result.json())
      .then((response) => {
        if (response.username) {
          toast.success("Information changed successfully");
          update();
        } else {
          toast.error("something went wrong , it is not your fault");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => setLoading(false));
  };

  const profileFile = watch("profile");

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));

      const fileInputEvent = {
        target: {
          name: "profile",
          value: event.target.files,
        },
      };

      setValue("profile", fileInputEvent.target.value, {
        shouldValidate: true,
      });
    }
  };

  return (
    <form
      className="grid max-w-2xl mx-auto mt-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <SnackbarProvider />
      <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
        <label htmlFor="profile">
          <Image
            className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-ternary"
            src={avatar_}
            alt="Bordered avatar"
            width="120"
            height="120"
          />
        </label>

        <div className="flex flex-col space-y-5 sm:ml-8">
          <input
            type="file"
            id="profile"
            className="w-0 h-0"
            onChange={onFileChange}
          />
          <Label for="profile" type="button">
            Change picture
          </Label>
          <ActionButton
            type="button"
            variant="outline"
            className="border text-red-500 border-red-500"
          >
            Delete picture
          </ActionButton>
        </div>
      </div>

      <p className="block mb-2 text-sm font-semibold text-red-900 py-4 ">
        {errors.profile?.message}
      </p>
      <div className="items-center mt-8 sm:mt-14 text-[#202142]">
        <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
          <div className="w-full">
            <Label for="first_name">Your first name</Label>
            <Input
              type="text"
              id="first_name"
              placeholder="Your first name"
              {...register("first_name")}
            />
            <p className="block mb-2 text-sm font-semibold text-red-900 ">
              {errors.first_name?.message}
            </p>
          </div>

          <div className="w-full">
            <Label for="last_name">Your last name</Label>
            <Input
              type="text"
              id="last_name"
              placeholder="Your last name"
              {...register("last_name")}
            />
            <p className="block mb-2 text-sm font-semibold text-red-900 ">
              {errors.last_name?.message}
            </p>
          </div>
        </div>

        <div className="mb-2 sm:mb-6">
          <Label for="email">Your email</Label>
          <Input
            type="email"
            id="email"
            placeholder="your.email@mail.com"
            {...register("email")}
          />
          <p className="block mb-2 text-sm font-semibold text-red-900 ">
            {errors.email?.message}
          </p>
        </div>

        <div className="mb-2 sm:mb-6">
          <Label for="profession">Username</Label>
          <Input
            type="text"
            id="profession"
            placeholder="your username"
            {...register("username")}
          />
          <p className="block mb-2 text-sm font-semibold text-red-900 ">
            {errors.username?.message}
          </p>
        </div>

        <div className="flex justify-end">
          <ActionButton
            isLoading={loading}
            type="submit"
            variant=""
            className="px-12"
          >
            Save
          </ActionButton>
        </div>
      </div>
    </form>
  );
}
