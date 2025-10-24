"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import * as turf from "@turf/turf";
import L from "leaflet";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import type { GeoJsonObject } from "geojson";
import type { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import loadingScreen from "public/assets/Screenshot 2025-10-10 193356.png";
import useLocalStorage from "../../hooks/useLocalStorage";

const defaultStyle = {
  fillColor: "#60a5fa",
  weight: 1,
  opacity: 1,
  color: "white",
  fillOpacity: 0.7,
};

const highlightStyle = {
  weight: 3,
  color: "#1d4ed8",
  fillOpacity: 0.9,
};

export default function WorldMapInner() {
  const [countriesData, setCountriesData] = useState<GeoJsonObject | null>(null);
  const [selectedCountry, setSelectedCountryState] = useLocalStorage("selectedCountry", null);
  const mapRef = useRef<LeafletMap | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountriesData(data))
      .catch((err) => console.error("Error loading countries:", err));
  }, []);

  useEffect(() => {
    return () => {
      if (mapRef.current && mapRef.current.remove) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const onEachFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const countryName = feature.properties.ADMIN || feature.properties.name || "Unknown Country";

      layer.on("mouseover", (e: LeafletMouseEvent) => {
        const target = e.target as L.Path;
        target.setStyle(highlightStyle);
        target.bindTooltip(countryName, { permanent: false, direction: "top" }).openTooltip();
        if (!(window as any).L?.Browser?.ie) target.bringToFront();
      });

      layer.on("mouseout", (e: LeafletMouseEvent) => {
        if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target as L.Path);
        (e.target as L.Path).closeTooltip();
      });

      layer.on("click", (e: LeafletMouseEvent) => {
        const map = mapRef.current;
        if (!map) return;
        const centroid = turf.centroid(feature);
        const [lng, lat] = centroid.geometry.coordinates;
        setSelectedCountryState(countryName);
        map.flyTo([lat, lng], 5, { duration: 1 });
        L.popup({ closeOnClick: true, autoClose: true })
          .setLatLng([lat, lng])
          .setContent(`<div style="font-weight:600; font-size:14px;">${countryName}</div>`)
          .openOn(map);
      });
    },
    []
  );

  return (
    <div className="relative h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden shadow-lg">
      {!countriesData && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white">
          <Image src="/assets/Screenshot 2025-10-10 193356.png" alt="Loading map background" fill className="object-cover" placeholder="blur" />
          <div className="relative z-10 text-white bg-black bg-opacity-50 p-4 rounded-lg">Loading Map Components...</div>
        </div>
      )}

      {countriesData && (
        <MapContainer
          whenCreated={(map) => {
            mapRef.current = map;
            setTimeout(() => map.invalidateSize(), 100);
          }}
          center={[20, 0]}
          zoom={2}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            ref={geoJsonRef}
            data={countriesData}
            style={defaultStyle}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      )}
      {selectedCountry && (
        <div className="absolute top-4 left-4 z-[1000] bg-white p-2 rounded shadow text-sm font-medium text-black">
          Selected Country: {selectedCountry}
        </div>
      )}
    </div>
  );
}
