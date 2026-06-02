"use client";

import Link from "next/link";
import {
  Search,
  MapPin,
  Bell,
  Users,
  Eye,
  Share2,
  Shield,
  ChevronRight,
  ArrowRight,
  Heart,
  Camera,
  Smartphone,
  PawPrint,
  Clock,
  MessageCircle,
} from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Counter } from "@/components/Counter";
import { PetCard } from "@/components/PetCard";
import { mockPets, successStories, stats } from "@/lib/mock-data";

export default function Home() {
  return (
    <>
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231a5c6b' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-[fadeInLeft_0.8s_ease_forwards]">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-petrol/10 text-sm text-petrol font-medium mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-hope animate-pulse" />
                2.847 mascotas reunidas con sus familias
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] text-balance mb-6">
                Porque cada mascota merece{" "}
                <span className="text-petrol">volver a casa</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-lg mb-8">
                La red colaborativa para encontrar mascotas perdidas mediante
                comunidad, geolocalizacion e inteligencia colectiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/buscar"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-petrol rounded-2xl hover:bg-petrol-dark transition-all shadow-lg shadow-petrol/20 hover:shadow-xl hover:shadow-petrol/30 hover:-translate-y-0.5"
                >
                  <Search className="w-5 h-5" />
                  Buscar mascota
                </Link>
                <Link
                  href="/reportar"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-petrol bg-white rounded-2xl border-2 border-petrol/20 hover:border-petrol/40 hover:bg-petrol-light transition-all"
                >
                  <PawPrint className="w-5 h-5" />
                  Reportar mascota perdida
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-petrol-light to-hope-light"
                      style={{
                        backgroundImage: `url(https://i.pravatar.cc/80?img=${i + 10})`,
                        backgroundSize: "cover",
                      }}
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    15.200+ usuarios activos
                  </p>
                  <p className="text-xs text-gray-500">
                    Comunidad creciendo cada dia
                  </p>
                </div>
              </div>
            </div>

            <div className="relative animate-[fadeInRight_0.8s_ease_0.2s_forwards]" style={{ opacity: 0 }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-petrol/10 aspect-[4/3]">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-hope/20 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-hope" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Max volvio a casa!
                      </p>
                      <p className="text-xs text-gray-500">
                        Reencontrado despues de 12 dias gracias a la comunidad
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass rounded-2xl p-3 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-warm/20 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-warm" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      Nuevo avistamiento
                    </p>
                    <p className="text-[10px] text-gray-500">Hace 2 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 glass rounded-2xl p-3 shadow-lg animate-float" style={{ animationDelay: '1s', animationDuration: '5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-petrol/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-petrol" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      3 mascotas cerca
                    </p>
                    <p className="text-[10px] text-gray-500">En tu zona</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="py-16 border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedCard key={stat.label} delay={i * 0.1} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-petrol">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-petrol uppercase tracking-wider mb-3">
              Facil y rapido
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
              Como funciona VuelveACasa
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Tres pasos simples para comenzar la busqueda de tu mascota
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "1. Publica tu reporte",
                desc: "Sube fotos, descripcion y la ubicacion donde se perdio tu mascota. Cuanta mas informacion, mejor.",
                color: "petrol",
              },
              {
                icon: Users,
                title: "2. La comunidad ayuda",
                desc: "Miles de usuarios reciben alertas y reportan avistamientos en tiempo real con fotos y ubicacion GPS.",
                color: "hope",
              },
              {
                icon: Heart,
                title: "3. Reencuentro",
                desc: "Gracias a la inteligencia colectiva y el mapa de avistamientos, tu mascota vuelve a casa.",
                color: "warm",
              },
            ].map((step, i) => (
              <AnimatedCard key={step.title} delay={i * 0.15}>
                <div className="relative bg-gray-50 rounded-3xl p-8 h-full border border-gray-100 hover:border-petrol/20 hover:shadow-lg transition-all duration-300 group">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      step.color === "petrol"
                        ? "bg-petrol/10"
                        : step.color === "hope"
                        ? "bg-hope/10"
                        : "bg-warm/10"
                    }`}
                  >
                    <step.icon
                      className={`w-7 h-7 ${
                        step.color === "petrol"
                          ? "text-petrol"
                          : step.color === "hope"
                          ? "text-hope"
                          : "text-warm"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-petrol transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== RECENT PETS ==================== */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-sm font-semibold text-petrol uppercase tracking-wider mb-3">
                Publicaciones recientes
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Mascotas que necesitan tu ayuda
              </h2>
            </div>
            <Link
              href="/buscar"
              className="inline-flex items-center gap-1 text-sm font-semibold text-petrol hover:text-petrol-dark transition-colors"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPets.slice(0, 6).map((pet, i) => (
              <PetCard key={pet.id} pet={pet} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-petrol uppercase tracking-wider mb-3">
              Funcionalidades
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
              Todo lo que necesitas para encontrar a tu mascota
            </h2>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Mapa interactivo",
                desc: "Visualiza mascotas perdidas y avistamientos en un mapa en tiempo real con zonas calientes.",
              },
              {
                icon: Bell,
                title: "Alertas inteligentes",
                desc: "Recibe notificaciones cuando se publica una mascota cerca de ti o hay coincidencias visuales.",
              },
              {
                icon: Eye,
                title: "Sistema de avistamientos",
                desc: "Cualquier persona puede reportar un avistamiento con foto, video y ubicacion GPS exacta.",
              },
              {
                icon: Share2,
                title: "Compartir en redes",
                desc: "Difunde en WhatsApp, Instagram, Facebook, X y Telegram con un solo clic.",
              },
              {
                icon: Shield,
                title: "Verificacion de identidad",
                desc: "Perfiles verificados con RUT para garantizar la seguridad de duenos y mascotas.",
              },
              {
                icon: Smartphone,
                title: "Mobile first",
                desc: "Disenado para usar desde tu celular. Reporta y busca desde cualquier lugar.",
              },
            ].map((feature, i) => (
              <AnimatedCard key={feature.title} delay={i * 0.1}>
                <div className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-petrol/20 hover:shadow-md transition-all duration-300 h-full group">
                  <div className="w-11 h-11 rounded-xl bg-petrol/5 flex items-center justify-center flex-shrink-0 group-hover:bg-petrol/10 transition-colors">
                    <feature.icon className="w-5 h-5 text-petrol" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-petrol transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SUCCESS STORIES ==================== */}
      <section id="historias" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-hope uppercase tracking-wider mb-3">
              Historias reales
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance">
              Reencuentros que nos emocionan
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Cada reencuentro es una historia de esperanza, comunidad y amor
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <AnimatedCard key={story.id} delay={i * 0.15}>
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-12 h-12 rounded-full bg-gray-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${story.image})` }}
                    />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {story.ownerName}
                      </p>
                      <p className="text-xs text-gray-500">{story.city}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-hope bg-hope-light px-2.5 py-1 rounded-full">
                        <Heart className="w-3 h-3" />
                        Reunido
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed flex-1 text-sm italic">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg bg-gray-100 bg-cover bg-center"
                        style={{ backgroundImage: `url(${story.petImage})` }}
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {story.petName}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {story.days} dias perdido/a
                    </span>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== MAP PREVIEW ==================== */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <p className="text-sm font-semibold text-petrol uppercase tracking-wider mb-3">
                Mapa interactivo
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-balance mb-6">
                Encuentra mascotas cerca de ti en tiempo real
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                Nuestro mapa muestra todas las mascotas perdidas, encontradas y
                los avistamientos reportados por la comunidad. Identifica zonas
                calientes y ayuda a reunir familias.
              </p>
              <div className="space-y-4">
                {[
                  { icon: MapPin, text: "Mascotas perdidas y encontradas geo-referenciadas" },
                  { icon: Eye, text: "Avistamientos en tiempo real de la comunidad" },
                  { icon: Bell, text: "Alertas automaticas por proximidad" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-petrol/5 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4 h-4 text-petrol" />
                    </div>
                    <span className="text-gray-600">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/mapa"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-md"
              >
                Explorar mapa <ArrowRight className="w-4 h-4" />
              </Link>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-petrol/5 border border-gray-100">
                <div className="aspect-[4/3] bg-petrol-light relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-petrol/30 mx-auto mb-4" />
                      <p className="text-petrol/50 font-medium">
                        Mapa interactivo
                      </p>
                      <p className="text-sm text-petrol/30 mt-1">
                        Google Maps integration
                      </p>
                    </div>
                  </div>
                  {/* Map pins simulation */}
                  {[
                    { top: "20%", left: "30%", color: "bg-red-500" },
                    { top: "45%", left: "60%", color: "bg-red-500" },
                    { top: "60%", left: "25%", color: "bg-amber-500" },
                    { top: "35%", left: "70%", color: "bg-hope" },
                    { top: "70%", left: "50%", color: "bg-red-500" },
                  ].map((pin, i) => (
                    <div
                      key={i}
                      className="absolute"
                      style={{ top: pin.top, left: pin.left }}
                    >
                      <div className={`w-4 h-4 ${pin.color} rounded-full shadow-lg`}>
                        <div className={`w-4 h-4 ${pin.color} rounded-full animate-ping opacity-30`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 bg-petrol relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-sm text-white/90 font-medium mb-6 backdrop-blur-sm border border-white/10">
              <PawPrint className="w-4 h-4" />
              Unete a la comunidad
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-balance mb-6">
              Ayuda a reunir familias. Cada avistamiento cuenta.
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
              No necesitas tener una mascota perdida para hacer la diferencia.
              Reporta avistamientos, comparte publicaciones y se parte de la red
              que esta cambiando vidas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/reportar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-petrol bg-white rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Reportar mascota
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/buscar"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl border-2 border-white/30 hover:bg-white/10 transition-all"
              >
                Explorar mascotas
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ==================== PARTNERS ==================== */}
      <section id="ongs" className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Trabajan con nosotros
            </p>
          </AnimatedSection>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-40">
            {[
              "Fundacion Adopta",
              "Veterinaria SurVet",
              "ONG PatitasFelices",
              "Clinica Animal",
              "RedAnimal Chile",
              "Municipalidad",
            ].map((name) => (
              <AnimatedCard key={name}>
                <div className="text-lg font-semibold text-gray-900 tracking-tight">
                  {name}
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section id="faq" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-semibold text-petrol uppercase tracking-wider mb-3">
              FAQ
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Preguntas frecuentes
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              {
                q: "Es gratis usar VuelveACasa?",
                a: "Si, completamente. Publicar reportes, buscar mascotas y reportar avistamientos es 100% gratuito para toda la comunidad.",
              },
              {
                q: "Como funciona el sistema de avistamientos?",
                a: "Cualquier usuario puede reportar que vio una mascota perdida. Solo necesita tomar una foto, permitir acceso a su ubicacion y enviar el reporte. El dueno recibe la notificacion al instante.",
              },
              {
                q: "Necesito verificar mi identidad?",
                a: "Para publicar un reporte de mascota perdida necesitas verificar tu perfil con RUT. Esto protege a las mascotas y genera confianza en la comunidad.",
              },
              {
                q: "Puedo usar VuelveACasa desde el celular?",
                a: "Si, la plataforma esta disenada mobile-first. Funciona perfectamente desde cualquier smartphone sin necesidad de descargar una app.",
              },
              {
                q: "En que ciudades esta disponible?",
                a: "VuelveACasa esta disponible en todo Chile y pronto en mas paises de Latinoamerica. La comunidad crece cada dia.",
              },
            ].map((item, i) => (
              <AnimatedCard key={i} delay={i * 0.08}>
                <details className="group bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900 pr-4">
                      {item.q}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-500 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
