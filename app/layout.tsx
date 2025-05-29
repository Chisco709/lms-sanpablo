import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/providers/toaster-providers";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instituto San Pablo - Plataforma Educativa",
  description: "Plataforma de aprendizaje del Instituto San Pablo en Pereira, Colombia. Formación técnica en Primera Infancia, Inglés y carreras técnicas.",
  icons: {
    icon: "/instituto-sanpablo-logo.svg",
    shortcut: "/instituto-sanpablo-logo.svg",
    apple: "/instituto-sanpablo-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/" afterSignInUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
