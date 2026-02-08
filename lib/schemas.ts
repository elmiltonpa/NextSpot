import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, "El usuario o correo es obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
  rememberMe: z.boolean().optional(),
});

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(13, "El nombre de usuario no puede tener más de 13 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Solo se permiten letras, números y guiones bajos",
    ),
  email: z.email({ message: "El correo electrónico no es válido" }),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});
