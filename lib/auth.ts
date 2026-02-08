import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { Adapter, AdapterUser } from "next-auth/adapters";
import { LoginSchema } from "@/lib/schemas";
import { isRateLimited } from "@/lib/rate-limit";
import { headers } from "next/headers";
import {
  RateLimitError,
  AccountLockedError,
  MaxAttemptsError,
  SocialAccountError,
  InvalidCredentialsError,
} from "@/lib/auth-errors";

async function generateUniqueUsername(email: string): Promise<string> {
  const baseUsername =
    email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") || "user";

  const existingUser = await prisma.user.findUnique({
    where: { username: baseUsername },
  });

  if (!existingUser) {
    return baseUsername;
  }

  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${baseUsername}_${suffix}`;
}

function CustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma) as Adapter;

  return {
    ...baseAdapter,
    async createUser(user: AdapterUser) {
      const username = await generateUniqueUsername(user.email!);

      const newUser = await prisma.user.create({
        data: {
          email: user.email!,
          emailVerified: user.emailVerified,
          image: user.image,
          username: username,
        },
      });

      return {
        ...newUser,
        emailVerified: newUser.emailVerified,
      } as AdapterUser;
    },
  };
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: CustomPrismaAdapter(),
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.split("@")[0],
        };
      },
    }),
    Credentials({
      credentials: {
        username: { label: "Username or email", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      authorize: async (credentials) => {
        const headerList = await headers();
        const ip =
          headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";

        if (isRateLimited(ip)) {
          throw new RateLimitError();
        }

        const parsedCredentials = LoginSchema.safeParse({
          username: credentials?.username,
          password: credentials?.password,
          rememberMe: credentials?.rememberMe === "true",
        });

        if (!parsedCredentials.success) {
          throw new InvalidCredentialsError();
        }

        const { username, password, rememberMe } = parsedCredentials.data;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: username }, { email: username }],
          },
        });

        if (!user) {
          throw new InvalidCredentialsError();
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new AccountLockedError();
        }

        if (!user.password) {
          throw new SocialAccountError();
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          const currentAttempts = user.failedLoginAttempts ?? 0;
          const attempts = currentAttempts + 1;

          if (attempts >= 5) {
            const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: attempts, lockedUntil: lockedUntil },
            });
            throw new MaxAttemptsError();
          } else {
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: attempts },
            });
          }

          throw new InvalidCredentialsError();
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockedUntil: null },
          });
        }

        return { ...user, rememberMe };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (existingUser) {
          user.username = existingUser.username;

          if (!existingUser.image && profile?.picture) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { image: profile.picture },
            });
            user.image = profile.picture;
          }
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;

        const thirtyDays = 30 * 24 * 60 * 60;
        const twentyFourHours = 24 * 60 * 60;

        if (account?.provider === "google") {
          token.exp = Math.floor(Date.now() / 1000) + thirtyDays;
        } else if (account?.provider === "credentials") {
          if (user.rememberMe) {
            token.exp = Math.floor(Date.now() / 1000) + thirtyDays;
          } else {
            token.exp = Math.floor(Date.now() / 1000) + twentyFourHours;
          }
        }
      }

      if (trigger === "update" && session?.username) {
        token.username = session.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
