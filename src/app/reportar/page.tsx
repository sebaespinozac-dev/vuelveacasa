"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Upload,
  PawPrint,
  Info,
  ChevronRight,
  Dog,
  Cat,
  Bird,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";

type ReportType = "lost" | "found";

export default function ReportarPage() {
  const [reportType, setReportType] = useState<ReportType>("lost");
  const [step, setStep] = useState(1);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Reportar mascota
          </h1>
          <p className="text-gray-500">
            Completa la informacion para ayudarnos a encontrar a tu mascota
          </p>
        </AnimatedSection>

        {/* Report Type Toggle */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-1.5 flex">
            <button
              onClick={() => setReportType("lost")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                reportType === "lost"
                  ? "bg-petrol text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <PawPrint className="w-4 h-4" />
              Perdi mi mascota
            </button>
            <button
              onClick={() => setReportType("found")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                reportType === "found"
                  ? "bg-petrol text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <PawPrint className="w-4 h-4" />
              Encontre una mascota
            </button>
          </div>
        </AnimatedSection>

        {/* Step Indicator */}
        <AnimatedSection delay={0.15} className="mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    s <= step
                      ? "bg-petrol text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    s <= step ? "text-petrol" : "text-gray-400"
                  }`}
                >
                  {s === 1
                    ? "Datos basicos"
                    : s === 2
                    ? "Fotos y ubicacion"
                    : "Contacto"}
                </span>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 rounded ${
                      s < step ? "bg-petrol" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <AnimatedSection delay={0.2}>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de la mascota
                </label>
                <input
                  type="text"
                  placeholder="Ej: Luna, Rocky, Michi..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especie
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600">
                    <option>Seleccionar...</option>
                    <option>Perro</option>
                    <option>Gato</option>
                    <option>Ave</option>
                    <option>Conejo</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Raza
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Golden Retriever, Mestizo..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sexo
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600">
                    <option>Seleccionar...</option>
                    <option>Macho</option>
                    <option>Hembra</option>
                    <option>No se</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Edad aproximada
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 3 anos"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color principal
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Dorado, Negro..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripcion detallada
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe caracteristicas unicas: collar, manchas, cicatrices, comportamiento, microchip..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de {reportType === "lost" ? "perdida" : "hallazgo"}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora aproximada
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600"
                  />
                </div>
              </div>

              {reportType === "lost" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recompensa (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: $50.000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-md"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Step 2: Photos & Location */}
        {step === 2 && (
          <AnimatedSection>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Fotografias de la mascota
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <label
                      key={i}
                      className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-petrol/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-petrol-light/50 group"
                    >
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-petrol transition-colors" />
                      <span className="text-xs text-gray-400 group-hover:text-petrol transition-colors">
                        {i === 0 ? "Principal" : `Foto ${i + 1}`}
                      </span>
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Sube fotos claras y recientes. Maximo 4 fotos.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Direccion donde se {reportType === "lost" ? "perdio" : "encontro"}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Escribe una direccion o usa GPS..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <div className="aspect-[16/9] bg-petrol-light flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-10 h-10 text-petrol/30 mx-auto mb-2" />
                    <p className="text-sm text-petrol/50 font-medium">
                      Mapa interactivo
                    </p>
                    <p className="text-xs text-petrol/30">
                      Arrastra el pin para marcar la ubicacion exacta
                    </p>
                  </div>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-petrol/20 text-sm font-medium text-petrol bg-petrol-light hover:bg-petrol/10 transition-all">
                <MapPin className="w-4 h-4" />
                Usar mi ubicacion actual
              </button>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Atras
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-md"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <AnimatedSection>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div className="p-4 rounded-xl bg-petrol-light border border-petrol/10">
                <p className="text-sm text-petrol flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Estos datos se usan para que la comunidad pueda contactarte.
                  Tu RUT solo es visible para fines de verificacion.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    RUT
                  </label>
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    placeholder="+56 9 1234 5678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo electronico
                  </label>
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-petrol focus:ring-petrol"
                  />
                  <span className="text-sm text-gray-600">
                    Acepto los{" "}
                    <a href="/terminos" className="text-petrol font-medium hover:underline">
                      terminos de uso
                    </a>{" "}
                    y la{" "}
                    <a href="/privacidad" className="text-petrol font-medium hover:underline">
                      politica de privacidad
                    </a>
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Atras
                </button>
                <button className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-hope rounded-xl hover:bg-hope/90 transition-all shadow-lg shadow-hope/20">
                  <PawPrint className="w-4 h-4" />
                  Publicar reporte
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
