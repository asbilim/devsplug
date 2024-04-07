"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ActionButton from "../buttons/action-button";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const schema = yup.object().shape({
  country: yup.string().required("Country is required"),
  town: yup.string().required("Town is required"),
  city: yup.string().required("City is required"),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .min(9, "Phone number must be at least 9 digits long")
    .max(9, "Phone number must be at most 9 digits long")
    .required("Phone number is required"),
  exact_position: yup.string().required("Exact position is required"),
});

export default function AddLocationForm({ token, userId }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);

  const onsubmit = (data) => {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
    const locationPath = process.env.NEXT_PUBLIC_USER_LOCATION_PATH;
    setValue("user_id", userId);
    const endpoint = backend + locationPath;
    setLoading(true);
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token.value,
      },
      body: JSON.stringify(data),
    })
      .then((answer) => answer.json())
      .then((response) => {
   
        if (response.status == "success") {
          enqueueSnackbar(response.content, { variant: "success" });
        } else {
          enqueueSnackbar(response.detail, { variant: "error" });
        }
      })
      .finally(() => {
        setLoading(false);
        reset();
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-[#202142]">
        Add Location
      </h2>
      <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
        <SnackbarProvider />
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-indigo-900 mb-2"
          >
            Country
          </label>
          <input
            {...register("country")}
            type="text"
            id="country"
            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter country"
          />
          <label>
            {errors.country && (
              <p className="text-xs text-red-500">{errors.country.message}</p>
            )}
          </label>
        </div>

        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-indigo-900 mb-2"
          >
            Phone Number
          </label>
          <input
            {...register("phone_number")}
            type="text"
            id="phone_number"
            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter phone number"
          />
          <label htmlFor="">
            {errors.phone_number && (
              <p className="text-xs text-red-500">
                {errors.phone_number.message}
              </p>
            )}
          </label>
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-indigo-900 mb-2"
          >
            City
          </label>
          <input
            {...register("city")}
            type="text"
            id="city"
            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter phone number"
          />
          <label htmlFor="">
            {errors.city && (
              <p className="text-xs text-red-500">{errors.city.message}</p>
            )}
          </label>
        </div>

        <div>
          <label
            htmlFor="town"
            className="block text-sm font-medium text-indigo-900 mb-2"
          >
            Town
          </label>
          <input
            {...register("town")}
            type="text"
            id="town"
            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter phone number"
          />
          <label htmlFor="">
            {errors.town && (
              <p className="text-xs text-red-500">{errors.town.message}</p>
            )}
          </label>
        </div>

        <div>
          <label
            htmlFor="exact_position"
            className="block text-sm font-medium text-indigo-900 mb-2"
          >
            Exact Position
          </label>
          <textarea
            {...register("exact_position")}
            id="exact_position"
            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
            placeholder="Enter exact position"
          />
          <label>
            {errors.exact_position && (
              <p className="text-xs text-red-500">
                {errors.exact_position.message}
              </p>
            )}
          </label>
        </div>
        <ActionButton
          isLoading={loading}
          className="px-4 py-2 bg-[#202142] text-white rounded hover:bg-indigo-900 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:ring-opacity-50"
        >
          Save All
        </ActionButton>
        <div className="flex justify-end"></div>
      </form>
    </div>
  );
}
