import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="w-full max-w-md mx-auto bg-zinc-950/90 rounded-xl shadow-xl border border-white/10 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500"></div>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-400 mb-1">SanPablo</h1>
          <p className="text-gray-400 text-sm">Inicia sesión para continuar</p>
        </div>de                                                                               
        <SignIn
          appearance={{
            elements: {
              card: "bg-transparent shadow-none border-none p-0",
              headerTitle: "text-yellow-400 font-bold text-xl mb-2",
              headerSubtitle: "text-gray-400 mb-4 text-sm",
              formButtonPrimary: "bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 py-2 mt-4 text-base",
              formFieldInput: "bg-black/80 border border-white/10 text-white placeholder-gray-400 rounded-lg focus:border-yellow-400 focus:ring-yellow-400 text-base",
              formFieldLabel: "text-gray-300 font-medium mb-1 text-sm",
              socialButtonsBlockButton: "bg-zinc-900 text-white border border-white/10 hover:bg-yellow-400 hover:text-black transition-all duration-300 text-base",
              socialButtonsBlockButtonText: "text-white font-semibold text-base",
              footerAction: "text-gray-400 mt-6 text-sm",
              footerActionLink: "text-yellow-400 hover:underline text-sm",
              formFieldErrorText: "text-red-500 text-xs mt-1",
            },
            variables: {
              colorPrimary: '#FACC15',
              colorText: '#fff',
              colorBackground: '#111',
              colorInputBackground: '#18181b',
              colorInputText: '#fff',
              colorInputBorder: '#fff',
              colorDanger: '#ef4444',
            },
          }}
        />
      </div>
    </div>
  )
}