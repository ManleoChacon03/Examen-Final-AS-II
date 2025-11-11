// app/(main)/layout.tsx
// ¡VERSIÓN LIMPIA Y CORREGIDA!

import type { Metadata } from "next";
import Navbar from "@/app/components/Navbar";

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
    <html lang="es">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      
      <body className="main-background">
        
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

        {/* El script de Bootstrap (sin 'async') está correcto */}
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        ></script>
        
      </body>
    </html>
  );
}