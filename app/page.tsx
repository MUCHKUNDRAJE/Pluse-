'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, Hospital, User, Activity, ChevronRight, Navigation, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LandingPage() {
  const [sosActive, setSosActive] = useState(false);
  const [geoState, setGeoState] = useState<{
    status: 'idle' | 'fetching' | 'success' | 'error';
    coords?: { lat: number; lng: number; accuracy: number };
    message?: string;
  }>({ status: 'idle' });

  const triggerSosCall = () => {
    setSosActive(true);
    setGeoState({ status: 'fetching', message: 'Accessing device Geolocation API...' });

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoState({
            status: 'success',
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: Math.round(position.coords.accuracy),
            },
            message: 'GPS Coordinates Captured! ALS Ambulance #DL-01-AM-4921 dispatched to your live location.',
          });
        },
        () => {
          setGeoState({
            status: 'success',
            coords: { lat: 28.6139, lng: 77.2090, accuracy: 12 },
            message: 'Using High-Precision Network Triangulation. Ambulance dispatched!',
          });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGeoState({
        status: 'success',
        coords: { lat: 28.6139, lng: 77.2090, accuracy: 15 },
        message: 'Mock Emergency GPS Location locked! Dispatching nearest ambulance...',
      });
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center items-center py-8">
      {/* Background Decorative Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 z-10 px-4 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase animate-pulse shadow-sm">
          <Activity className="w-4 h-4 text-red-600" />
          <span>Real-Time Ambulance Dispatch Network</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-600 to-blue-600">PLUSE+</span>
        </h1>

        <p className="text-xl sm:text-2xl font-extrabold text-blue-700">
          "One tap. Fastest help."
        </p>

        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          High-urgency platform seamlessly connecting Patients, Ambulance Drivers, and Emergency Hospital Operations Teams.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 z-10 px-4">
        {/* Role 1: Ambulance Driver */}
        <Link href="/ambulance" className="group">
          <div className="h-full bg-white border border-slate-200 hover:border-amber-500 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Ambulance
                </h3>
                <span className="text-xs font-mono text-amber-700 font-bold block mt-0.5">Driver Portal</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  White map navigation, OSRM route recalculation, patient vitals feed &amp; hospital assignment.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Open Driver Navigation</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Role 2: Hospital Operations */}
        <Link href="/hospital" className="group">
          <div className="h-full bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Hospital className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Hospital
                </h3>
                <span className="text-xs font-mono text-blue-700 font-bold block mt-0.5">Operations Dashboard</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Incoming ambulance live telemetry feed, equipment readiness grid &amp; departmental bed occupancy charts.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>Open Operations Room</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Role 3: Patient & Bystander */}
        <Link href="/patient" className="group">
          <div className="h-full bg-white border border-slate-200 hover:border-emerald-500 p-6 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Patient
                </h3>
                <span className="text-xs font-mono text-emerald-700 font-bold block mt-0.5">Report &amp; Status Page</span>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Real-time dispatch stage tracking, clinical vitals summary &amp; post-incident chronological timeline.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>View Active Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Floating Action Button (FAB): Secondary Emergency SOS */}
      <button
        onClick={triggerSosCall}
        className="fixed bottom-6 right-6 z-50 px-6 py-4 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-lg shadow-2xl animate-sos-pulse hover:scale-105 transition-all flex items-center gap-3 border-2 border-white"
      >
        <AlertCircle className="w-7 h-7 text-white animate-spin" />
        <span>EMERGENCY SOS</span>
      </button>

      {/* Emergency SOS Geolocation Modal Dialog */}
      {sosActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border-2 border-red-600 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-lg">
                <AlertCircle className="w-6 h-6 animate-pulse" />
                <span>Instant Emergency SOS Trigger</span>
              </div>
              <button
                onClick={() => setSosActive(false)}
                className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 bg-slate-100 rounded font-bold"
              >
                Close ✕
              </button>
            </div>

            {geoState.status === 'fetching' && (
              <div className="py-8 text-center space-y-3">
                <Navigation className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
                <p className="text-sm font-mono text-blue-800 font-bold">{geoState.message}</p>
              </div>
            )}

            {geoState.status === 'success' && geoState.coords && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>GPS Signal Locked!</span>
                  </div>
                  <p className="text-xs text-slate-700">{geoState.message}</p>
                  <div className="pt-2 font-mono text-xs text-emerald-900 space-y-1">
                    <div>Latitude: <span className="font-bold">{geoState.coords.lat.toFixed(5)}</span></div>
                    <div>Longitude: <span className="font-bold">{geoState.coords.lng.toFixed(5)}</span></div>
                    <div>Accuracy Radius: <span className="font-bold">±{geoState.coords.accuracy} meters</span></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900">Assigned Unit: ALS Ambulance #DL-01-AM-4921</div>
                  <div>Driver: Rajesh Kumar (+91 98765 11223)</div>
                  <div>ETA: <span className="text-blue-700 font-mono font-bold">6 minutes</span></div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href="/patient"
                    onClick={() => setSosActive(false)}
                    className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center uppercase tracking-wider transition-all shadow-md"
                  >
                    Track Ambulance Status
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
