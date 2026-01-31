import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Iniciar Sesión - NextSpot",
  description:
    "Inicia sesión para acceder a tu cuenta y gestionar tus lugares favoritos.",
};

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">
          NextSpot
        </h1>
      </div>

      <LoginForm />
    </div>
  );
}
