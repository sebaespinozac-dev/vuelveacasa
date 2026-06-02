"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, X, Loader2 } from "lucide-react";
import { PetCard } from "@/components/PetCard";
import { type Pet as CardPet } from "@/components/PetCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { mockPets } from "@/lib/mock-data";
import { supabase, type Pet as DbPet } from "@/lib/supabase";

const speciesOptions = ["Todos", "Perro", "Gato", "Ave", "Otro"];
const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "lost", label: "Perdidos" },
  { value: "found", label: "Encontrados" },
  { value: "reunited", label: "Reunidos" },
];

function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffHours < 1) return "Hace menos de 1 hora";
  if (diffHours < 24) return `Hace ${diffHours} horas`;
  if (diffDays === 1) return "Hace 1 dia";
  if (diffDays < 7) return `Hace ${diffDays} dias`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString("es-CL");
}

function dbPetToCard(p: DbPet): CardPet {
  return {
    id: p.id,
    name: p.name,
    species: p.species,
    breed: p.breed || "",
    color: p.color || "",
    status: p.status,
    location: p.location || "",
    date: timeAgo(new Date(p.created_at)),
    image: p.photo_url || "",
    sightings: 0,
    reward: p.reward ?? undefined,
    contactName: p.contact_name ?? undefined,
    contactPhone: p.contact_phone ?? undefined,
  };
}

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState("");
  const [allPets, setAllPets] = useState<CardPet[]>(mockPets);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbCards = (data as DbPet[]).map(dbPetToCard);
          const dbIds = new Set(dbCards.map((p) => p.id));
          const uniqueMock = mockPets.filter((p) => !dbIds.has(p.id));
          setAllPets([...dbCards, ...uniqueMock]);
        }
        setLoadingData(false);
      });
  }, []);

  const filtered = allPets.filter((pet) => {
    const matchesQuery =
      !query ||
      pet.name.toLowerCase().includes(query.toLowerCase()) ||
      pet.breed.toLowerCase().includes(query.toLowerCase()) ||
      pet.location.toLowerCase().includes(query.toLowerCase());
    const matchesSpecies =
      selectedSpecies === "Todos" || pet.species === selectedSpecies;
    const matchesStatus =
      selectedStatus === "all" || pet.status === selectedStatus;
    const matchesLocation =
      !locationFilter ||
      pet.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesQuery && matchesSpecies && matchesStatus && matchesLocation;
  });

  const activeFilters =
    (selectedSpecies !== "Todos" ? 1 : 0) +
    (selectedStatus !== "all" ? 1 : 0) +
    (locationFilter ? 1 : 0);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Buscar mascotas
          </h1>
          <p className="text-gray-500">
            Encuentra mascotas perdidas o reporta un avistamiento
          </p>
        </AnimatedSection>

        {/* Search Bar */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, raza o ubicacion..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all relative ${
                showFilters
                  ? "bg-petrol text-white border-petrol"
                  : "bg-white text-gray-700 border-gray-200 hover:border-petrol/30"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {activeFilters > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-warm text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </AnimatedSection>

        {/* Filters */}
        {showFilters && (
          <AnimatedSection className="mb-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Filtros</h3>
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setSelectedSpecies("Todos");
                      setSelectedStatus("all");
                      setLocationFilter("");
                    }}
                    className="text-xs font-medium text-petrol hover:text-petrol-dark transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Especie
                </label>
                <div className="flex flex-wrap gap-2">
                  {speciesOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSpecies(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSpecies === s
                          ? "bg-petrol text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-petrol-light hover:text-petrol"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Estado
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStatus(s.value)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedStatus === s.value
                          ? "bg-petrol text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-petrol-light hover:text-petrol"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Ubicacion
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Ciudad o comuna..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loadingData ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Cargando...
              </span>
            ) : (
              `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""}`
            )}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pet, i) => (
              <PetCard key={pet.id} pet={pet} delay={i * 0.08} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin resultados
            </h3>
            <p className="text-gray-500">
              Intenta con otros filtros o terminos de busqueda
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
