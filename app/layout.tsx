import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MapProvider } from "../providers/MapProvider";
import { Toaster } from "sonner";
import { LocationProvider } from "@/context/location-context";
import { AuthProvider } from "@/providers/AuthProvider";
import { auth } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextSpot",
  description: "Descubre lugares aleatorios",
  verification: {
    google: "cyhjRkYU-BTDi7jrXHPDeob1KazD8W3iZpUk8yDOP20",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es">
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider session={session}>
          <LocationProvider>
            <MapProvider>{children}</MapProvider>
            <Toaster position="top-center" richColors closeButton />
          </LocationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
