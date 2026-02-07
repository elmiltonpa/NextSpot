"use client";

import { X, MapPin, Sliders, Sparkles } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              ¿Cómo usar <span className="text-orange-500">NextSpot</span>?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Descubre lugares increíbles en tres simples pasos.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  1. Define tu ubicación
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Haz doble clic en cualquier parte del mapa o usa el buscador
                  para situarte donde quieras.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  2. Ajusta tus preferencias
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Elige categorías, distancia máxima y presupuesto en el panel
                  lateral izquierdo.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  3. ¡Deja que ocurra la magia!
                </h3>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                  Pulsa el botón &quot;Sorpréndeme&quot; y nosotros elegiremos
                  el mejor lugar para ti aleatoriamente.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-10 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
          >
            ¡Entendido, vamos!
          </button>
        </div>
      </div>
    </div>
  );
}
