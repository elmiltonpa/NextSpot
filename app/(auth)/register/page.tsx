import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro - NextSpot",
  description: "Crea tu cuenta para guardar lugares y personalizar tu experiencia.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Logo o Brand (Opcional) */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">
          NextSpot
        </h1>
      </div>

      <RegisterForm />
    </div>
  );
}
