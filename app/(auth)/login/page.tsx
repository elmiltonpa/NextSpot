import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { signOut } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Iniciar Sesión - NextSpot",
  description:
    "Inicia sesión para acceder a tu cuenta y gestionar tus lugares favoritos.",
};

export default async function LoginPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-orange-600 tracking-tight">
          NextSpot
        </h1>
      </div>

      <LoginForm />

      {/* DEBUG: Bloque para ver el estado de la sesión */}
      {session && (
        <div className="mt-8 w-full max-w-md overflow-hidden rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-green-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"/>
              Sesión Activa (Debug)
            </h3>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="text-xs bg-green-200 hover:bg-green-300 text-green-800 px-2 py-1 rounded transition-colors">
                Cerrar Sesión
              </button>
            </form>
          </div>
          <pre className="text-xs text-green-700 font-mono overflow-auto bg-green-100/50 p-2 rounded">
            {JSON.stringify(session.user, null, 2)}
          </pre>
          <p className="mt-2 text-xs text-green-600">
            Usuario detectado: <strong>{session.user?.name || session.user?.email || "Sin nombre"}</strong>
          </p>
        </div>
      )}
    </div>
  );
}