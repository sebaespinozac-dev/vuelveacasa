"use client";

import Link from "next/link";
import { MapPin, Clock, Eye } from "lucide-react";
import { AnimatedCard } from "./AnimatedSection";

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  status: "lost" | "found" | "reunited";
  location: string;
  date: string;
  image: string;
  sightings: number;
  reward?: string;
  contactName?: string;
  contactPhone?: string;
}

const statusConfig = {
  lost: { label: "Perdido/a", bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
  found: { label: "Encontrado/a", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  reunited: { label: "Reunido!", bg: "bg-green-50", text: "text-hope", dot: "bg-hope" },
};

export function PetCard({ pet, delay = 0 }: { pet: Pet; delay?: number }) {
  const status = statusConfig[pet.status];

  return (
    <AnimatedCard delay={delay}>
      <Link
        href={`/mascota/${pet.id}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-petrol-light transition-all duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10" />
          <div
            className="w-full h-full bg-contain bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-500"
            style={{
              backgroundImage: `url(${pet.image})`,
            }}
          />
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          {pet.reward && (
            <div className="absolute top-3 right-3 z-20">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warm text-white">
                Recompensa
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 text-white/90 text-xs">
            <Eye className="w-3.5 h-3.5" />
            {pet.sightings} avistamientos
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-petrol transition-colors">
                {pet.name}
              </h3>
              <p className="text-sm text-gray-500">
                {pet.species} &middot; {pet.breed}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mt-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {pet.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {pet.date}
            </span>
          </div>
        </div>
      </Link>
    </AnimatedCard>
  );
}
