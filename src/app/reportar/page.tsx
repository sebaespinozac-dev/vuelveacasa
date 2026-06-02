"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  MapPin,
  Upload,
  PawPrint,
  Info,
  ChevronRight,
  CheckCircle,
  Loader2,
  X,
} from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type ReportType = "lost" | "found";

interface FormData {
  name: string;
  species: string;
  breed: string;
  color: string;
  description: string;
  date: string;
  reward: string;
  location: string;
  lat: number | null;
  lng: number | null;
  contactName: string;
  contactPhone: string;
  terms: boolean;
}

const INITIAL_FORM: FormData = {
  name: "",
  species: "",
  breed: "",
  color: "",
  description: "",
  date: "",
  reward: "",
  location: "",
  lat: null,
  lng: null,
  contactName: "",
  contactPhone: "",
  terms: false,
};

export default function ReportarPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [reportType, setReportType] = useState<ReportType>("lost");
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        contactName: profile.display_name ?? "",
        contactPhone: profile.phone ?? "",
      }));
    }
  }, [profile]);

  function set(field: keyof FormData, value: string | boolean | number | null) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function removePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function useGPS() {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        set("lat", pos.coords.latitude);
        set("lng", pos.coords.longitude);
        set("location", `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setGpsLoading(false);
      },
      () => setGpsLoading(false)
    );
  }

  async function handleSubmit() {
    if (!user) return;
    if (!form.terms) { setError("Debes aceptar los terminos de uso."); return; }
    setSubmitting(true);
    setError(null);

    try {
      let photoUrl: string | null = null;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("pet-photos")
          .upload(path, photoFile, { upsert: false });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("pet-photos")
          .getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from("pets")
        .insert({
          owner_id: user.id,
          name: form.name.trim(),
          species: form.species,
          breed: form.breed.trim() || null,
          color: form.color.trim() || null,
          status: reportType === "lost" ? "lost" : "found",
          location: form.location.trim() || null,
          lat: form.lat,
          lng: form.lng,
          description: form.description.trim() || null,
          photo_url: photoUrl,
          reward: form.reward.trim() || null,
          contact_name: form.contactName.trim() || null,
          contact_phone: form.contactPhone.trim() || null,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setSubmitted(true);
      setTimeout(() => router.push(`/mascota/${data.id}`), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrio un error. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-petrol animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-hope mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reporte publicado</h2>
          <p className="text-gray-500">Redirigiendo al reporte...</p>
        </div>
      </div>
    );
  }

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
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Ej: Luna, Rocky, Michi..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especie
                  </label>
                  <select
                    value={form.species}
                    onChange={(e) => set("species", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Ave">Ave</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Raza
                  </label>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => set("breed", e.target.value)}
                    placeholder="Ej: Golden Retriever, Mestizo..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color principal
                  </label>
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                    placeholder="Ej: Dorado, Negro..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de {reportType === "lost" ? "perdida" : "hallazgo"}
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripcion detallada
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe caracteristicas unicas: collar, manchas, cicatrices, comportamiento, microchip..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400 resize-none"
                />
              </div>

              {reportType === "lost" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Recompensa (opcional)
                  </label>
                  <input
                    type="text"
                    value={form.reward}
                    onChange={(e) => set("reward", e.target.value)}
                    placeholder="Ej: $50.000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    if (!form.name.trim() || !form.species) {
                      setError("Nombre y especie son obligatorios.");
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-petrol rounded-xl hover:bg-petrol-dark transition-all shadow-md"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            </div>
          </AnimatedSection>
        )}

        {/* Step 2: Photos & Location */}
        {step === 2 && (
          <AnimatedSection>
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Fotografia principal
                </label>
                {photoPreview ? (
                  <div className="relative w-40 h-40">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-2xl border border-gray-200"
                    />
                    <button
                      onClick={removePhoto}
                      className="absolute top-2 right-2 p-1 rounded-full bg-white shadow text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 hover:border-petrol/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-petrol-light/50 group">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-petrol transition-colors" />
                    <span className="text-xs text-gray-400 group-hover:text-petrol transition-colors text-center px-2">
                      Subir foto
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Sube una foto clara y reciente. Max 5 MB.
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
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="Escribe una direccion o usa GPS..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              {form.lat && form.lng && (
                <p className="text-xs text-petrol flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  GPS: {form.lat.toFixed(4)}, {form.lng.toFixed(4)}
                </p>
              )}

              <button
                onClick={useGPS}
                disabled={gpsLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-petrol/20 text-sm font-medium text-petrol bg-petrol-light hover:bg-petrol/10 transition-all disabled:opacity-50"
              >
                {gpsLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
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
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de contacto
                  </label>
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => set("contactPhone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Email de contacto: <span className="font-medium text-gray-700">{user.email}</span>
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.terms}
                    onChange={(e) => set("terms", e.target.checked)}
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
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-hope rounded-xl hover:bg-hope/90 transition-all shadow-lg shadow-hope/20 disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <PawPrint className="w-4 h-4" />
                  )}
                  {submitting ? "Publicando..." : "Publicar reporte"}
                </button>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
