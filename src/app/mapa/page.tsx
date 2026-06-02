"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Search,
  Layers,
  X,
  Filter,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { mapPets, type MapPet } from "@/lib/map-data";
import { supabase, type Pet } from "@/lib/supabase";
import Link from "next/link";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-petrol-light">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-petrol animate-spin mx-auto mb-2" />
        <p className="text-sm text-petrol/60">Cargando mapa...</p>
      </div>
    </div>
  ),
});

const statusColors: Record<string, string> = {
  lost: "bg-red-500",
  found: "bg-amber-500",
  reunited: "bg-hope",
};

const speciesOptions = ["Todos", "Perro", "Gato", "Ave", "Otro"];
const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "lost", label: "Perdidos" },
  { value: "found", label: "Encontrados" },
  { value: "reunited", label: "Reunidos" },
];

function petToMapPet(p: Pet): MapPet {
  return {
    id: p.id,
    name: p.name,
    species: p.species,
    breed: p.breed ?? "",
    status: p.status,
    location: p.location ?? "",
    lat: p.lat ?? -33.45,
    lng: p.lng ?? -70.6,
    image:
      p.photo_url ??
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop",
    date: new Date(p.created_at).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "short",
    }),
    sightings: 0,
  };
}

export default function MapaPage() {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const [pets, setPets] = useState<MapPet[]>(mapPets);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterSpecies, setFilterSpecies] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    supabase
      .from("pets")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const real = (data as Pet[])
            .filter((p) => p.lat && p.lng)
            .map(petToMapPet);
          setPets([...real, ...mapPets]);
        }
      });
  }, []);

  const filtered = pets.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      p.species.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies =
      filterSpecies === "Todos" || p.species === filterSpecies;
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const activeFilters =
    (filterSpecies !== "Todos" ? 1 : 0) + (filterStatus !== "all" ? 1 : 0);

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="relative bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en el mapa..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
            showFilters
              ? "bg-petrol text-white border-petrol"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Filter className="w-4 h-4" />
          Filtros
          {activeFilters > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-warm text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all lg:hidden"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Filter Panel */}
        {showFilters && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-4 shadow-lg z-[2000]">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">
                  Filtrar mascotas
                </h3>
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      setFilterSpecies("Todos");
                      setFilterStatus("all");
                    }}
                    className="text-xs font-medium text-petrol hover:text-petrol-dark transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Especie
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {speciesOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFilterSpecies(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filterSpecies === s
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
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  Estado
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {statusOptions.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setFilterStatus(s.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filterStatus === s.value
                          ? "bg-petrol text-white"
                          : "bg-gray-50 text-gray-600 hover:bg-petrol-light hover:text-petrol"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            pets={filtered}
            selectedPetId={selectedPet}
            onSelectPet={setSelectedPet}
          />

          {/* Legend */}
          <div className="absolute bottom-6 left-6 z-[1000] glass rounded-2xl p-4 shadow-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Leyenda</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                Perdido/a
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                Encontrado/a
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-3 h-3 rounded-full bg-hope" />
                Reunido/a
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar List */}
        <div
          className={`absolute lg:relative right-0 top-0 bottom-0 w-80 lg:w-96 bg-white border-l border-gray-100 overflow-y-auto transition-transform z-[1000] ${
            showList
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0 lg:hidden"
          }`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="font-semibold text-gray-900 text-sm">
              Mascotas en el mapa ({filtered.length})
            </h2>
            <button
              onClick={() => setShowList(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {filtered.map((pet) => (
              <Link
                key={pet.id}
                href={`/mascota/${pet.id}`}
                onClick={() => setSelectedPet(pet.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-petrol-light/50 transition-all ${
                  selectedPet === pet.id ? "bg-petrol-light" : ""
                }`}
              >
                <div
                  className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 bg-gray-100"
                  style={{ backgroundImage: `url(${pet.image})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {pet.name}
                    </h3>
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColors[pet.status]}`}
                    />
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {pet.species} &middot; {pet.breed}
                  </p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {pet.location}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </Link>
            ))}

            {filtered.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Sin resultados
                </p>
                <p className="text-xs text-gray-400">
                  Ajusta los filtros o la busqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
