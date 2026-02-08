"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { LoginSchema } from "@/lib/schemas";

export const login = async (values: unknown) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos" };
  }

  const { username, password, rememberMe } = validatedFields.data;

  try {
    await signIn("credentials", {
      username,
      password,
      rememberMe: rememberMe ? "true" : "false",
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas" };
        default:
          return { error: "Algo salió mal" };
      }
    }

    throw error;
  }
};
