"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mapPets, type MapPet } from "@/lib/map-data";

const statusColors = {
  lost: "#ef4444",
  found: "#f59e0b",
  reunited: "#2d9f6f",
};

const statusLabels = {
  lost: "Perdido/a",
  found: "Encontrado/a",
  reunited: "Reunido/a",
};

function createPetIcon(status: "lost" | "found" | "reunited", image: string) {
  const color = statusColors[status];
  return L.divIcon({
    className: "custom-pet-marker",
    html: `
      <div style="position:relative;width:48px;height:48px;">
        <div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};overflow:hidden;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
          <img src="${image}" style="width:100%;height:100%;object-fit:cover;" />
        </div>
        <div style="position:absolute;bottom:-2px;right:-2px;width:14px;height:14px;border-radius:50%;background:${color};border:2px solid #fff;"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });
}

function FlyToSelected({ pet }: { pet: MapPet | null }) {
  const map = useMap();
  useEffect(() => {
    if (pet) {
      map.flyTo([pet.lat, pet.lng], 15, { duration: 1 });
    }
  }, [pet, map]);
  return null;
}

interface MapViewProps {
  selectedPetId: string | null;
  onSelectPet: (id: string) => void;
}

export default function MapView({ selectedPetId, onSelectPet }: MapViewProps) {
  const selectedPet = mapPets.find((p) => p.id === selectedPetId) ?? null;

  return (
    <MapContainer
      center={[-33.45, -70.6]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FlyToSelected pet={selectedPet} />
      {mapPets.map((pet) => (
        <Marker
          key={pet.id}
          position={[pet.lat, pet.lng]}
          icon={createPetIcon(pet.status, pet.image)}
          eventHandlers={{
            click: () => onSelectPet(pet.id),
          }}
        >
          <Popup>
            <div style={{ minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <img
                  src={pet.image}
                  alt={pet.name}
                  style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1f2937" }}>
                    {pet.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {pet.species} &middot; {pet.breed}
                  </div>
                </div>
              </div>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                color: statusColors[pet.status],
                background: pet.status === "lost" ? "#fef2f2" : pet.status === "found" ? "#fffbeb" : "#e8f7f0",
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: statusColors[pet.status],
                }} />
                {statusLabels[pet.status]}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#6b7280" }}>
                <div>{pet.location}</div>
                <div>{pet.date} &middot; {pet.sightings} avistamientos</div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
