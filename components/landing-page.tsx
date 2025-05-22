"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BookOpen, Globe, Users, CheckCircle, Menu, X, BarChart, Play } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="font-sans text-white bg-black overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/95 shadow-lg py-3" : "bg-black/80 backdrop-blur-md py-5"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="text-2xl font-extrabold relative z-50">
            <span className="text-white">San</span>
            <span className="text-yellow-400 relative">
              Pablo
              <span className="absolute w-2 h-2 bg-green-500 rounded-full top-0 -right-2"></span>
            </span>
          </div>

          <button
            className="md:hidden text-white p-2 focus:outline-none z-50"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav
            className={`fixed md:relative top-0 ${
              isMenuOpen ? "right-0" : "-right-full"
            } md:right-0 w-full md:w-auto h-screen md:h-auto bg-black/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none flex flex-col md:flex-row items-center justify-center md:justify-between p-8 md:p-0 transition-all duration-300 ease-in-out z-40 md:z-auto shadow-2xl md:shadow-none`}
          >
            <ul className="flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8 mb-10 md:mb-0">
              <li>
                <Link
                  href="#features"
                  className="text-white hover:text-yellow-400 relative group transition-colors duration-300 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Caracteristicas
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#programs"
                  className="text-white hover:text-yellow-400 relative group transition-colors duration-300 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Programas
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-white hover:text-yellow-400 relative group transition-colors duration-300 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimoniales
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-white hover:text-yellow-400 relative group transition-colors duration-300 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                </Link>
              </li>
            </ul>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
              <Link
                href="/sign-in"
                className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 text-center transform hover:-translate-y-1 hover:shadow-[0_7px_14px_rgba(255,222,0,0.3)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión 
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,222,0,0.08)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(46,204,113,0.05),transparent_70%)]"></div>

        {/* Animated Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-yellow-400/10 animate-float hidden md:block"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-green-500/5 animate-float-slow hidden md:block"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,222,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-30"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4 px-4 py-1.5 bg-yellow-400/10 rounded-full border border-yellow-400/20">
                <span className="text-yellow-400 text-sm font-medium">Innovando Tu Aprendizaje</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 relative">
                Transforma Tu Aprendizaje con{" "}
                <span className="text-yellow-400 relative inline-block">
                  SanPablo
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="6"
                    viewBox="0 0 200 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 3C50 0.5 150 0.5 200 3" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Plataforma educativa completa para carreras técnicas, educación temprana y dominio del inglés.
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  href="/sign-in"
                  className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_7px_14px_rgba(255,222,0,0.3)] flex items-center justify-center group"
                >
                  Inicia con nosotros
                  <ArrowRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#programs"
                  className="px-6 py-3 border-2 border-white/20 text-white font-semibold rounded-lg hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300 flex items-center justify-center group"
                >
                  Explora Nuestros Programas
                  <Play size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-10 flex items-center justify-center md:justify-start space-x-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-gray-300 overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=32&width=32&text=${i}`}
                        alt={`User ${i}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="text-yellow-400 font-semibold">2,000+</span> Estudiantes ya están aprendiendo
                </div>
              </div>
            </div>
            <div className="relative mt-8 md:mt-0">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-500/20 rounded-2xl blur-3xl opacity-30 transform -rotate-6"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)] transform perspective-[1000px] rotate-1 hover:rotate-0 transition-transform duration-500 border border-white/10">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="SanPablo LMS Platform"
                  width={800}
                  height={600}
                  priority
                  className="w-full h-auto transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Clases En Vivo</span>
                  </div>
                  <h3 className="text-xl font-bold">Experiencia De Aprendizaje Interactivo</h3>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 bg-yellow-400 text-black font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg transform rotate-6">
                Nuevos Cursos!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 md:py-24 bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-yellow-400/5 animate-float hidden md:block"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-green-500/5 animate-float-slow hidden md:block"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-yellow-400/10 rounded-full border border-yellow-400/20">
              <span className="text-yellow-400 text-sm font-medium">¿Porque nos debes de escoger?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              Poderosas  <span className="text-yellow-400">Herramientas de Aprendizaje</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-300 text-base sm:text-lg px-4">
              Nuestra Plataforma 
              Ofrece Poderosas Herramientas De Aprendizaje
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: <BookOpen size={28} />,
                title: "Plan De Estudios Estructurado",
                description:
                  "Acceda a una amplia gama de cursos estructurados diseñados por expertos en educación con materiales de aprendizaje interactivos",
              },
              {
                icon: <Globe size={28} />,
                title: "Aprendizaje De Idiomas",
                description:
                  "Cursos interactivos con tu profesor y ejercicios practicos",
              },
              {
                icon: <Users size={28} />,
                title: "Aprendizaje Colaborativo",
                description:
                  "Conecta con tus compañeros y tus profesores",
              },
              {
                icon: <BarChart size={28} />,
                title: "Seguimiento de aprendizaje",
                description:
                  "Monitoriza tu aprendizaje con analiticas personales de tu avance",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-black to-zinc-900 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/5 hover:border-yellow-400/20 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="w-14 h-14 bg-yellow-400/10 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-yellow-400 group-hover:text-black group-hover:rounded-full relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-400 relative z-10 leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="relative py-20 md:py-24 bg-zinc-950 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-yellow-400/5 animate-float-slow hidden md:block"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-green-500/5 animate-float hidden md:block"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 relative inline-block">
               Nuestros <span className="text-yellow-400">Programas</span>
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-300 text-base sm:text-lg px-4">
                  Descubre Programas Diseñados Para Tu Éxito
                </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            <div className="bg-gradient-to-br from-black to-zinc-900 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative border border-white/5 group hover:border-yellow-400/20 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-green-500"></div>
              <div className="grid md:grid-cols-2">
                <div className="h-64 sm:h-80 md:h-full overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Early Childhood Education"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-md text-sm">
                    Featured
                  </div>
                </div>
                <div className="p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-yellow-400 relative">
                    Early Childhood Education
                    <div className="h-1 w-16 bg-green-500 mt-3"></div>
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
                    Comprehensive training for educators working with young children, covering development, curriculum
                    planning, and classroom management with hands-on practical techniques.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Child development fundamentals",
                      "Curriculum design techniques",
                      "Classroom management strategies",
                      "Parent communication skills",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-white">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle size={14} className="text-green-500" />
                        </div>
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-in"
                    className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-all duration-300 inline-flex items-center group"
                  >
                    Enroll Now
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-black to-zinc-900 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative border border-white/5 group hover:border-yellow-400/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-green-500"></div>
              <div className="grid md:grid-cols-2">
                <div className="order-1 md:order-2 h-64 sm:h-80 md:h-full overflow-hidden relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="English Language Learning"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-md text-sm">
                    Popular
                  </div>
                </div>
                <div className="order-2 md:order-1 p-6 sm:p-8 md:p-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-yellow-400 relative">
                    English Language Learning
                    <div className="h-1 w-16 bg-green-500 mt-3"></div>
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm sm:text-base">
                    Interactive English programs for all proficiency levels, featuring conversation practice, grammar
                    instruction, cultural context, and personalized learning paths.
                  </p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Conversational English practice",
                      "Grammar and vocabulary building",
                      "Business English modules",
                      "Cultural context and idioms",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center text-white">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                          <CheckCircle size={14} className="text-green-500" />
                        </div>
                        <span className="text-sm sm:text-base">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/sign-in"
                    className="px-6 py-3 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-all duration-300 inline-flex items-center group"
                  >
                    Enroll Now
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 md:py-24 bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-yellow-400/5 animate-float hidden md:block"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-green-500/5 animate-float-slow hidden md:block"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-4 px-4 py-1.5 bg-yellow-400/10 rounded-full border border-yellow-400/20">
              <span className="text-yellow-400 text-sm font-medium">Testimonials</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 relative inline-block">
              What Our <span className="text-yellow-400">Students</span> Say
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-green-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-300 text-base sm:text-lg px-4">Success stories from our community of learners</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote:
                  "SanPablo's early childhood education program transformed my teaching approach. The practical strategies and supportive community made all the difference in my classroom.",
                name: "Maria Rodriguez",
                title: "Preschool Teacher",
              },
              {
                quote:
                  "The English language program helped me gain confidence in my speaking abilities. The interactive lessons and feedback from instructors were invaluable for my career advancement.",
                name: "Carlos Mendez",
                title: "Business Professional",
              },
              {
                quote:
                  "SanPablo offers the perfect blend of theoretical knowledge and practical application. The platform is intuitive and the content is engaging and relevant to real-world scenarios.",
                name: "Sofia Chen",
                title: "Education Student",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-black to-zinc-900 rounded-xl p-6 sm:p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/5 hover:border-yellow-400/20 group relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="relative mb-8">
                  <svg
                    className="absolute top-0 left-0 text-yellow-400/30 w-10 h-10"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4zm12 0c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4z" />
                  </svg>
                  <p className="text-gray-300 italic pl-12 text-sm sm:text-base leading-relaxed">{testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 rounded-full border-2 border-yellow-400 overflow-hidden">
                      <Image
                        src={`/placeholder.svg?height=60&width=60&text=${testimonial.name[0]}`}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -inset-1 border border-yellow-400/50 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-base sm:text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-24 bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,222,0,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-2xl p-8 sm:p-12 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-green-500"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-400/10 rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-green-500/10 rounded-full"></div>

            <div className="text-center relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-green-500 bg-clip-text text-transparent">
                Ready to Transform Your Learning Journey?
              </h2>
              <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of students and educators who have elevated their skills with SanPablo LMS. Start your
                journey today and unlock your full potential.
              </p>
              <Link
                href="/sign-in"
                className="px-8 sm:px-10 py-3 sm:py-4 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_7px_14px_rgba(255,222,0,0.3)] inline-flex items-center justify-center group text-base sm:text-lg"
              >
                Sign In Now
                <ArrowRight size={20} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <div className="mt-6 text-sm text-gray-400">
                New to SanPablo?{" "}
                <Link href="/sign-up" className="text-yellow-400 hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-black pt-16 md:pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,222,0,0.03)_2px,transparent_2px)] bg-[size:30px_30px] opacity-20"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-10 mb-12 md:mb-16">
            <div className="md:col-span-1">
              <div className="text-2xl font-extrabold mb-6">
                <span className="text-white">San</span>
                <span className="text-yellow-400 relative">
                  Pablo
                  <span className="absolute w-2 h-2 bg-green-500 rounded-full top-0 -right-2"></span>
                </span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering educators and learners with innovative technology and comprehensive training programs
                designed for real-world success.
              </p>
              <div className="flex space-x-4">
                {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                  <a
                    key={social}
                    href={`#${social}`}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-yellow-400/20 transition-colors duration-300"
                    aria-label={social}
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/70"></div>
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-2">
              <div>
                <h3 className="text-yellow-400 font-bold text-lg mb-4 relative inline-block">
                  Programs
                  <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-green-500"></span>
                </h3>
                <ul className="space-y-3">
                  {[
                    "Early Childhood Education",
                    "English Language Learning",
                    "Professional Development",
                    "Certification Courses",
                  ].map((item, index) => (
                    <li key={index}>
                      <Link
                        href={`/programs/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 pl-4 relative group"
                      >
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400/50 rounded-full group-hover:bg-yellow-400 transition-colors duration-300"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-400 font-bold text-lg mb-4 relative inline-block">
                  Company
                  <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-green-500"></span>
                </h3>
                <ul className="space-y-3">
                  {["About Us", "Our Team", "Careers", "Contact Us"].map((item, index) => (
                    <li key={index}>
                      <Link
                        href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 pl-4 relative group"
                      >
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400/50 rounded-full group-hover:bg-yellow-400 transition-colors duration-300"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-yellow-400 font-bold text-lg mb-4 relative inline-block">
                  Resources
                  <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-green-500"></span>
                </h3>
                <ul className="space-y-3">
                  {["Blog", "Guides", "Webinars", "Support"].map((item, index) => (
                    <li key={index}>
                      <Link
                        href={`/${item.toLowerCase()}`}
                        className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 pl-4 relative group"
                      >
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-400/50 rounded-full group-hover:bg-yellow-400 transition-colors duration-300"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} SanPablo LMS. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-yellow-400 text-sm transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-yellow-400 text-sm transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Tailwind Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        
        @keyframes float-slow {
          0% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          100% { transform: translateY(0) rotate(0); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}
