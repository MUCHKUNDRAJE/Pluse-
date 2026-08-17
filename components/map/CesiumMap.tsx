'use client';

import React, { useEffect, useState, useRef } from 'react';
import { ZoomIn, ZoomOut, Locate, Globe, Clock } from 'lucide-react';
import { RouteSegment } from '@/lib/osrm';

interface CesiumMapProps {
  startPos?: [number, number];
  ambulancePos: [number, number];
  targetPos: [number, number];
  startName?: string;
  targetName?: string;
  routeData?: RouteSegment | null;
  height?: string;
  className?: string;
  interactive?: boolean;
  fullscreen?: boolean;
}

export const CesiumMap: React.FC<CesiumMapProps> = ({
  startPos,
  ambulancePos,
  targetPos,
  startName = "Starting Point",
  targetName = "Destination",
  routeData,
  height = "h-full",
  className = "",
  interactive = true,
  fullscreen = false,
}) => {
  const activeStartPos = startPos || ambulancePos;
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const targetMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const routeGlowRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [viewMode, setViewMode] = useState<'Light' | 'OSM'>('Light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Leaflet Map with automatic container resize responsiveness
  useEffect(() => {
    if (!isClient || !containerRef.current || leafletMap.current) return;

    let isMounted = true;

    const initLeaflet = async () => {
      const L = (await import('leaflet')).default;
      LRef.current = L;

      if (!containerRef.current || !isMounted) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      const map = L.map(containerRef.current, {
        center: [(activeStartPos[0] + targetPos[0]) / 2, (activeStartPos[1] + targetPos[1]) / 2],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        keyboard: true,
      });

      leafletMap.current = map;

      const tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      const startIcon = L.divIcon({
        className: 'custom-start-marker-wrapper',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-full border-2 border-white shadow-xl animate-pulse">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-blue-600 rounded-full border-2 border-white animate-ping"></span>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const targetIcon = L.divIcon({
        className: 'custom-target-marker-wrapper',
        html: `
          <div class="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full border-2 border-white shadow-xl">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });

      startMarkerRef.current = L.marker(activeStartPos, { icon: startIcon })
        .addTo(map)
        .bindPopup(`<b>${startName}</b>`);

      targetMarkerRef.current = L.marker(targetPos, { icon: targetIcon })
        .addTo(map)
        .bindPopup(`<b>${targetName}</b>`);

      routePolylineRef.current = L.polyline([], {
        color: '#2563EB',
        weight: 5,
        opacity: 0.9,
      }).addTo(map);

      routeGlowRef.current = L.polyline([], {
        color: '#0284C7',
        weight: 2,
        opacity: 1,
      }).addTo(map);

      setTimeout(() => {
        if (leafletMap.current) {
          leafletMap.current.invalidateSize();
        }
      }, 200);
    };

    initLeaflet();

    // Auto handle window resize for responsiveness
    const handleResize = () => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isClient]);

  // Update Markers
  useEffect(() => {
    if (!leafletMap.current) return;

    if (startMarkerRef.current) {
      startMarkerRef.current.setLatLng(activeStartPos);
      if (startMarkerRef.current.getPopup()) {
        startMarkerRef.current.getPopup().setContent(`<b>${startName}</b>`);
      }
    }
    if (targetMarkerRef.current) {
      targetMarkerRef.current.setLatLng(targetPos);
      if (targetMarkerRef.current.getPopup()) {
        targetMarkerRef.current.getPopup().setContent(`<b>${targetName}</b>`);
      }
    }
  }, [activeStartPos, targetPos, startName, targetName]);

  // Update OSRM Polyline with Responsive Fit Bounds
  useEffect(() => {
    if (!leafletMap.current || !routePolylineRef.current || !routeGlowRef.current) return;

    if (routeData && routeData.coordinates && routeData.coordinates.length > 0) {
      routePolylineRef.current.setLatLngs(routeData.coordinates);
      routeGlowRef.current.setLatLngs(routeData.coordinates);

      if (LRef.current) {
        const bounds = LRef.current.latLngBounds(routeData.coordinates);
        leafletMap.current.fitBounds(bounds, { padding: [30, 30], animate: true });
      }
    }
  }, [routeData]);

  // Toggle Map Tiles
  useEffect(() => {
    if (!tileLayerRef.current) return;

    const tileUrl = viewMode === 'Light'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    tileLayerRef.current.setUrl(tileUrl);
  }, [viewMode]);

  const handleZoomIn = () => {
    if (leafletMap.current) leafletMap.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (leafletMap.current) leafletMap.current.zoomOut();
  };

  const handleRecenter = () => {
    if (leafletMap.current) {
      leafletMap.current.setView(activeStartPos, 14, { animate: true });
    }
  };

  return (
    <div className={`relative w-full ${height} ${className} overflow-hidden cursor-grab active:cursor-grabbing ${
      fullscreen
        ? 'bg-white'                                            // edge-to-edge, no rounding/border
        : 'bg-slate-100 rounded-2xl border border-slate-300 shadow-md'
    }`}>
      {/* Map Canvas */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Responsive Floating Header Banner */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 shadow-lg max-w-full sm:max-w-md">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
        <div className="truncate">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-blue-700 uppercase truncate">
              Live OSRM Navigation
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-600 truncate">
            <span className="font-semibold text-slate-800">{startName}</span> &rarr; <span className="font-bold text-blue-700">{targetName}</span>
          </p>
        </div>
      </div>

      {/* Responsive Floating ETA Card — pushed up higher in fullscreen so it clears the pickup panel */}
      {routeData && (
        <div className={`absolute right-3 z-10 flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-blue-600 text-white shadow-xl ${
          fullscreen ? 'bottom-60 sm:bottom-56' : 'bottom-16 sm:bottom-auto sm:top-3'
        }`}>
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-200 animate-spin" />
          <div>
            <div className="text-[10px] sm:text-xs text-blue-100 uppercase font-semibold">Live Route ETA</div>
            <div className="text-sm sm:text-lg font-extrabold text-white font-mono">
              {routeData.durationMins} MINS <span className="text-[10px] sm:text-xs text-blue-100 font-sans">({routeData.distanceKm} km)</span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Controls — pushed up in fullscreen so they clear the pickup panel */}
      {interactive && (
        <div className={`absolute right-3 z-10 flex sm:flex-col gap-1.5 sm:gap-2 ${
          fullscreen ? 'bottom-56 sm:bottom-52' : 'bottom-4'
        }`}>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center justify-center shadow-lg transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleZoomOut}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 flex items-center justify-center shadow-lg transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleRecenter}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-slate-50 text-blue-600 border border-slate-300 flex items-center justify-center shadow-lg transition-all"
            title="Recenter Map"
          >
            <Locate className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => setViewMode((prev) => (prev === 'Light' ? 'OSM' : 'Light'))}
            className="px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-xl bg-white hover:bg-slate-50 text-[10px] sm:text-xs font-mono font-bold text-slate-800 border border-slate-300 flex items-center gap-1 shadow-lg transition-all"
            title="Toggle Map Style"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{viewMode}</span>
          </button>
        </div>
      )}
    </div>
  );
};
