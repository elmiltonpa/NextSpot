import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60 // 30 días
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const username = credentials?.username as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!username || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { username },
        });

        // 1. Error genérico si el usuario no existe
        if (!user) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        // 2. Error específico para cuentas sociales (lo mantenemos por UX)
        if (!user.password) {
          throw new Error("Cuenta registrada con proveedor social (Google/GitHub).");
        }

        // 3. Verificar contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // 4. Error genérico si la contraseña no coincide
        if (!isPasswordValid) {
          throw new Error("Usuario o contraseña incorrectos");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});