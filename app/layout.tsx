import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Importando seus estilos globais
import { AuthProvider } from "@/contexts/AuthContext"; // Importando o AuthProvider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "O Fofoqueiro - Seu Portal de Fofocas!",
  description: "As últimas fofocas de celebridades nacionais e internacionais, com uma área VIP para aprender inglês!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

