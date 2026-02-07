import { Github, Info } from "lucide-react";
import Link from "next/link";

export function FloatingFooter() {
  return (
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

        <div className="h-4 w-[1px] bg-slate-200" />

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

        <div className="h-4 w-[1px] bg-slate-200" />

        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
          Powered by <span className="text-slate-500 font-bold">Google</span>
        </span>

        <div className="h-4 w-[1px] bg-slate-200" />

        <button className="flex items-center gap-1 text-[10px] font-bold text-slate-700 hover:text-blue-600 transition-colors cursor-help">
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
        <Github className="h-5 w-5" />
        <span className="text-xs font-bold max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap opacity-0 group-hover:opacity-100">
          Open Source
        </span>
      </Link>
    </div>
  );
}
