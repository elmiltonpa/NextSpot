"use client";

import { useEffect, useState, memo } from "react";
import { ArrowLeft, MapPin, Clock, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { getHistory } from "@/actions/get-history";
import { deleteHistoryItem } from "@/actions/delete-history";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { PlaceResult } from "@/types/places";
import { getPlaceDetails } from "@/actions/get-place-details";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  googlePlaceId: string;
  name: string;
  address: string;
  image: string | null;
  createdAt: Date;
}

interface HistoryViewProps {
  onBack: () => void;
  onSelect: (place: PlaceResult) => void;
}

const API_KEY = process.env.NEXT_PUBLIC_PLACES_API_KEY || "";

export const HistoryView = memo(function HistoryView({
  onBack,
  onSelect,
}: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();

        if (response.success && Array.isArray(response.data)) {
          setHistory(response.data);
        } else {
          setHistory([]);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error al cargar el historial";

        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleItemClick = async (item: HistoryItem) => {
    setLoadingItemId(item.id);

    try {
      const details = await getPlaceDetails(item.googlePlaceId);
      if ("error" in details) {
        toast.error(details.error);
        return;
      }
      onSelect(details);
    } catch {
      toast.error("No se pudieron cargar los detalles");
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evitar que el clic abra los detalles del lugar
    
    try {
      const response = await deleteHistoryItem(id);
      if (response.success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
        toast.success("Eliminado del historial");
      } else {
        toast.error(response.error || "No se pudo eliminar");
      }
    } catch {
      toast.error("Error al eliminar el elemento");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-left-4 duration-300">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Tu Historial</h2>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          contentVisibility: "auto",
          containIntrinsicSize: "1px 1000px",
        }}
      >
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2">
            <Clock className="h-12 w-12 text-gray-300" />

            <p>Aún no tienes historial.</p>

            <p className="text-xs">¡Descubre lugares para verlos aquí!</p>
          </div>
        ) : (
          history.map((item) => {
            const photoUrl = item.image
              ? `https://places.googleapis.com/v1/${item.image}/media?key=${API_KEY}&maxHeightPx=400&maxWidthPx=400`
              : null;

            const isItemLoading = loadingItemId === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={isItemLoading}
                  className="w-full text-left flex gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-orange-100 hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {isItemLoading && (
                      <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="h-6 w-6 text-orange-500 animate-spin" />
                      </div>
                    )}

                                      {photoUrl ? (
                                        <Image
                                          src={photoUrl}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                          sizes="80px"
                                          unoptimized
                                        />
                                      ) : (                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <MapPin className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate group-hover:text-orange-600 transition-colors pr-6">
                      {item.name}
                    </h3>

                    <p className="text-xs text-gray-500 truncate mt-0.5 pr-6">
                      {item.address}
                    </p>

                    <span className="text-[10px] text-gray-400 mt-2">
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                </button>

                <button
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  className="absolute top-3 right-3 p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Eliminar del historial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});
