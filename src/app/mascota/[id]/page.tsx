"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  Phone,
  X,
  Send,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { useAuth } from "@/lib/auth-context";
import { supabase, type Pet as DbPet, type Sighting } from "@/lib/supabase";
import { mockPets } from "@/lib/mock-data";

const MiniMap = dynamic(() => import("@/components/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="aspect-square bg-petrol-light animate-pulse rounded-xl" />
  ),
});

const statusConfig = {
  lost: {
    label: "Perdido/a",
    bg: "bg-red-50",
    text: "text-red-600",
    dot: "bg-red-500",
  },
  found: {
    label: "Encontrado/a",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  reunited: {
    label: "Reunido!",
    bg: "bg-green-50",
    text: "text-hope",
    dot: "bg-hope",
  },
};

const mockSightings = [
  {
    id: "a1",
    user: "Maria Garcia",
    time: "Hace 2 horas",
    location: "Calle Los Leones 1234",
    comment:
      "Vi un perro parecido corriendo por esta calle. Se veia asustado pero no agresivo.",
    image: null,
  },
  {
    id: "a2",
    user: "Carlos Perez",
    time: "Hace 5 horas",
    location: "Parque Bustamante",
    comment:
      "Creo que es el mismo perro. Estaba cerca de la fuente del parque.",
    image:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
  },
  {
    id: "a3",
    user: "Ana Lopez",
    time: "Ayer 18:30",
    location: "Metro Los Leones",
    comment:
      "Un vecino me dijo que vio un perro parecido en la salida del metro.",
    image: null,
  },
];

type DisplayPet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  status: "lost" | "found" | "reunited";
  location: string;
  date: string;
  image: string;
  reward?: string;
  contactName?: string;
  contactPhone?: string;
  description?: string;
  lat?: number;
  lng?: number;
};

type DisplaySighting = {
  id: string;
  user: string;
  time: string;
  location: string;
  comment: string;
  image: string | null;
};

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  if (diffDays === 1) return "Hace 1 dia";
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
}

