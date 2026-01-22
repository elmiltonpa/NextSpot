"use client";

import { MapPin } from "lucide-react";

export function FloatingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-full shadow-lg border border-gray-100 group hover:shadow-xl transition-all duration-300">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
              boxShadow: "0 4px 12px -2px rgba(234, 88, 12, 0.4)"
            }}
          >
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground tracking-tight">NextSpot</span>
        </div>
      </div>
    </header>
  );
}
