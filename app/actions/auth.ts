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
  try {
    const t = await getTranslations("Auth.errors");

    const rawData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validatedData = registerSchema.safeParse(rawData);

    if (!validatedData.success) {
      return {
        error: validatedData.error.errors[0].message,
        success: false,
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/create`,
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
        error: error.message || "Registration failed",
        success: false,
      };
    }

    return { error: null, success: true };
  } catch (error) {
    return {
      error: "Something went wrong. Please try again.",
      success: false,
    };
  }
}

export async function verifyEmail(formData: FormData) {
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/activate`,
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
      return { error: data.error || "Email verification failed" };
    }

    redirect("/auth/login");
  } catch (error) {
    return { error: "Internal server error" };
  }
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get("email") as string;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/password/apply`,
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
      return { error: data.error || "Password reset request failed" };
    }

    return { success: true };
  } catch (error) {
    return { error: "Internal server error" };
  }
}

export async function resetPassword(formData: FormData) {
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // First verify the code
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/password/verify`,
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
      const verifyData = await verifyResponse.json();
      return { error: verifyData.error || "Code verification failed" };
    }

    // Then change the password
    const changeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/password/change`,
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

    const changeData = await changeResponse.json();

    if (!changeResponse.ok) {
      return { error: changeData.error || "Password change failed" };
    }

    redirect("/auth/login");
  } catch (error) {
    return { error: "Internal server error" };
  }
}

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid username or password" };
    }

    redirect("/dashboard");
  } catch (error) {
    return { error: "Internal server error" };
  }
}
