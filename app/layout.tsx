import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ToastProvider } from "@/components/providers/toaster-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Instituto San Pablo | Formación Técnica en Pereira",
  description: "Instituto San Pablo - 15+ años formando profesionales técnicos en Pereira, Risaralda. Programas certificados SENA en Primera Infancia e Inglés.",
  keywords: "instituto san pablo, pereira, risaralda, formación técnica, SENA, primera infancia, inglés",
  authors: [{ name: "Instituto San Pablo" }],
  creator: "Instituto San Pablo",
  openGraph: {
    title: "Instituto San Pablo | Formación Técnica en Pereira",
    description: "15+ años transformando vidas en Pereira, Risaralda. Programas técnicos certificados.",
    url: "https://institutosanpablo.edu.co",
    siteName: "Instituto San Pablo",
    locale: "es_CO",
    type: "website",
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          avatarBox: {
            width: "2rem",
            height: "2rem"
          }
        }
      }}
    >
      <html lang="es" className={inter.className} suppressHydrationWarning>
        <body className="bg-slate-950 text-white">
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
