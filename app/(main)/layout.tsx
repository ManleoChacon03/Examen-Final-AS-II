// app/(main)/layout.tsx
// ¡VERSIÓN CORREGIDA SIN <html> ni <body>!

import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Gestión de Desechos en Zacapa",
  description: "Aprende a gestionar los desechos en Zacapa, Guatemala.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* El Navbar va aquí */}
      <Navbar />

      <main>{children}</main>

      <footer className="bg-dark text-white text-center p-3 mt-5">
        <p>&copy; 2025 Zacapa Limpia</p>
        <p>
          Desarrollado por: <strong>Mánleo Chacón</strong> para:{" "}
          <strong>Universidad Mariano Gálvez</strong>
        </p>
      </footer>

      {/* Script de Bootstrap usando el componente Script de Next.js */}
      <Script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}