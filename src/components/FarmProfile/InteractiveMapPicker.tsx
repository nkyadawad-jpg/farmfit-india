import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';

interface InteractiveMapPickerProps {
  latitude: number;
  longitude: number;
  onLocationSelect: (lat: number, lng: number) => void;
  altitudeMeters?: number | null;
  locationLabel?: string;
}

export const InteractiveMapPicker: React.FC<InteractiveMapPickerProps> = ({
  latitude,
  longitude,
  onLocationSelect,
  altitudeMeters,
  locationLabel
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [mapLayer, setMapLayer] = useState<'osm' | 'satellite'>('osm');

  // Custom emerald farm pin icon
  const customFarmIcon = L.divIcon({
    className: 'custom-farm-pin',
    html: `
      <div style="
        background: #15803d;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        border: 2px solid white;
      ">
        <div style="transform: rotate(45deg); font-size: 16px; font-weight: bold;">🌱</div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up previous map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const safeLat = isNaN(latitude) || latitude === 0 ? 22.7196 : latitude;
    const safeLng = isNaN(longitude) || longitude === 0 ? 75.8577 : longitude;

    const map = L.map(mapContainerRef.current, {
      center: [safeLat, safeLng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true
    });

    const tileUrl = mapLayer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution = mapLayer === 'satellite'
      ? '&copy; Esri &mdash; Earthstar Geographics'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 18
    }).addTo(map);

    // Add draggable marker
    const marker = L.marker([safeLat, safeLng], {
      icon: customFarmIcon,
      draggable: true
    }).addTo(map);

    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      onLocationSelect(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
    });

    // Map click handler to move marker
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onLocationSelect(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Trigger invalidateSize after render
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapLayer]);

  // Update marker when lat/lng props change from outside
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const safeLat = isNaN(latitude) || latitude === 0 ? 22.7196 : latitude;
      const safeLng = isNaN(longitude) || longitude === 0 ? 75.8577 : longitude;
      
      markerRef.current.setLatLng([safeLat, safeLng]);
      mapInstanceRef.current.panTo([safeLat, safeLng], { animate: true });
    }
  }, [latitude, longitude]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Interactive Farm Geolocation Preview & Pin Drop</span>
        </div>
        
        {/* Layer Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setMapLayer('osm')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              mapLayer === 'osm'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Street Map
          </button>
          <button
            type="button"
            onClick={() => setMapLayer('satellite')}
            className={`px-2 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
              mapLayer === 'satellite'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Satellite View
          </button>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-950 h-72 sm:h-80 w-full z-0">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating coordinates chip overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md text-xs z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Pin GPS Coordinates</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
              {latitude.toFixed(5)}° N, {longitude.toFixed(5)}° E
            </span>
          </div>

          <div className="border-l border-slate-200 dark:border-slate-700 pl-3">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Elevation</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
              {altitudeMeters !== null && altitudeMeters !== undefined ? `${altitudeMeters} m (${Math.round(altitudeMeters * 3.28)} ft)` : 'Elevation data unavailable'}
            </span>
          </div>

          <div className="text-[10px] text-slate-500 italic hidden md:block">
            Click map or drag pin to adjust farm location
          </div>
        </div>
      </div>
    </div>
  );
};
