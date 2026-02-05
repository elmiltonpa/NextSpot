"use server";
// SI USAR
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Form } from "../types/form";

type LoginResponse = {
  success: boolean;
  error: string;
};

export const login = async (
  formData: Pick<Form, "username" | "password">,
): Promise<LoginResponse> => {
  const { username, password } = formData;

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return { success: true, error: "" };
  } catch (error) {
    if (error instanceof AuthError) {
      const customError = error.cause?.err?.message;

      if (customError?.includes("proveedor social")) {
        return { success: false, error: customError };
      }

      return { success: false, error: "Usuario o contraseña incorrectos" };
    }

    throw error;
  }
};
