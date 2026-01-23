// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. IMPORTAMOS NUESTRO COMPONENTE
import { MapProvider } from "../providers/MapProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextSpot",
  description: "Descubre lugares aleatorios",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <MapProvider>{children}</MapProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
