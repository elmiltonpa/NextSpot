"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useLocation } from "@/context/location-context";

export function FloatingFooter() {
  const { setIsHelpModalOpen } = useLocation();

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 md:gap-3 bg-white/90 backdrop-blur-md p-1.5 md:px-4 md:py-2 rounded-2xl border border-slate-200/50 shadow-sm pointer-events-auto h-10">
          <div className="hidden sm:flex items-baseline gap-1 mr-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              NextSpot
            </span>
            <span className="text-[8px] text-slate-400 leading-none">
              © 2026
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-200" />

          <Link
            href="/privacy"
            className="hidden md:block text-[10px] font-semibold text-slate-500 hover:text-orange-600 transition-colors whitespace-nowrap"
          >
            Privacidad
          </Link>
          <Link
            href="/terms"
            className="hidden md:block text-[10px] font-semibold text-slate-500 hover:text-orange-600 transition-colors whitespace-nowrap"
          >
            Términos
          </Link>

          <div className="hidden md:block h-4 w-px bg-slate-200" />

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center justify-center gap-1.5 h-7 md:h-auto px-2 md:px-0 text-[10px] font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-help bg-slate-50 md:bg-transparent rounded-lg"
            title="Ayuda"
          >
            <Info className="h-4 w-4 md:h-3 md:w-3 text-blue-500 md:text-inherit" />
            <span className="hidden md:inline">Ayuda</span>
            <span className="md:hidden">Ayuda</span>
          </button>
        </div>

        <Link
          href="https://github.com/elmiltonpa/NextSpot"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-2 bg-slate-900 text-white h-10 px-3 rounded-xl shadow-xl hover:bg-slate-800 transition-all hover:shadow-orange-500/20 active:scale-95 border border-white/10 pointer-events-auto"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          <span className="text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100">
            Open Source
          </span>
        </Link>
      </div>
    </>
  );
}
