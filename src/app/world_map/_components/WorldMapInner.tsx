'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvent } from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import type { LeafletMouseEvent, Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import * as turf from '@turf/turf';
import Image from 'next/image';
import 'leaflet/dist/leaflet.css';
import loadingScreen from 'import/assets/Screenshot 2025-10-10 193356.png';
import { useCountry } from '../../context/WorldMapContext'; // ✅ use shared context

// --- Styles ---
const defaultStyle = {
  fillColor: '#60a5fa',
  weight: 1,
  opacity: 1,
  color: 'white',
  fillOpacity: 0.7,
};

const highlightStyle = {
  weight: 3,
  color: '#1d4ed8',
  fillOpacity: 0.9,
};

// --- Label Pane Setup ---
function CreateLabelPane() {
  const map = useMap();
  React.useEffect(() => {
    map.createPane('labels');
    const pane = map.getPane('labels');
    if (pane) {
      pane.style.zIndex = '650';
      pane.style.pointerEvents = 'none';
    }
  }, [map]);
  return null;
}

// --- Handle popup close ---
function PopupCloseReset() {
  const { setSelectedCountry } = useCountry();
  const map = useMap();
  useMapEvent('popupclose', () => {
    setSelectedCountry(null);
    map.flyTo([20, 0], 2, { duration: 1 });
  });
  return null;
}

// --- MAIN COMPONENT ---
const WorldMapInner: React.FC = () => {
  const [countriesData, setCountriesData] = useState<GeoJsonObject | null>(null);
  const { selectedCountry, setSelectedCountry } = useCountry();
  const geoJsonRef = useRef<L.GeoJSON<any>>(null);

  // Load GeoJSON
  useEffect(() => {
    fetch('/countries.json')
      .then((res) => res.json())
      .then((data) => setCountriesData(data))
      .catch((err) => console.error('Error loading countries:', err));
  }, []);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const countryName =
      feature.properties.ADMIN || feature.properties.name || 'Unknown Country';

    // Hover highlight
    layer.on('mouseover', (e: LeafletMouseEvent) => {
      (e.target as L.Path).setStyle(highlightStyle);
      (e.target as L.Path)
        .bindTooltip(countryName, { permanent: false, direction: 'top' })
        .openTooltip();
      if (!(window as any).L?.Browser?.ie) (e.target as L.Path).bringToFront();
    });

    layer.on('mouseout', (e: LeafletMouseEvent) => {
      geoJsonRef.current?.resetStyle(e.target as L.Path);
      (e.target as L.Path).closeTooltip();
    });

    // Click — zoom + popup at centroid
    layer.on('click', async (e: LeafletMouseEvent) => {
      const map = e.target._map as LeafletMap;
      const centroid = turf.centroid(feature);
      const [lng, lat] = centroid.geometry.coordinates;

      setSelectedCountry(countryName);

      // Smooth fly, wait a bit before showing popup (avoids _leaflet_pos bug)
      map.flyTo([lat, lng], 5, { duration: 1 });
      setTimeout(() => {
        L.popup({ closeOnClick: true, autoClose: true })
          .setLatLng([lat, lng])
          .setContent(
            `<div style="font-weight:600; font-size:14px;">${countryName}</div>`
          )
          .openOn(map);
      }, 800);
    });
  };

  if (!countriesData) {
    return (
      <div className="relative h-[600px] w-full flex items-center justify-center">
        <Image
          src={loadingScreen}
          alt="Loading background"
          fill
          className="object-cover"
          placeholder="blur"
        />
        <div className="relative z-10 text-white bg-black bg-opacity-50 p-4 rounded-lg">
          Loading Map Components ...
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full flex items-center justify-center relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        className="h-full w-full rounded-2xl shadow-lg"
      >
        <CreateLabelPane />
        <PopupCloseReset />

        <TileLayer
          attribution="&copy; OpenStreetMap & CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        />
        <TileLayer
          attribution="&copy; OpenStreetMap & CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
          pane="labels"
        />
        <GeoJSON
          ref={geoJsonRef}
          data={countriesData}
          style={defaultStyle}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      {selectedCountry && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow text-sm font-medium text-black">
          Selected Country: {selectedCountry}
        </div>
      )}
    </div>
  );
};

export default WorldMapInner;