export default function MascotaPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [pet, setPet] = useState<DisplayPet | null>(null);
  const [sightings, setSightings] = useState<DisplaySighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFromDb, setIsFromDb] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSightingModal, setShowSightingModal] = useState(false);
  const [sightingLocation, setSightingLocation] = useState("");
  const [sightingNotes, setSightingNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadPet() {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (data && !error) {
        const d = data as DbPet;
        setPet({
          id: d.id,
          name: d.name,
          species: d.species,
          breed: d.breed || "",
          color: d.color || "",
          status: d.status,
          location: d.location || "",
          date: new Date(d.created_at).toLocaleDateString("es-CL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          image: d.photo_url || "",
          reward: d.reward ?? undefined,
          contactName: d.contact_name ?? undefined,
          contactPhone: d.contact_phone ?? undefined,
          description: d.description ?? undefined,
          lat: d.lat ?? undefined,
          lng: d.lng ?? undefined,
        });
        setIsFromDb(true);
        loadSightings(d.id);
      } else {
        const mock = mockPets.find((p) => p.id === id);
        if (mock) {
          setPet({
            id: mock.id,
            name: mock.name,
            species: mock.species,
            breed: mock.breed,
            color: mock.color,
            status: mock.status,
            location: mock.location,
            date: mock.date,
            image: mock.image,
            reward: mock.reward,
            contactName: mock.contactName,
            contactPhone: mock.contactPhone,
          });
          setSightings(mockSightings);
        }
      }
      setLoading(false);
    }
    loadPet();
  }, [id]);

  async function loadSightings(petId: string) {
    const { data } = await supabase
      .from("sightings")
      .select("*")
      .eq("pet_id", petId)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setSightings(
        (data as Sighting[]).map((s) => ({
          id: s.id,
          user: "Usuario",
          time: timeAgo(new Date(s.created_at)),
          location: s.location || "Sin ubicacion",
          comment: s.notes || "",
          image: s.photo_url,
        }))
      );
    }
  }

  useEffect(() => {
    if (!id) return;
    try {
      const favorites = JSON.parse(
        localStorage.getItem("vac-favorites") || "[]"
      );
      setLiked(favorites.includes(id));
    } catch {}
  }, [id]);

  function toggleLike() {
    try {
      const favorites: string[] = JSON.parse(
        localStorage.getItem("vac-favorites") || "[]"
      );
      const next = liked
        ? favorites.filter((f) => f !== id)
        : [...favorites, id];
      localStorage.setItem("vac-favorites", JSON.stringify(next));
      setLiked(!liked);
      notify(liked ? "Eliminado de favoritos" : "Agregado a favoritos");
    } catch {}
  }

  async function handleNativeShare() {
    if (!pet) return;
    const url = window.location.href;
    const text = `Ayudame a encontrar a ${pet.name}! ${pet.species} ${pet.breed} perdido/a en ${pet.location}. #VuelveATuCasa`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.name} - Vuelve a tu Casa`,
          text,
          url,
        });
      } catch {}
    } else {
      shareToNetwork("Copiar");
    }
  }

  function shareToNetwork(network: string) {
    if (!pet) return;
    const url = window.location.href;
    const text = `Ayudame a encontrar a ${pet.name}! ${pet.species} ${pet.breed} perdido/a en ${pet.location}. #VuelveATuCasa`;
    switch (network) {
      case "WhatsApp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
      case "Facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "X":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "Telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "Copiar":
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          notify("Enlace copiado!");
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
  }

  async function submitSighting() {
    if (!sightingLocation.trim() || !sightingNotes.trim()) return;
    setSubmitting(true);

    let lat = 0;
    let lng = 0;
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
        })
      );
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch {}

    const { error } = await supabase.from("sightings").insert({
      pet_id: id,
      reporter_id: user?.id ?? null,
      location: sightingLocation,
      notes: sightingNotes,
      lat,
      lng,
    });

    setSubmitting(false);
    if (!error) {
      notify("Avistamiento reportado! Gracias por tu ayuda");
      setShowSightingModal(false);
      setSightingLocation("");
      setSightingNotes("");
      if (isFromDb) loadSightings(id as string);
    } else {
      notify("Error al reportar. Intenta de nuevo.");
    }
  }

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-32 bg-gray-200 rounded-lg animate-pulse mb-6" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100">
                <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
                <div className="p-8 space-y-4">
                  <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                  <div className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
                <div className="h-5 w-40 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mascota no encontrada
          </h1>
          <p className="text-gray-500 mb-6">
            No pudimos encontrar esta mascota en nuestra base de datos.
          </p>
          <Link
            href="/buscar"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-petrol text-white rounded-xl font-semibold hover:bg-petrol-dark transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a buscar
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[pet.status];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-2xl shadow-2xl">
          {toast}
        </div>
      )}

      {/* Sighting Modal */}
      {showSightingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSightingModal(false)}
          />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Reportar avistamiento
              </h3>
              <button
                onClick={() => setShowSightingModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Donde lo/la viste?
                </label>
                <input
                  type="text"
                  value={sightingLocation}
                  onChange={(e) => setSightingLocation(e.target.value)}
                  placeholder="Ej: Calle Los Leones 1234, Providencia"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Descripcion
                </label>
                <textarea
                  value={sightingNotes}
                  onChange={(e) => setSightingNotes(e.target.value)}
                  placeholder="Describe lo que viste: estado del animal, direccion en la que iba, etc."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            <button
              onClick={submitSighting}
              disabled={
                submitting ||
                !sightingLocation.trim() ||
                !sightingNotes.trim()
              }
              className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 bg-hope text-white font-semibold rounded-xl hover:bg-hope/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {submitting ? "Enviando..." : "Enviar avistamiento"}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-6">
          <Link
            href="/buscar"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-petrol transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a busqueda
          </Link>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection>
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative aspect-[4/3] bg-white">
                  <div
                    className="w-full h-full bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${pet.image})` }}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold ${status.bg} ${status.text}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>
                  {pet.reward && (
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-warm text-white shadow-lg">
                        Recompensa: {pet.reward}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {pet.name}
                      </h1>
                      <p className="text-gray-500 mt-1">
                        {pet.species} &middot; {pet.breed} &middot; {pet.color}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={toggleLike}
                        className={`p-2.5 rounded-xl border transition-all ${
                          liked
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 hover:border-red-200 hover:bg-red-50"
                        } group`}
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            liked
                              ? "text-red-500 fill-red-500"
                              : "text-gray-400 group-hover:text-red-500"
                          }`}
                        />
                      </button>
                      <button
                        onClick={handleNativeShare}
                        className="p-2.5 rounded-xl border border-gray-200 hover:border-petrol/30 hover:bg-petrol-light transition-all group"
                      >
                        <Share2 className="w-5 h-5 text-gray-400 group-hover:text-petrol transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-petrol" />
                      {pet.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-petrol" />
                      {pet.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-petrol" />
                      {sightings.length} avistamientos
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p>
                      {pet.description ||
                        `Se perdio en la zona de ${pet.location}. Es un ${pet.breed.toLowerCase()} de color ${pet.color.toLowerCase()}, muy amigable y responde a su nombre. Llevaba un collar azul con placa de identificacion. Cualquier informacion es valiosa, por favor reportar avistamientos.`}
                    </p>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Compartir en redes
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => shareToNetwork("WhatsApp")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#1fb855] text-white transition-all shadow-sm hover:shadow-md"
                      >
                        WhatsApp
                      </button>
                      <button
                        onClick={() => shareToNetwork("Facebook")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1877F2] hover:bg-[#0d65d9] text-white transition-all shadow-sm hover:shadow-md"
                      >
                        Facebook
                      </button>
                      <button
                        onClick={() => shareToNetwork("X")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-black hover:bg-gray-800 text-white transition-all shadow-sm hover:shadow-md"
                      >
                        X
                      </button>
                      <button
                        onClick={() => shareToNetwork("Telegram")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0088cc] hover:bg-[#006699] text-white transition-all shadow-sm hover:shadow-md"
                      >
                        Telegram
                      </button>
                      <button
                        onClick={() => shareToNetwork("Copiar")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        {copied ? "Copiado!" : "Copiar enlace"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Sightings Timeline */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Avistamientos ({sightings.length})
                  </h2>
                  <button
                    onClick={() => setShowSightingModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-hope rounded-xl hover:bg-hope/90 transition-all shadow-sm hover:shadow-md"
                  >
                    <Eye className="w-4 h-4" />
                    Reportar avistamiento
                  </button>
                </div>

                {sightings.length > 0 ? (
                  <div className="space-y-6">
                    {sightings.map((s, i) => (
                      <AnimatedCard key={s.id} delay={i * 0.1}>
                        <div className="relative pl-8 pb-6 border-l-2 border-gray-100 last:border-l-0 last:pb-0">
                          <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-petrol border-4 border-white" />
                          <div className="mb-2">
                            <p className="text-sm font-semibold text-gray-900">
                              {s.user}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {s.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {s.location}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {s.comment}
                          </p>
                          {s.image && (
                            <div
                              className="mt-3 w-32 h-32 rounded-xl bg-cover bg-center border border-gray-100"
                              style={{ backgroundImage: `url(${s.image})` }}
                            />
                          )}
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Sin avistamientos aun
                    </p>
                    <p className="text-xs text-gray-400">
                      Se el primero en reportar un avistamiento de {pet.name}
                    </p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AnimatedSection delay={0.2}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h3 className="text-base font-bold text-gray-900 mb-4">
                  Contactar al dueno
                </h3>

                {pet.contactName && (
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-full bg-petrol/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-petrol">
                        {pet.contactName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {pet.contactName}
                      </p>
                      <p className="text-xs text-gray-500">Dueno/a</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-5">
                  {pet.contactPhone && (
                    <>
                      <a
                        href={`tel:${pet.contactPhone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-hope text-white text-sm font-semibold hover:bg-hope/90 transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        Llamar
                      </a>
                      <a
                        href={`https://wa.me/${pet.contactPhone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1fb855] transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </>
                  )}
                </div>

                {/* Mini Map */}
                {pet.lat && pet.lng ? (
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="aspect-square">
                      <MiniMap
                        lat={pet.lat}
                        lng={pet.lng}
                        status={pet.status}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    <div className="aspect-square bg-petrol-light flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-petrol/30 mx-auto mb-1" />
                        <p className="text-xs text-petrol/40">
                          Ubicacion aproximada
                        </p>
                        <p className="text-xs text-petrol/30 mt-1">
                          {pet.location}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
