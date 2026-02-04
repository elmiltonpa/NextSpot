import { auth, signOut } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, ArrowLeft, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const session = await auth();

  const profileUser = await prisma.user.findUnique({
    where: { username: username },
  });

  if (!profileUser) {
    notFound();
  }

  const isOwner = session?.user?.username === profileUser.username;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Volver al mapa
          </Link>
        </div>

        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="h-28 w-28 rounded-full bg-linear-to-tr from-orange-100 to-orange-50 flex items-center justify-center border-4 border-white shadow-lg mx-auto overflow-hidden relative">
              {profileUser.image ? (
                <Image
                  src={profileUser.image}
                  alt={profileUser.username}
                  width={112}
                  height={112}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <User className="h-14 w-14 text-orange-600" />
              )}
            </div>
            {isOwner && (
              <div
                className="absolute bottom-1 right-1 h-6 w-6 bg-green-500 border-4 border-white rounded-full shadow-sm"
                title="Tú"
              />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight capitalize">
              {profileUser.username}
            </h2>
            <p className="text-sm font-medium text-orange-600">
              Explorador de NextSpot
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-8">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <Calendar className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Miembro desde
              </p>
              <p className="text-sm text-gray-900 font-semibold">
                {profileUser.createdAt.toLocaleDateString("es-ES", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="pt-6 border-t border-gray-100">
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-4 text-sm font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-all active:scale-[0.98] group"
              >
                <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-12 text-center opacity-30 select-none">
        <h1 className="text-3xl font-black text-orange-600 tracking-tighter">
          NextSpot
        </h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
          Discovery Engine
        </p>
      </div>
    </div>
  );
}
