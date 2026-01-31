"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Form } from "../types/form";

type RegisterResponse = { success: true } | { success: false; error: string };

export const register = async (formData: Form): Promise<RegisterResponse> => {
  const { username, email, password } = formData;

  try {
    if (!username || !email || !password) {
      return {
        success: false,
        error: "Todos los campos son obligatorios",
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "La contraseña debe tener al menos 6 caracteres",
      };
    }

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
        username: username.toString(),
        email: email.toString(),
        password: hashedPassword,
      },
    });
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Error interno del sistema. Inténtalo más tarde.",
    };
  }
};
