"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const statusColors: Record<string, string> = {
  lost: "#ef4444",
  found: "#f59e0b",
  reunited: "#2d9f6f",
};

export default function MiniMap({
  lat,
  lng,
  status,
}: {
  lat: number;
  lng: number;
  status: string;
}) {
  const color = statusColors[status] || "#ef4444";

  const icon = L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      attributionControl={false}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={[lat, lng]} icon={icon} />
    </MapContainer>
  );
}
