"use client";

import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Shield,
  PawPrint,
  Edit,
  Plus,
  Eye,
  Clock,
  Settings,
  Bell,
} from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { mockPets } from "@/lib/mock-data";

export default function PerfilPage() {
  const myPets = mockPets.slice(0, 3);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <AnimatedSection className="mb-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-32 sm:h-44 bg-gradient-to-r from-petrol to-petrol-dark relative">
              <button className="absolute top-4 right-4 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 sm:px-8 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-petrol-light border-4 border-white shadow-lg flex items-center justify-center">
                    <User className="w-10 h-10 sm:w-14 sm:h-14 text-petrol/40" />
                  </div>
                  <button className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-petrol text-white hover:bg-petrol-dark transition-all shadow-md">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 sm:pt-0 sm:pb-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        Juan Rodriguez
                      </h1>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-petrol/10 text-petrol text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Verificado
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        Santiago, Chile
                      </span>
                      <span className="flex items-center gap-1">
                        <PawPrint className="w-3.5 h-3.5" />
                        3 mascotas
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <Settings className="w-4 h-4" />
                      Ajustes
                    </button>
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-sm">
                      <Edit className="w-4 h-4" />
                      Editar perfil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Informacion personal
                </h3>
                <div className="space-y-3">
                  {[
                    { icon: Phone, label: "+56 9 1234 5678" },
                    { icon: Mail, label: "juan@correo.com" },
                    { icon: MapPin, label: "Providencia, Santiago" },
                    { icon: Shield, label: "RUT verificado" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 text-sm text-gray-600">
                      <item.icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Estadisticas
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "3", label: "Mascotas" },
                    { value: "1", label: "Perdidas" },
                    { value: "8", label: "Avistamientos" },
                    { value: "2", label: "Reunidas" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl bg-gray-50">
                      <p className="text-lg font-bold text-petrol">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Notificaciones
                  </h3>
                  <Bell className="w-4 h-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {[
                    "Nuevo avistamiento de Luna",
                    "Mascota similar encontrada cerca",
                    "Tu reporte fue compartido 15 veces",
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-2 h-2 rounded-full bg-petrol mt-1.5 flex-shrink-0" />
                      {notif}
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection delay={0.1}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Mis mascotas
                </h2>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-petrol bg-petrol-light rounded-xl hover:bg-petrol/10 transition-all">
                  <Plus className="w-4 h-4" />
                  Agregar mascota
                </button>
              </div>
            </AnimatedSection>

            <div className="grid sm:grid-cols-2 gap-4">
              {myPets.map((pet, i) => (
                <AnimatedCard key={pet.id} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex">
                      <div
                        className="w-28 bg-cover bg-center flex-shrink-0"
                        style={{ backgroundImage: `url(${pet.image})` }}
                      />
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                              {pet.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {pet.species} &middot; {pet.breed}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              pet.status === "lost"
                                ? "bg-red-50 text-red-600"
                                : pet.status === "found"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-green-50 text-hope"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                pet.status === "lost"
                                  ? "bg-red-500"
                                  : pet.status === "found"
                                  ? "bg-amber-500"
                                  : "bg-hope"
                              }`}
                            />
                            {pet.status === "lost"
                              ? "Perdido"
                              : pet.status === "found"
                              ? "Encontrado"
                              : "Reunido"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {pet.sightings}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pet.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}

              <AnimatedCard delay={0.3}>
                <button className="w-full h-full min-h-[120px] bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-petrol/30 hover:bg-petrol-light/30 transition-all flex flex-col items-center justify-center gap-2 group">
                  <Plus className="w-8 h-8 text-gray-300 group-hover:text-petrol transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-petrol font-medium transition-colors">
                    Agregar mascota
                  </span>
                </button>
              </AnimatedCard>
            </div>

            {/* Activity */}
            <AnimatedSection delay={0.2}>
              <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">
                Actividad reciente
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                {[
                  {
                    action: "Reporto la perdida de Luna",
                    time: "Hace 2 dias",
                    icon: PawPrint,
                  },
                  {
                    action: "Recibio un avistamiento de Luna",
                    time: "Hace 1 dia",
                    icon: Eye,
                  },
                  {
                    action: "Compartio el reporte de Rocky",
                    time: "Hace 3 dias",
                    icon: Phone,
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-4">
                    <div className="w-9 h-9 rounded-xl bg-petrol/5 flex items-center justify-center flex-shrink-0">
                      <activity.icon className="w-4 h-4 text-petrol" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.action}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
