"use client";
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

interface Props {
  lat?: number;
  lng?: number;
  geojson?: any;
}

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

export default function SafetyMiniMapInner({ lat = 48.8566, lng = 2.3522, geojson }: Props) {
  const center: LatLngExpression = [lat, lng];

  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties?.label) {
      layer.bindPopup(feature.properties.label);
    }
    if (feature.properties) {
      layer.setStyle({
        fillColor: feature.properties.fillColor || "#6C63FF",
        fillOpacity: feature.properties.fillOpacity || 0.35,
        color: feature.properties.color || "#6C63FF",
        weight: feature.properties.weight || 1,
        opacity: feature.properties.opacity || 0.7,
      });
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ height: 340 }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%", background: "#111118" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        />
        <MapUpdater lat={lat} lng={lng} />
        {geojson && (
          <GeoJSON data={geojson} onEachFeature={onEachFeature} />
        )}
      </MapContainer>
    </div>
  );
}
