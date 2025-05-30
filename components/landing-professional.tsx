"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Award, TrendingUp, Heart, MapPin, Phone, Mail } from "lucide-react";

export default function LandingProfessional() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased">
      {/* Banner superior de marketing */}
      <div className="w-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold text-center py-2 text-lg tracking-wide shadow-lg z-50 fixed top-0 left-0 right-0">
        ¡Inscripciones abiertas! <span className="ml-2 text-green-900">Cupos limitados para el próximo semestre</span>
      </div>
      {/* FONDO: solo luces en esquinas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Luz verde esquina superior izquierda */}
        <div className="absolute left-[-15%] top-[-15%] w-[500px] h-[500px] bg-green-500/40 rounded-full blur-[120px] opacity-80" />
        {/* Luz amarilla esquina inferior derecha */}
        <div className="absolute right-[-15%] bottom-[-15%] w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-[140px] opacity-80" />
      </div>

      {/* NAVBAR minimalista */}
      <nav className="fixed top-[40px] left-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-green-400/10 shadow-lg transition-all duration-300" style={{height:'80px'}}>
        <div className="container mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-full border-4 border-green-400/80 shadow-2xl flex items-center justify-center bg-white overflow-hidden transition-transform duration-300 hover:scale-105">
              <Image src="/logo-sanpablo.jpg" alt="Logo" width={52} height={52} className="rounded-full object-cover" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Instituto <span className="text-green-400">San Pablo</span></span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#programas" className="text-white/80 hover:text-green-400 transition-colors text-base">Programas</a>
            <a href="#excelencia" className="text-white/80 hover:text-green-400 transition-colors text-base">Excelencia</a>
            <a href="#contacto" className="text-white/80 hover:text-green-400 transition-colors text-base">Contacto</a>
            <a href="/sign-in" className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold shadow-xl border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-200">Portal Estudiantil</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col-reverse lg:flex-row items-center justify-between min-h-[90vh] pt-[124px] pb-10 container mx-auto px-6 gap-10 animate-fadein-slideup">
        {/* Texto */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-8">
          <h1 className="text-5xl md:text-6xl font-black leading-tight mb-2 tracking-tight drop-shadow-xl" style={{textShadow:'0 2px 20px #0008'}}>Forma tu <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 bg-clip-text text-transparent">Futuro</span> Profesional</h1>
          <p className="text-xl text-white/80 max-w-xl mb-2">En el <span className="text-green-400 font-semibold">Instituto San Pablo</span> te preparamos para el éxito en Pereira. Programas técnicos de alta demanda, docentes expertos y una comunidad vibrante.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <a href="#programas" className="px-10 py-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-extrabold text-xl shadow-xl border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-200">Ver Programas</a>
            <a href="#contacto" className="px-10 py-4 rounded-full border-2 border-yellow-400 text-white font-bold text-xl bg-black/40 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400 transition-all duration-200 shadow-lg hover:scale-110">Contáctanos</a>
          </div>
          <div className="flex gap-8 mt-8">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-green-400">500+</span>
              <span className="text-sm text-white/60">Graduados</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-yellow-400">15+</span>
              <span className="text-sm text-white/60">Años</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold text-green-400">95%</span>
              <span className="text-sm text-white/60">Empleabilidad</span>
            </div>
          </div>
        </div>
        {/* Imagen */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mb-10 lg:mb-0">
          <div className="relative w-full max-w-xl h-[420px] md:h-[520px] rounded-full overflow-hidden shadow-2xl border-[8px] border-green-400/80 flex items-center justify-center bg-black/60 transition-transform duration-300 hover:scale-105 group mt-6 md:mt-12">
            <div className="absolute inset-0 rounded-full border-[6px] border-yellow-400/80 pointer-events-none z-10"></div>
            <Image src="/imagen-principio.jpg" alt="Estudiantes San Pablo" fill style={{objectFit:'cover', objectPosition:'center'}} className="rounded-full group-hover:scale-105 transition-transform duration-300" priority />
          </div>
        </div>
      </section>

      {/* CTA motivacional */}
      <section className="container mx-auto px-6 py-12 flex flex-col items-center">
        <div className="bg-gradient-to-r from-green-500/80 via-yellow-400/60 to-green-500/80 rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 w-full max-w-5xl border-4 border-green-400/30">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-extrabold text-black mb-2">¡Reserva tu cupo hoy y transforma tu futuro!</h3>
            <p className="text-lg text-black/80">Aprovecha nuestros cupos limitados y accede a educación de calidad, certificación oficial y acompañamiento personalizado.</p>
          </div>
          <a href="#contacto" className="px-10 py-4 rounded-full bg-black text-yellow-400 font-extrabold text-xl shadow-xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black hover:scale-105 hover:shadow-2xl transition-all duration-200">Solicitar Información</a>
        </div>
      </section>

      {/* PROGRAMAS */}
      <section id="programas" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Nuestros <span className="text-green-400">Programas</span></h2>
        <p className="text-xl text-white/70 mb-12 text-center max-w-2xl">Formación técnica de vanguardia, diseñada para el mercado laboral actual y futuro. Elige tu camino al éxito.</p>
        <div className="grid md:grid-cols-2 gap-10 w-full max-w-3xl">
          {/* Tarjeta 1 */}
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-8 gap-4 transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-green-400/40 mb-2">
              <Image src="/infancia-imagen.jpg" alt="Primera Infancia" fill style={{objectFit:'cover'}} className="rounded-xl" />
            </div>
            <h3 className="text-xl font-bold text-white mt-2 mb-1">Técnico en Primera Infancia</h3>
            <p className="text-white/70 text-center text-base mb-2">Prácticas en jardines, certificación SENA, inglés especializado y psicología infantil.</p>
            <a href="/sign-in" className="mt-auto px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold text-lg shadow-lg border-2 border-green-400/40 hover:scale-105 hover:shadow-2xl transition-all duration-200">Inscribirme</a>
          </div>
          {/* Tarjeta 2 */}
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-yellow-400/30 flex flex-col items-center p-8 gap-4 transition-transform hover:scale-105 hover:shadow-2xl">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-yellow-400/40 mb-2">
              <Image src="/ingles-imagen.jpg" alt="Inglés" fill style={{objectFit:'cover'}} className="rounded-xl" />
            </div>
            <h3 className="text-xl font-bold text-white mt-2 mb-1">Certificación en Inglés</h3>
            <p className="text-white/70 text-center text-base mb-2">Niveles A1 a C1, certificación Cambridge, club de conversación y business English.</p>
            <a href="/sign-in" className="mt-auto px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-black font-bold text-lg shadow-lg border-2 border-yellow-400/40 hover:scale-105 hover:shadow-2xl transition-all duration-200">Inscribirme</a>
          </div>
        </div>
      </section>

      {/* EXCELENCIA */}
      <section id="excelencia" className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">¿Por qué <span className="text-yellow-400">San Pablo</span>?</h2>
        <div className="grid md:grid-cols-4 gap-10 w-full max-w-5xl mt-10">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-green-500/20 p-4 rounded-full mb-2"><CheckCircle size={32} className="text-green-400" /></span>
            <span className="font-semibold text-white">Certificación SENA</span>
            <span className="text-white/60 text-base">Títulos 100% avalados a nivel nacional.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2"><Award size={32} className="text-yellow-400" /></span>
            <span className="font-semibold text-white">Docentes Expertos</span>
            <span className="text-white/60 text-base">Profesionales con experiencia real y vocación.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-green-500/20 p-4 rounded-full mb-2"><TrendingUp size={32} className="text-green-400" /></span>
            <span className="font-semibold text-white">Alta Empleabilidad</span>
            <span className="text-white/60 text-base">95% de nuestros egresados consiguen empleo.</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2"><Heart size={32} className="text-yellow-400" /></span>
            <span className="font-semibold text-white">Comunidad Vibrante</span>
            <span className="text-white/60 text-base">Ambiente de apoyo y crecimiento personal.</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="container mx-auto px-6 py-24 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">Testimonios</h2>
        <div className="grid md:grid-cols-3 gap-10 w-full max-w-5xl mt-10">
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-8 gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-400/40 mb-2">
              <Image src="/imagen-id5.jpg" alt="Ana María López" fill style={{objectFit:'cover'}} className="rounded-full" />
            </div>
            <span className="font-semibold text-white text-lg">Ana María López</span>
            <span className="text-white/60 text-base text-center">“Gracias al Instituto San Pablo, hoy tengo mi propio jardín infantil. La formación fue integral y muy práctica.”</span>
            <div className="flex gap-1 mt-2">{Array(5).fill(0).map((_,i)=>(<span key={i} className="text-yellow-400 text-xl">★</span>))}</div>
          </div>
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-yellow-400/30 flex flex-col items-center p-8 gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-yellow-400/40 mb-2">
              <Image src="/imagen-id6.jpg" alt="Carlos J. Herrera" fill style={{objectFit:'cover'}} className="rounded-full" />
            </div>
            <span className="font-semibold text-white text-lg">Carlos J. Herrera</span>
            <span className="text-white/60 text-base text-center">“El nivel de inglés que alcancé me abrió puertas a un mejor empleo. Los profesores son excelentes y muy dedicados.”</span>
            <div className="flex gap-1 mt-2">{Array(5).fill(0).map((_,i)=>(<span key={i} className="text-yellow-400 text-xl">★</span>))}</div>
          </div>
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-8 gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-green-400/40 mb-2">
              <Image src="/imagen-id7.jpg" alt="Sofía Vargas" fill style={{objectFit:'cover'}} className="rounded-full" />
            </div>
            <span className="font-semibold text-white text-lg">Sofía Vargas</span>
            <span className="text-white/60 text-base text-center">“Los cursos de desarrollo profesional me dieron las herramientas exactas que necesitaba para ascender en mi empresa. ¡Totalmente recomendado!”</span>
            <div className="flex gap-1 mt-2">{Array(5).fill(0).map((_,i)=>(<span key={i} className="text-yellow-400 text-xl">★</span>))}</div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="container mx-auto px-6 py-24 flex flex-col items-center animate-fadein-slideup">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-center">¿Preguntas? <span className="text-green-400">Contáctanos</span></h2>
        <div className="flex flex-col md:flex-row gap-12 w-full max-w-4xl mt-10 items-center justify-center">
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-8 shadow-lg border border-green-400/20 w-full md:w-1/3">
            <MapPin size={36} className="text-green-400 mb-2" />
            <span className="text-white/90 text-lg font-semibold text-center">Carrera 12 #18-15, Centro<br />Pereira, Risaralda, Colombia</span>
          </div>
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-8 shadow-lg border border-yellow-400/20 w-full md:w-1/3">
            <Phone size={36} className="text-yellow-400 mb-2" />
            <span className="text-white/90 text-lg font-semibold text-center">(606) 335-2847<br />WhatsApp: +57 314 567-8910</span>
            <a href="https://wa.me/573145678910" target="_blank" rel="noopener noreferrer" className="mt-2 w-full text-center px-0 py-0"><span className="inline-block w-full px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold text-lg shadow-lg border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-200">Chatear por WhatsApp</span></a>
          </div>
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-8 shadow-lg border border-green-400/20 w-full md:w-1/3">
            <Mail size={36} className="text-green-400 mb-2" />
            <span className="text-white/90 text-lg font-semibold text-center">info@institutosanpablo.edu.co<br />admisiones@institutosanpablo.edu.co</span>
            <a href="mailto:admisiones@institutosanpablo.edu.co" className="mt-2 w-full text-center px-0 py-0"><span className="inline-block w-full px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-black font-bold text-lg shadow-lg border-2 border-yellow-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-200">Enviar Email</span></a>
          </div>
        </div>
      </section>

      {/* Misión, Visión y Decretos */}
      <section className="w-full bg-black/95 border-t border-green-400/20 py-16 px-4 mt-12 animate-fadein-slideup">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Misión</h3>
            <p className="text-white/80 text-base leading-relaxed">Formar técnicos integrales, éticos y competentes, comprometidos con el desarrollo social y laboral de la región, brindando educación de calidad y valores humanos.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Visión</h3>
            <p className="text-white/80 text-base leading-relaxed">Ser el instituto líder en formación técnica en Pereira, reconocido por la excelencia académica, la innovación y el impacto positivo en la comunidad.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Decretos y Normatividad</h3>
            <ul className="text-white/70 text-base leading-relaxed list-disc list-inside space-y-2">
              <li>Resolución 1234 de 2010 - Secretaría de Educación de Pereira</li>
              <li>Registro SENA No. 5678</li>
              <li>Normas de convivencia y ética institucional</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full py-8 bg-black/90 border-t border-green-400/20 text-center text-white/60 text-base">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-sanpablo.jpg" alt="Logo" width={32} height={32} className="rounded" />
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