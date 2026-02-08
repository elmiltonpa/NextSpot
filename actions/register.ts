"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/schemas";

type RegisterResponse = { success: true } | { success: false; error: string };

export const register = async (values: unknown): Promise<RegisterResponse> => {
  try {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.issues[0].message,
      };
    }

    const { username, email, password } = validatedFields.data;

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username: username }, { email: email }] },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          success: false,
          error: "El correo electrónico ya está en uso",
        };
      } else {
        return { success: false, error: "El nombre de usuario ya está en uso" };
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: "Error interno del sistema. Inténtalo más tarde.",
    };
  }
};
