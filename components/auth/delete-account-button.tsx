"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteAccount } from "@/actions/delete-account";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function DeleteAccountButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteAccount();

      if (result.success) {
        toast.success("Cuenta eliminada correctamente");
        await signOut({ callbackUrl: "/login" });
      } else {
        toast.error(result.error || "Ocurrió un error");
        setIsConfirming(false);
      }
    } catch {
      toast.error("Error al conectar con el servidor");
      setIsConfirming(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="space-y-4 p-4 rounded-2xl bg-red-50 border border-red-100 animate-in fade-in slide-in-from-top-2">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900">
              ¿Borrar tu cuenta?
            </h3>
            <p className="text-xs text-red-700 mt-1 leading-relaxed">
              Esta acción es permanente. Perderás todos tus favoritos e
              historial de búsqueda.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            disabled={isLoading}
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="h-3 w-3" />
            )}
            Sí, eliminar
          </button>
          <button
            disabled={isLoading}
            onClick={() => setIsConfirming(false)}
            className="flex-1 rounded-xl bg-white border border-red-200 px-3 py-2 text-xs font-bold text-red-900 hover:bg-red-100 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all group"
    >
      <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
      Eliminar mi cuenta
    </button>
  );
}
