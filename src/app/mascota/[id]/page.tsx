import Link from "next/link";
import { mockPets as allPets } from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Eye,
  Share2,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  Camera,
  ChevronRight,
  Send,
} from "lucide-react";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { mockPets } from "@/lib/mock-data";

const statusConfig = {
  lost: { label: "Perdido/a", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  found: { label: "Encontrado/a", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  reunited: { label: "Reunido!", bg: "bg-green-50", text: "text-hope", dot: "bg-hope" },
};

export function generateStaticParams() {
  return allPets.map((pet) => ({ id: pet.id }));
}

export default async function MascotaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pet = mockPets.find((p) => p.id === id) ?? mockPets[0];
  const status = statusConfig[pet.status];

  const sightings = [
    {
      id: "a1",
      user: "Maria Garcia",
      time: "Hace 2 horas",
      location: "Calle Los Leones 1234",
      comment: "Vi un perro parecido corriendo por esta calle. Se veia asustado pero no agresivo.",
      image: null,
    },
    {
      id: "a2",
      user: "Carlos Perez",
      time: "Hace 5 horas",
      location: "Parque Bustamante",
      comment: "Creo que es el mismo perro. Estaba cerca de la fuente del parque.",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
    },
    {
      id: "a3",
      user: "Ana Lopez",
      time: "Ayer 18:30",
      location: "Metro Los Leones",
      comment: "Un vecino me dijo que vio un perro parecido en la salida del metro.",
      image: null,
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
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
                      <button className="p-2.5 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-all group">
                        <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                      <button className="p-2.5 rounded-xl border border-gray-200 hover:border-petrol/30 hover:bg-petrol-light transition-all group">
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
                      {pet.sightings} avistamientos
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none text-gray-600">
                    <p>
                      Se perdio en la zona de {pet.location}. Es un {pet.breed.toLowerCase()}{" "}
                      de color {pet.color.toLowerCase()}, muy amigable y responde a su nombre.
                      Llevaba un collar azul con placa de identificacion.
                      Cualquier informacion es valiosa, por favor reportar avistamientos.
                    </p>
                  </div>

                  {/* Share Buttons */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Compartir en redes
                    </p>
                    <div className="flex gap-2">
                      {["WhatsApp", "Instagram", "Facebook", "X", "Telegram"].map(
                        (network) => (
                          <button
                            key={network}
                            className="px-3 py-2 rounded-xl bg-gray-50 text-xs font-medium text-gray-600 hover:bg-petrol-light hover:text-petrol transition-all"
                          >
                            {network}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Timeline de avistamientos */}
            <AnimatedSection delay={0.1}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    Avistamientos ({sightings.length})
                  </h2>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-hope rounded-xl hover:bg-hope/90 transition-all">
                    <Eye className="w-4 h-4" />
                    Reportar avistamiento
                  </button>
                </div>

                <div className="space-y-6">
                  {sightings.map((s, i) => (
                    <AnimatedCard key={s.id} delay={i * 0.1}>
                      <div className="relative pl-8 pb-6 border-l-2 border-gray-100 last:border-l-0 last:pb-0">
                        <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-petrol border-4 border-white" />
                        <div className="flex items-start justify-between mb-2">
                          <div>
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
                        {pet.contactName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{pet.contactName}</p>
                      <p className="text-xs text-gray-500">Dueño/a</p>
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
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </>
                  )}
                  <a
                    href="mailto:"
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    Correo electronico
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <div className="aspect-square bg-petrol-light flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-petrol/30 mx-auto mb-1" />
                      <p className="text-xs text-petrol/40">Ultima ubicacion</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  );
}
