import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Los Tres Cerditos - Cuento Interactivo",
  description: "Cuento interactivo y animado para ninos y ninas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
