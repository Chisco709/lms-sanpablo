"use client"

import Link from "next/link"

export default function LandingBasic() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Instituto San Pablo</h1>
        <p className="text-xl mb-8">Formación técnica de excelencia en Pereira</p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Nuestros Programas</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Técnico en Primera Infancia</h3>
              <p className="text-gray-300 mb-4">Especialización en atención integral a niños de 0-6 años</p>
              <p className="text-sm text-gray-400 mb-2">Duración: 18 meses</p>
              <p className="text-sm text-gray-400 mb-4">Empleabilidad: 96%</p>
              <Link 
                href="/sign-in"
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
              >
                Inscribirse
              </Link>
            </div>
            
            <div className="bg-zinc-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Técnico en Inglés</h3>
              <p className="text-gray-300 mb-4">Programa intensivo nivel B2-C1</p>
              <p className="text-sm text-gray-400 mb-2">Duración: 18 meses</p>
              <p className="text-sm text-gray-400 mb-4">Nivel: B2-C1</p>
              <Link 
                href="/sign-in"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Inscribirse
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">¿Por qué elegir San Pablo?</h2>
          <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-zinc-900 p-4 rounded">
              <h3 className="font-bold">Certificación SENA</h3>
              <p className="text-sm text-gray-300">Títulos oficiales reconocidos</p>
            </div>
            <div className="bg-zinc-900 p-4 rounded">
              <h3 className="font-bold">95% Empleabilidad</h3>
              <p className="text-sm text-gray-300">Inserción laboral garantizada</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/sign-in"
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-500"
          >
            Acceder al Portal Estudiantil
          </Link>
        </div>
        
        <footer className="mt-16 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-2">Instituto San Pablo</h3>
            <p className="text-gray-300 mb-2">15+ años transformando vidas en Pereira, Colombia</p>
            <p className="text-sm text-gray-400">Pereira, Risaralda - +57 (6) 123-4567</p>
            <p className="text-sm text-gray-400">info@institutosanpablo.edu.co</p>
          </div>
        </footer>
      </div>
    </div>
  )
} 