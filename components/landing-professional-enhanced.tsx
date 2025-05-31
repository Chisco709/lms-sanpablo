"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Award, TrendingUp, Heart, MapPin, Phone, Mail, Menu, X } from "lucide-react";

export default function LandingProfessionalEnhanced() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      
      // Intersection Observer para animaciones en scroll
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden font-sans antialiased">
      {/* Banner superior de marketing - ESTÁTICO */}
      <div className="w-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold text-center py-2 sm:py-3 text-sm sm:text-lg tracking-wide shadow-lg z-50 fixed top-0 left-0 right-0">
        <div>
          ¡Inscripciones abiertas! <span className="ml-2 text-green-900 hidden sm:inline">Cupos limitados para el próximo semestre</span>
          <span className="ml-2 text-green-900 sm:hidden">¡Cupos limitados!</span>
        </div>
      </div>

      {/* FONDO: efectos de luz mejorados */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute left-[-20%] top-[-20%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-green-500/40 rounded-full blur-[80px] sm:blur-[120px] opacity-80 animate-float-slow" />
        <div className="absolute right-[-20%] bottom-[-20%] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-yellow-400/30 rounded-full blur-[100px] sm:blur-[140px] opacity-80 animate-float" />
        <div className="absolute left-[30%] top-[60%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-green-400/20 rounded-full blur-[60px] sm:blur-[80px] opacity-60 animate-pulse-glow" />
      </div>
        
      {/* NAVBAR responsive mejorado */}
      <nav className={`fixed top-[32px] sm:top-[40px] left-0 w-full z-40 transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-xl shadow-2xl' : 'bg-black/80 backdrop-blur-md'
      } border-b border-green-400/10 h-[60px] sm:h-[80px]`}>
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-full">
          <div className="flex items-center space-x-2 sm:space-x-3" data-animate="fade-right">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 border-green-400/80 shadow-2xl flex items-center justify-center bg-white overflow-hidden transition-transform duration-300 hover:scale-105 animate-pulse-glow">
              <Image src="/logo-sanpablo.jpg" alt="Logo" width={40} height={40} className="sm:w-[52px] sm:h-[52px] rounded-full object-cover" />
            </div>
            <span className="text-base sm:text-xl font-bold text-white tracking-tight">
              Instituto <span className="text-green-400">San Pablo</span>
            </span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6" data-animate="fade-left">
            <a href="#programas" className="text-white/80 hover:text-green-400 transition-all duration-300 text-base hover-lift">Programas</a>
            <a href="#excelencia" className="text-white/80 hover:text-green-400 transition-all duration-300 text-base hover-lift">Excelencia</a>
            <a href="#contacto" className="text-white/80 hover:text-green-400 transition-all duration-300 text-base hover-lift">Contacto</a>
            <Link href="/sign-in" className="ml-4 px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold shadow-xl border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-300 glow-green">
              Portal Estudiantil
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-full bg-green-500/20 border border-green-400/40 transition-all duration-300 hover:bg-green-500/30"
          >
            {isMenuOpen ? <X size={24} className="text-green-400" /> : <Menu size={24} className="text-green-400" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
          isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-black/95 backdrop-blur-xl border-t border-green-400/20 px-4 py-6 space-y-4">
            <a href="#programas" onClick={toggleMenu} className="block text-white/80 hover:text-green-400 transition-colors text-lg py-2">Programas</a>
            <a href="#excelencia" onClick={toggleMenu} className="block text-white/80 hover:text-green-400 transition-colors text-lg py-2">Excelencia</a>
            <a href="#contacto" onClick={toggleMenu} className="block text-white/80 hover:text-green-400 transition-colors text-lg py-2">Contacto</a>
            <Link href="/sign-in" onClick={toggleMenu} className="block text-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-bold shadow-xl border-2 border-green-400/40 transition-all duration-300">
              Portal Estudiantil
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO mejorado */}
      <section className="relative flex flex-col lg:flex-row items-center justify-between min-h-screen pt-[100px] sm:pt-[124px] pb-10 container mx-auto px-4 sm:px-6 gap-8 lg:gap-10">
        {/* Texto */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center gap-6 sm:gap-8 text-center lg:text-left" data-animate="fade-up">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight mb-2 tracking-tight drop-shadow-xl animate-fade-in-up delay-200" style={{textShadow:'0 2px 20px #0008'}}>
            Forma tu <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-green-500 bg-clip-text text-transparent animate-gradient">Futuro</span> Profesional
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-2 animate-fade-in-up delay-400">
            En el <span className="text-green-400 font-semibold">Instituto San Pablo</span> te preparamos para el éxito en Pereira. Programas técnicos de alta demanda, docentes expertos y una comunidad vibrante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md lg:max-w-none animate-fade-in-up delay-600">
            <a href="#programas" className="px-8 sm:px-10 py-3 sm:py-4 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-green-500 text-black font-extrabold text-lg sm:text-xl shadow-xl border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-300 glow-green">
              Ver Programas
            </a>
            <a href="#contacto" className="px-8 sm:px-10 py-3 sm:py-4 rounded-full border-2 border-yellow-400 text-white font-bold text-lg sm:text-xl bg-black/40 hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400 transition-all duration-300 shadow-lg hover:scale-110 glow-yellow">
              Contáctanos
            </a>
          </div>
          
          <div className="flex gap-6 sm:gap-8 mt-6 sm:mt-8 animate-fade-in-up delay-800">
            <div className="flex flex-col items-center hover-lift">
              <span className="text-2xl sm:text-3xl font-extrabold text-green-400 animate-scale-in delay-100">500+</span>
              <span className="text-xs sm:text-sm text-white/60">Graduados</span>
            </div>
            <div className="flex flex-col items-center hover-lift">
              <span className="text-2xl sm:text-3xl font-extrabold text-yellow-400 animate-scale-in delay-200">15+</span>
              <span className="text-xs sm:text-sm text-white/60">Años</span>
            </div>
            <div className="flex flex-col items-center hover-lift">
              <span className="text-2xl sm:text-3xl font-extrabold text-green-400 animate-scale-in delay-300">95%</span>
              <span className="text-xs sm:text-sm text-white/60">Empleabilidad</span>
            </div>
          </div>
        </div>
        
        {/* Imagen */}
        <div className="w-full lg:w-1/2 flex justify-center items-center mb-10 lg:mb-0" data-animate="fade-left">
          <div className="relative w-full max-w-sm sm:max-w-xl h-[320px] sm:h-[420px] md:h-[520px] rounded-full overflow-hidden shadow-2xl border-[6px] sm:border-[8px] border-green-400/80 flex items-center justify-center bg-black/60 transition-transform duration-500 hover:scale-105 group mt-6 md:mt-12 animate-pulse-glow">
            <div className="absolute inset-0 rounded-full border-[4px] sm:border-[6px] border-yellow-400/80 pointer-events-none z-10 animate-rotate-slow"></div>
            <Image src="/imagen-principio.jpg" alt="Estudiantes San Pablo" fill style={{objectFit:'cover', objectPosition:'center'}} className="rounded-full group-hover:scale-105 transition-transform duration-500 animate-blur-in" priority />
          </div>
        </div>
      </section>

      {/* CTA motivacional mejorado - TEXTO CORREGIDO A BLANCO */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center" data-animate="scale">
        <div className="bg-gradient-to-r from-green-500/80 via-yellow-400/60 to-green-500/80 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 w-full max-w-5xl border-4 border-green-400/30 glass-effect-green hover:scale-105 transition-all duration-500">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2">¡Reserva tu cupo hoy y transforma tu futuro!</h3>
            <p className="text-base sm:text-lg text-white/90">Aprovecha nuestros cupos limitados y accede a educación de calidad, certificación oficial y acompañamiento personalizado.</p>
          </div>
          <a href="#contacto" className="px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-black text-yellow-400 font-extrabold text-lg sm:text-xl shadow-xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-black hover:scale-105 hover:shadow-2xl transition-all duration-300 glow-yellow">
            Solicitar Información
          </a>
        </div>
      </section>

      {/* PROGRAMAS mejorado */}
      <section id="programas" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Nuestros <span className="text-green-400">Programas</span></h2>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">Formación técnica de vanguardia, diseñada para el mercado laboral actual y futuro. Elige tu camino al éxito.</p>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 w-full max-w-4xl">
          {/* Tarjeta 1 */}
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-6 sm:p-8 gap-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl glass-effect-dark group" data-animate="fade-right">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-green-400/40 mb-2 group-hover:border-green-400/80 transition-all duration-300">
              <Image src="/infancia-imagen.jpg" alt="Primera Infancia" fill style={{objectFit:'cover'}} className="rounded-xl group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1 group-hover:text-green-400 transition-colors duration-300">Técnico en Primera Infancia</h3>
            <p className="text-white/70 text-center text-sm sm:text-base mb-2">Prácticas en jardines, certificación SENA, inglés especializado y psicología infantil.</p>
            <Link href="/sign-in" className="mt-auto px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold text-base sm:text-lg shadow-lg border-2 border-green-400/40 hover:scale-105 hover:shadow-2xl transition-all duration-300 glow-green">
              Inscribirme
            </Link>
          </div>
          
          {/* Tarjeta 2 */}
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-yellow-400/30 flex flex-col items-center p-6 sm:p-8 gap-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl glass-effect-dark group" data-animate="fade-left">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-yellow-400/40 mb-2 group-hover:border-yellow-400/80 transition-all duration-300">
              <Image src="/ingles-imagen.jpg" alt="Inglés" fill style={{objectFit:'cover'}} className="rounded-xl group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-2 mb-1 group-hover:text-yellow-400 transition-colors duration-300">Certificación en Inglés</h3>
            <p className="text-white/70 text-center text-sm sm:text-base mb-2">Niveles A1 a C1, certificación Cambridge, club de conversación y business English.</p>
            <Link href="/sign-in" className="mt-auto px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-black font-bold text-base sm:text-lg shadow-lg border-2 border-yellow-400/40 hover:scale-105 hover:shadow-2xl transition-all duration-300 glow-yellow">
              Inscribirme
            </Link>
          </div>
        </div>
      </section>

      {/* EXCELENCIA mejorado */}
      <section id="excelencia" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">¿Por qué <span className="text-yellow-400">San Pablo</span>?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 w-full max-w-5xl mt-10">
          <div className="flex flex-col items-center text-center gap-3 hover-lift" data-animate="scale" style={{animationDelay: '100ms'}}>
            <span className="bg-green-500/20 p-4 rounded-full mb-2 animate-pulse-glow">
              <CheckCircle size={32} className="text-green-400" />
            </span>
            <span className="font-semibold text-white">Certificación SENA</span>
            <span className="text-white/60 text-sm sm:text-base">Títulos 100% avalados a nivel nacional.</span>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3 hover-lift" data-animate="scale" style={{animationDelay: '200ms'}}>
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2 animate-pulse-glow">
              <Award size={32} className="text-yellow-400" />
            </span>
            <span className="font-semibold text-white">Docentes Expertos</span>
            <span className="text-white/60 text-sm sm:text-base">Profesionales con experiencia real y vocación.</span>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3 hover-lift" data-animate="scale" style={{animationDelay: '300ms'}}>
            <span className="bg-green-500/20 p-4 rounded-full mb-2 animate-pulse-glow">
              <TrendingUp size={32} className="text-green-400" />
            </span>
            <span className="font-semibold text-white">Alta Empleabilidad</span>
            <span className="text-white/60 text-sm sm:text-base">95% de nuestros egresados consiguen empleo.</span>
          </div>
          
          <div className="flex flex-col items-center text-center gap-3 hover-lift" data-animate="scale" style={{animationDelay: '400ms'}}>
            <span className="bg-yellow-400/20 p-4 rounded-full mb-2 animate-pulse-glow">
              <Heart size={32} className="text-yellow-400" />
            </span>
            <span className="font-semibold text-white">Comunidad Vibrante</span>
            <span className="text-white/60 text-sm sm:text-base">Ambiente de apoyo y crecimiento personal.</span>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS mejorado */}
      <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Testimonios</h2>
        </div>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 w-full max-w-6xl mt-10">
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-6 sm:p-8 gap-4 glass-effect-dark hover:scale-105 transition-all duration-500 group" data-animate="fade-up" style={{animationDelay: '100ms'}}>
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden border-4 border-green-400/40 mb-2 group-hover:border-green-400/80 transition-all duration-300">
              <Image src="/imagen-id5.jpg" alt="Ana María López" fill style={{objectFit:'cover'}} className="rounded-full group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-white text-base sm:text-lg">Ana María López</span>
            <span className="text-white/60 text-sm sm:text-base text-center">"Gracias al Instituto San Pablo, hoy tengo mi propio jardín infantil. La formación fue integral y muy práctica."</span>
            <div className="flex gap-1 mt-2">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg sm:text-xl animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>★</span>
              ))}
            </div>
          </div>
          
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-yellow-400/30 flex flex-col items-center p-6 sm:p-8 gap-4 glass-effect-dark hover:scale-105 transition-all duration-500 group" data-animate="fade-up" style={{animationDelay: '200ms'}}>
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden border-4 border-yellow-400/40 mb-2 group-hover:border-yellow-400/80 transition-all duration-300">
              <Image src="/imagen-id6.jpg" alt="Carlos J. Herrera" fill style={{objectFit:'cover'}} className="rounded-full group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-white text-base sm:text-lg">Carlos J. Herrera</span>
            <span className="text-white/60 text-sm sm:text-base text-center">"El nivel de inglés que alcancé me abrió puertas a un mejor empleo. Los profesores son excelentes y muy dedicados."</span>
            <div className="flex gap-1 mt-2">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg sm:text-xl animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>★</span>
              ))}
            </div>
          </div>
          
          <div className="bg-black/80 rounded-2xl shadow-2xl border-4 border-green-400/30 flex flex-col items-center p-6 sm:p-8 gap-4 glass-effect-dark hover:scale-105 transition-all duration-500 group md:col-span-2 lg:col-span-1" data-animate="fade-up" style={{animationDelay: '300ms'}}>
            <div className="relative w-20 sm:w-24 h-20 sm:h-24 rounded-full overflow-hidden border-4 border-green-400/40 mb-2 group-hover:border-green-400/80 transition-all duration-300">
              <Image src="/imagen-id7.jpg" alt="Sofía Vargas" fill style={{objectFit:'cover'}} className="rounded-full group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="font-semibold text-white text-base sm:text-lg">Sofía Vargas</span>
            <span className="text-white/60 text-sm sm:text-base text-center">"Los cursos de desarrollo profesional me dieron las herramientas exactas que necesitaba para ascender en mi empresa. ¡Totalmente recomendado!"</span>
            <div className="flex gap-1 mt-2">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-yellow-400 text-lg sm:text-xl animate-scale-in" style={{animationDelay: `${i * 100}ms`}}>★</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO mejorado */}
      <section id="contacto" className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center">
        <div className="text-center mb-12" data-animate="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8">¿Preguntas? <span className="text-green-400">Contáctanos</span></h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 w-full max-w-5xl mt-10 items-center justify-center">
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-6 sm:p-8 shadow-lg border border-green-400/20 w-full lg:w-1/3 glass-effect-dark hover:scale-105 transition-all duration-500" data-animate="fade-right">
            <MapPin size={32} className="text-green-400 mb-2 animate-pulse-glow" />
            <span className="text-white/90 text-base sm:text-lg font-semibold text-center">
              Carrera 12 #18-15, Centro<br />Pereira, Risaralda, Colombia
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-6 sm:p-8 shadow-lg border border-yellow-400/20 w-full lg:w-1/3 glass-effect-dark hover:scale-105 transition-all duration-500" data-animate="fade-up">
            <Phone size={32} className="text-yellow-400 mb-2 animate-pulse-glow" />
            <span className="text-white/90 text-base sm:text-lg font-semibold text-center">
              (606) 335-2847<br />WhatsApp: +57 314 567-8910
            </span>
            <a href="https://wa.me/573145678910" target="_blank" rel="noopener noreferrer" className="mt-2 w-full text-center">
              <span className="inline-block w-full px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 text-black font-bold text-base sm:text-lg shadow-lg border-2 border-green-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-300 glow-green">
                Chatear por WhatsApp
              </span>
            </a>
          </div>
          
          <div className="flex flex-col items-center gap-3 bg-black/70 rounded-2xl p-6 sm:p-8 shadow-lg border border-green-400/20 w-full lg:w-1/3 glass-effect-dark hover:scale-105 transition-all duration-500" data-animate="fade-left">
            <Mail size={32} className="text-green-400 mb-2 animate-pulse-glow" />
            <span className="text-white/90 text-base sm:text-lg font-semibold text-center">
              info@institutosanpablo.edu.co<br />admisiones@institutosanpablo.edu.co
            </span>
            <a href="mailto:admisiones@institutosanpablo.edu.co" className="mt-2 w-full text-center">
              <span className="inline-block w-full px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-green-400 text-black font-bold text-base sm:text-lg shadow-lg border-2 border-yellow-400/40 hover:scale-110 hover:shadow-2xl transition-all duration-300 glow-yellow">
                Enviar Email
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Misión, Visión y Decretos mejorado */}
      <section className="w-full bg-black/95 border-t border-green-400/20 py-12 sm:py-16 px-4 mt-12">
        <div className="container mx-auto max-w-5xl grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
          <div data-animate="fade-up" style={{animationDelay: '100ms'}}>
            <h3 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">Misión</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Formar técnicos integrales, éticos y competentes, comprometidos con el desarrollo social y laboral de la región, brindando educación de calidad y valores humanos.
            </p>
          </div>
          
          <div data-animate="fade-up" style={{animationDelay: '200ms'}}>
            <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4">Visión</h3>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Ser el instituto líder en formación técnica en Pereira, reconocido por la excelencia académica, la innovación y el impacto positivo en la comunidad.
            </p>
          </div>
          
          <div data-animate="fade-up" style={{animationDelay: '300ms'}} className="md:col-span-2 lg:col-span-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">Decretos y Normatividad</h3>
            <ul className="text-white/70 text-sm sm:text-base leading-relaxed list-disc list-inside space-y-2">
              <li>Resolución 1234 de 2010 - Secretaría de Educación de Pereira</li>
              <li>Registro SENA No. 5678</li>
              <li>Normas de convivencia y ética institucional</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER mejorado */}
      <footer className="w-full py-6 sm:py-8 bg-black/90 border-t border-green-400/20 text-center text-white/60 text-sm sm:text-base">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2" data-animate="fade-right">
            <Image src="/logo-sanpablo.jpg" alt="Logo" width={28} height={28} className="rounded animate-pulse-glow" />
            <span>Instituto San Pablo</span>
          </div>
          
          <div data-animate="fade-up">
            © {new Date().getFullYear()} Instituto San Pablo. Todos los derechos reservados.
          </div>
          
          <div className="flex gap-4" data-animate="fade-left">
            <a href="https://wa.me/573145678910" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors duration-300">
              WhatsApp
            </a>
            <a href="mailto:info@institutosanpablo.edu.co" className="hover:text-yellow-400 transition-colors duration-300">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 