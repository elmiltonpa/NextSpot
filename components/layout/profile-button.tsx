"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { User as UserIcon, LogIn, Loader2 } from "lucide-react";

export function ProfileButton() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="fixed top-4 right-4 z-40 animate-in fade-in zoom-in duration-300">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md border border-gray-200/50">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40 animate-in fade-in zoom-in duration-300">
      {session ? (
        <Link
          href={`/${session.user.username}`}
          className="group flex items-center gap-2 rounded-full bg-white/90 p-1 pr-4 shadow-lg backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-95 border border-gray-200/50"
          title="Ir a mi perfil"
        >
          <div className="relative h-9 w-9 overflow-hidden rounded-full bg-orange-100 flex items-center justify-center border-2 border-white shadow-sm">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "Usuario"}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <UserIcon className="h-5 w-5 text-orange-600" />
            )}
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-xs font-bold text-gray-800 max-w-[100px] truncate">
              {session.user?.username?.substring(0, 13) || "Usuario"}
            </span>
            <span className="text-[9px] font-medium text-orange-600 uppercase tracking-wide">
              Mi Cuenta
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/login"
          className="group flex h-10 items-center gap-2 rounded-full bg-white/90 px-4 shadow-lg backdrop-blur-md transition-all hover:bg-gray-900 hover:text-white active:scale-95 border border-gray-200/50"
        >
          <LogIn className="h-4 w-4" />
          <span className="text-sm font-bold">Ingresar</span>
        </Link>
      )}
    </div>
  );
}
