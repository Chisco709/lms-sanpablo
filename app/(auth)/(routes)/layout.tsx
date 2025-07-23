import { Metadata } from "next"

// Metadata para todas las páginas de autenticación - NO INDEXAR
export const metadata: Metadata = {
  title: 'Autenticación - Instituto San Pablo',
  description: 'Páginas de autenticación del Instituto San Pablo',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
            {children}
        </div>
    )
}

export default AuthLayout