"use server";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getTranslations } from "next-intl/server";

const registerSchema = z
  .object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormState = {
  error: string | null;
  success: boolean;
};

export async function register(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const t = await getTranslations("Auth.errors");

  try {
    const rawData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: t("server_error"),
        success: false,
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData.data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        error: t(error.code) || t("server_error"),
        success: false,
      };
    }

    return { error: null, success: true };
  } catch (error) {
    return {
      error: t("server_error"),
      success: false,
    };
  }
}

export async function verifyEmail(formData: FormData) {
  const t = await getTranslations("Auth.errors");
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/activate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: t("verification") };
    }

    redirect("/auth/login");
  } catch (error) {
    return { error: t("server_error") };
  }
}

export async function forgotPassword(formData: FormData) {
  const t = await getTranslations("Auth.errors");
  const email = formData.get("email") as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/password/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { error: t("server_error") };
    }

    return { success: true };
  } catch (error) {
    return { error: t("server_error") };
  }
}

export async function resetPassword(formData: FormData) {
  const t = await getTranslations("Auth.errors");
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/password/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          email,
        }),
      }
    );

    if (!verifyResponse.ok) {
      return { error: t("verification") };
    }

    const changeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/api/user/password/change`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          email,
          password,
        }),
      }
    );

    if (!changeResponse.ok) {
      return { error: t("server_error") };
    }

    redirect("/auth/login");
  } catch (error) {
    return { error: t("server_error") };
  }
}

export async function login(formData: FormData) {
  const t = await getTranslations("Auth.errors");
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: t("invalid_credentials") };
    }

    redirect("/dashboard");
  } catch (error) {
    return { error: t("server_error") };
  }
}
