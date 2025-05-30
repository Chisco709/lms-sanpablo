"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Award, TrendingUp, Heart, MapPin, Phone, Mail } from "lucide-react";

export default function LandingProfessional() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased">
      {/* FONDO: solo luces en esquinas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Luz verde esquina superior izquierda */}
        <div className="absolute left-[-15%] top-[-15%] w-[500px] h-[500px] bg-green-500/40 rounded-full blur-[120px] opacity-80" />
        {/* Luz amarilla esquina inferior derecha */}
        <div className="absolute right-[-15%] bottom-[-15%] w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-[140px] opacity-80" />
      </div>

      {/* NAVBAR minimalista */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-400/10">
        <div className="container mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <Image src="/instituto-sanpablo-logo.svg" alt="Logo" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold text-white tracking-tight">Instituto <span className="text-green-400">San Pablo</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#programas" className="text-white/80 hover:text-green-400 transition-colors text-base">Programas</a>
            <a href="#excelencia" className="text-white/80 hover:text-green-400 transition-colors text-base">Excelencia</a>
            <a href="#contacto" className="text-white/80 hover:text-green-400 transition-colors text-base">Contacto</a>
            <a href="/sign-in" className="ml-4 px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 text-black font-semibold shadow-lg hover:scale-105 transition-transform">Portal Estudiantil</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between min-h-[90vh] pt-32 pb-10 container mx-auto px-6 gap-10">
        {/* Texto */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-8">
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-2 tracking-tight" style={{textShadow:'0 2px 20px #0008'}}>Forma tu <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 bg-clip-text text-transparent">Futuro</span> Profesional</h1>
          <p className="text-lg text-white/80 max-w-xl mb-2">En el <span className="text-green-400 font-semibold">Instituto San Pablo</span> te preparamos para el éxito en Pereira. Programas técnicos de alta demanda, docentes expertos y una comunidad vibrante.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <a href="#programas" className="px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold text-lg shadow-lg hover:scale-105 transition-transform">Ver Programas</a>
            <a href="#contacto" className="px-8 py-3 rounded-lg border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition-colors">Contáctanos</a>
          </div>
          <div className="flex gap-8 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">500+</span>
              <span className="text-xs text-white/60">Graduados</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-yellow-400">15+</span>
              <span className="text-xs text-white/60">Años</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-green-400">95%</span>
              <span className="text-xs text-white/60">Empleabilidad</span>
            </div>
          </div>
        </div>
        {/* Imagen */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mb-10 lg:mb-0">
          <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500/30">
            <Image src="/imagen-principio.jpg" alt="Estudiantes San Pablo" fill style={{objectFit:'cover'}} className="rounded-2xl" priority />
          </div>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section id="programas" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nuestros <span className="text-green-400">Programas</span></h2>
        <p className="text-lg text-white/70 mb-12 text-center max-w-2xl">Formación técnica de vanguardia, diseñada para el mercado laboral actual y futuro. Elige tu camino al éxito.</p>
        <div className="grid md:grid-cols-3 gap-10 w-full max-w-5xl">
          {/* Tarjeta 1 */}
          <div className="bg-black/80 rounded-xl shadow-xl border border-green-500/20 flex flex-col items-center p-8 gap-4">
            <Image src="/infancia-imagen.jpg" alt="Primera Infancia" width={320} height={200} className="rounded-lg object-cover" />
            <h3 className="text-xl font-bold text-white mt-2 mb-1">Técnico en Primera Infancia</h3>
            <p className="text-white/70 text-center text-sm mb-2">Prácticas en jardines, certificación SENA, inglés especializado y psicología infantil.</p>
            <a href="/sign-in" className="mt-auto px-6 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors">Inscribirme</a>
          </div>
          {/* Tarjeta 2 */}
          <div className="bg-black/80 rounded-xl shadow-xl border border-yellow-400/20 flex flex-col items-center p-8 gap-4">
            <Image src="/ingles-imagen.jpg" alt="Inglés" width={320} height={200} className="rounded-lg object-cover" />
            <h3 className="text-xl font-bold text-white mt-2 mb-1">Certificación en Inglés</h3>
            <p className="text-white/70 text-center text-sm mb-2">Niveles A1 a C1, certificación Cambridge, club de conversación y business English.</p>
            <a href="/sign-in" className="mt-auto px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors">Inscribirme</a>
          </div>
          {/* Tarjeta 3 */}
          <div className="bg-black/80 rounded-xl shadow-xl border border-green-500/20 flex flex-col items-center p-8 gap-4">
            <Image src="/placeholder-course.jpg" alt="Desarrollo Profesional" width={320} height={200} className="rounded-lg object-cover" />
            <h3 className="text-xl font-bold text-white mt-2 mb-1">Desarrollo Profesional</h3>
            <p className="text-white/70 text-center text-sm mb-2">Cursos modulares, competencias laborales, certificación empresarial y seguimiento personalizado.</p>
            <a href="/sign-in" className="mt-auto px-6 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors">Inscribirme</a>
          </div>
        </div>
      </section>

      {/* EXCELENCIA */}
      <section id="excelencia" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">¿Por qué <span className="text-yellow-400">San Pablo</span>?</h2>
        <div className="grid md:grid-cols-4 gap-10 w-full max-w-5xl mt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-green-500/20 p-4 rounded-full mb-2"><CheckCircle size={32} className="text-green-400" /></span>
            <span className="font-semibold text-white">Certificación SENA</span>
            <span className="text-white/60 text-sm">Títulos 100% avalados a nivel nacional.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2"><Award size={32} className="text-yellow-400" /></span>
            <span className="font-semibold text-white">Docentes Expertos</span>
            <span className="text-white/60 text-sm">Profesionales con experiencia real y vocación.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-green-500/20 p-4 rounded-full mb-2"><TrendingUp size={32} className="text-green-400" /></span>
            <span className="font-semibold text-white">Alta Empleabilidad</span>
            <span className="text-white/60 text-sm">95% de nuestros egresados consiguen empleo.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2"><Heart size={32} className="text-yellow-400" /></span>
            <span className="font-semibold text-white">Comunidad Vibrante</span>
            <span className="text-white/60 text-sm">Ambiente de apoyo y crecimiento personal.</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Testimonios</h2>
        <div className="grid md:grid-cols-3 gap-10 w-full max-w-5xl mt-10">
          <div className="bg-black/80 rounded-xl shadow-xl border border-green-500/20 flex flex-col items-center p-8 gap-4">
            <Image src="/imagen-id5.jpg" alt="Ana María López" width={80} height={80} className="rounded-full object-cover mb-2" />
            <span className="font-semibold text-white">Ana María López</span>
            <span className="text-white/60 text-sm text-center">“Gracias al Instituto San Pablo, hoy tengo mi propio jardín infantil. La formación fue integral y muy práctica.”</span>
          </div>
          <div className="bg-black/80 rounded-xl shadow-xl border border-yellow-400/20 flex flex-col items-center p-8 gap-4">
            <Image src="/imagen-id6.jpg" alt="Carlos J. Herrera" width={80} height={80} className="rounded-full object-cover mb-2" />
            <span className="font-semibold text-white">Carlos J. Herrera</span>
            <span className="text-white/60 text-sm text-center">“El nivel de inglés que alcancé me abrió puertas a un mejor empleo. Los profesores son excelentes y muy dedicados.”</span>
          </div>
          <div className="bg-black/80 rounded-xl shadow-xl border border-green-500/20 flex flex-col items-center p-8 gap-4">
            <Image src="/imagen-id7.jpg" alt="Sofía Vargas" width={80} height={80} className="rounded-full object-cover mb-2" />
            <span className="font-semibold text-white">Sofía Vargas</span>
            <span className="text-white/60 text-sm text-center">“Los cursos de desarrollo profesional me dieron las herramientas exactas que necesitaba para ascender en mi empresa. ¡Totalmente recomendado!”</span>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">¿Preguntas? <span className="text-green-400">Contáctanos</span></h2>
        <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl mt-10 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <MapPin size={32} className="text-green-400" />
            <span className="text-white/80 text-center">Carrera 12 #18-15, Centro<br />Pereira, Risaralda, Colombia</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Phone size={32} className="text-yellow-400" />
            <span className="text-white/80 text-center">(606) 335-2847<br />WhatsApp: +57 314 567-8910</span>
            <a href="https://wa.me/573145678910" target="_blank" rel="noopener noreferrer" className="mt-2 px-6 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors">Chatear por WhatsApp</a>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Mail size={32} className="text-green-400" />
            <span className="text-white/80 text-center">info@institutosanpablo.edu.co<br />admisiones@institutosanpablo.edu.co</span>
            <a href="mailto:admisiones@institutosanpablo.edu.co" className="mt-2 px-6 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-colors">Enviar Email</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 bg-black/90 border-t border-green-400/20 text-center text-white/60 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/instituto-sanpablo-logo.svg" alt="Logo" width={32} height={32} className="rounded" />
            <span>Instituto San Pablo</span>
          </div>
          <div>
            © {new Date().getFullYear()} Instituto San Pablo. Todos los derechos reservados.
          </div>
          <div className="flex gap-4">
            <a href="https://wa.me/573145678910" target="_blank" rel="noopener noreferrer" className="hover:text-green-400">WhatsApp</a>
            <a href="mailto:info@institutosanpablo.edu.co" className="hover:text-yellow-400">Email</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 