"use client";

import { useState } from "react";
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
import { mapPets } from "@/lib/map-data";

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

export default function MapaPage() {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);

  return (
    <div className="pt-16 h-screen flex flex-col">
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 z-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en el mapa..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-petrol/20 focus:border-petrol transition-all placeholder:text-gray-400"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
          <Filter className="w-4 h-4" />
          Filtros
        </button>
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all lg:hidden"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative">
          <MapView
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
              Mascotas en el mapa ({mapPets.length})
            </h2>
            <button
              onClick={() => setShowList(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {mapPets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`w-full flex items-center gap-3 p-4 text-left hover:bg-petrol-light/50 transition-all ${
                  selectedPet === pet.id ? "bg-petrol-light" : ""
                }`}
              >
                <div
                  className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0"
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
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
