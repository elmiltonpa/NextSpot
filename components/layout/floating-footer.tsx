"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import Link from "next/link";
import { HelpModal } from "./help-modal";

export function FloatingFooter() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 pointer-events-none">
        <div className="hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/50 shadow-sm pointer-events-auto h-10">
          <div className="flex flex-col items-start mr-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              NextSpot
            </span>
            <span className="text-[8px] text-slate-400/60 leading-none">
              © 2026
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <Link
            href="/privacy"
            className="text-[10px] font-semibold text-slate-500 hover:text-orange-600 transition-colors whitespace-nowrap"
          >
            Privacidad
          </Link>
          <Link
            href="/terms"
            className="text-[10px] font-semibold text-slate-500 hover:text-orange-600 transition-colors whitespace-nowrap"
          >
            Términos
          </Link>

          <div className="h-4 w-px bg-slate-200" />

          <button
            onClick={() => setIsHelpOpen(true)}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-help"
          >
            <Info className="h-3 w-3" />
            <span>Ayuda</span>
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

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
}
