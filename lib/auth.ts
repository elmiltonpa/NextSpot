import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 60, // 30 días
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

        // 1. Usuario no existe -> return null (sin error en consola)
        if (!user) {
          return null;
        }

        // 2. Cuenta social -> Mantener error informativo
        if (!user.password) {
          throw new Error(
            "Cuenta registrada con proveedor social (Google/GitHub).",
          );
        }

        // 3. Contraseña incorrecta -> return null (sin error en consola)
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // Ahora TypeScript sabe que token.username existe
      if (token.username && session.user) {
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // Ahora TypeScript sabe que user.username existe gracias a next-auth.d.ts
        token.username = user.username;
      }
      return token;
    },
  },
});
