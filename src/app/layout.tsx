import "./globals.css";
import type { Metadata } from "next";
import { Patrick_Hand } from "next/font/google";

const patrickHand = Patrick_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-patrick-hand",
});

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
      <body className={patrickHand.variable} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
