'use client';

import React, { useState, useEffect } from 'react';
import { CesiumMap } from '@/components/map/CesiumMap';
import { TripStatusPanel } from '@/components/ambulance/TripStatusPanel';
import { fetchOsrmRoute, RouteSegment } from '@/lib/osrm';
import { mockAmbulances, mockPatients, mockHospitals, Hospital, Patient, Ambulance } from '@/lib/mockData';
import { getRealLocationAndHospitals, geocodeCityOrAddress } from '@/lib/locationStore';
import { Truck, Locate, Search, MapPin, Building2, Expand, Shrink } from 'lucide-react';

export default function AmbulanceDriverPage() {
  const [ambulance, setAmbulance] = useState<Ambulance>(mockAmbulances[0]);
  const [patient, setPatient] = useState<Patient>(mockPatients[0]);
  const [assignedHospital, setAssignedHospital] = useState<Hospital>(mockHospitals[0]);
  const [routeData, setRouteData] = useState<RouteSegment | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>("Radius Expansion Search (1km → 2km → 5km) active...");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);

  const isPatientPickedUp = currentStageIndex >= 2;

  const startPos: [number, number] = isPatientPickedUp
    ? [patient.lat, patient.lng]
    : [ambulance.currentLat, ambulance.currentLng];

  const targetPos: [number, number] = isPatientPickedUp
    ? [assignedHospital.lat, assignedHospital.lng]
    : [patient.lat, patient.lng];

  const startName = isPatientPickedUp
    ? `Patient: ${patient.name} (Picked Up)`
    : `ALS Ambulance (${ambulance.vehicleNumber})`;

  const targetName = isPatientPickedUp
    ? assignedHospital.name
    : `Patient: ${patient.name} (${patient.locationName})`;

  useEffect(() => {
    handleFetchUserLocation();
  }, []);

  useEffect(() => {
    async function loadRoute() {
      const route = await fetchOsrmRoute(
        startPos[0],
        startPos[1],
        targetPos[0],
        targetPos[1]
      );
      setRouteData(route);
    }
    loadRoute();
  }, [startPos[0], startPos[1], targetPos[0], targetPos[1]]);

  // Core Geolocation Fetch
  const handleFetchUserLocation = () => {
    setIsLocating(true);
    setLocationNotice("Searching radius: 1km → 2km → 3km → 5km...");

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const uLat = position.coords.latitude;
          const uLng = position.coords.longitude;

          const liveData = await getRealLocationAndHospitals(uLat, uLng);

          setPatient(liveData.patient);
          setAssignedHospital(liveData.assignedHospital);
          setAmbulance(liveData.ambulance);

          const newRoute = await fetchOsrmRoute(
            liveData.ambulance.currentLat,
            liveData.ambulance.currentLng,
            uLat,
            uLng
          );
          setRouteData(newRoute);
          setIsLocating(false);
          setLocationNotice(`Radius Search (${liveData.searchRadiusKm}km max): Found nearest hospital at ${liveData.assignedHospital.distanceKm} km (${liveData.assignedHospital.name})`);
        },
        async () => {
          loadNagpurPreset();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      loadNagpurPreset();
    }
  };

  // Preset for Nandanvan, Nagpur
  const loadNagpurPreset = async () => {
    setIsLocating(true);
    setLocationNotice("Checking radius 1km → 2km in Nandanvan, Nagpur...");
    const liveData = await getRealLocationAndHospitals(21.1384, 79.1235);
    setPatient(liveData.patient);
    setAssignedHospital(liveData.assignedHospital);
    setAmbulance(liveData.ambulance);

    const newRoute = await fetchOsrmRoute(
      liveData.ambulance.currentLat,
      liveData.ambulance.currentLng,
      21.1384,
      79.1235
    );
    setRouteData(newRoute);
    setIsLocating(false);
    setLocationNotice(`Min Distance Found: ${liveData.assignedHospital.name} (${liveData.assignedHospital.distanceKm} km away)`);
  };

  // Search Address
  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setLocationNotice(`Expanding radius search for "${searchQuery}"...`);

    const coords = await geocodeCityOrAddress(searchQuery);
    if (coords) {
      const liveData = await getRealLocationAndHospitals(coords[0], coords[1]);
      setPatient(liveData.patient);
      setAssignedHospital(liveData.assignedHospital);
      setAmbulance(liveData.ambulance);

      const newRoute = await fetchOsrmRoute(
        liveData.ambulance.currentLat,
        liveData.ambulance.currentLng,
        coords[0],
        coords[1]
      );
      setRouteData(newRoute);
      setLocationNotice(`Nearest Hospital (${liveData.assignedHospital.distanceKm} km): ${liveData.assignedHospital.name}`);
    } else {
      setLocationNotice(`Could not locate "${searchQuery}". Please try another landmark.`);
    }
    setIsSearching(false);
  };

  const handleAdvanceStage = async () => {
    const nextIdx = Math.min(4, currentStageIndex + 1);
    setCurrentStageIndex(nextIdx);

    if (nextIdx >= 2) {
      const newRoute = await fetchOsrmRoute(
        patient.lat,
        patient.lng,
        assignedHospital.lat,
        assignedHospital.lng
      );
      setRouteData(newRoute);
      setLocationNotice(`Patient Picked Up! Live OSRM route recalculated: Patient (${patient.locationName}) → ${assignedHospital.name} (${assignedHospital.distanceKm} km)`);
    }
  };

  const handleSelectHospital = async (newHospital: Hospital) => {
    setAssignedHospital(newHospital);
    if (currentStageIndex >= 2) {
      const newRoute = await fetchOsrmRoute(
        patient.lat,
        patient.lng,
        newHospital.lat,
        newHospital.lng
      );
      setRouteData(newRoute);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notice Banner */}
      {locationNotice && (
        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{locationNotice}</span>
          </div>
          <span className="bg-blue-800 px-2 py-0.5 rounded text-[10px]">RADIUS EXPANSION SEARCH</span>
        </div>
      )}

      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Ambulance Driver Cockpit • {ambulance.vehicleNumber}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              Nearest Assigned Hospital: <span className="text-blue-700 font-bold">{assignedHospital.name} ({assignedHospital.distanceKm} km)</span>
            </p>
          </div>
        </div>

        {/* GPS Actions & Fullscreen Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadNagpurPreset}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nandanvan, Nagpur</span>
          </button>

          <form onSubmit={handleSearchLocation} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="Search City / Area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 placeholder-slate-400 w-36 sm:w-48"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all"
              title="Search Location"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={handleFetchUserLocation}
            disabled={isLocating}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Detect GPS'}</span>
          </button>

          {/* Fullscreen Map Toggle Button */}
          <button
            onClick={() => setIsMapFullscreen((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all border ${
              isMapFullscreen
                ? 'bg-slate-900 text-white border-slate-700'
                : 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
            }`}
            title={isMapFullscreen ? 'Exit Fullscreen Map' : 'Fullscreen Map'}
          >
            {isMapFullscreen ? <Shrink className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
            <span>{isMapFullscreen ? 'Exit Fullscreen' : 'Full Map'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: White Light Map Canvas with Fullscreen Support + Trip Status Panel */}
      <div className={`flex flex-col gap-4 lg:gap-6 ${
        isMapFullscreen ? '' : 'lg:grid lg:grid-cols-12'
      }`}>
        {/* Map — Fullscreen: High z-index fixed viewport overlay, Normal: column */}
        <div className={`transition-all duration-300 ${
          isMapFullscreen
            ? 'fixed top-0 left-0 w-screen h-screen z-[99999] bg-white p-0 m-0 overflow-hidden'
            : 'w-full lg:col-span-7 lg:sticky lg:top-20 h-64 sm:h-[420px] lg:h-[650px] relative'
        }`}>
          {/* Fullscreen Exit Button overlay */}
          {isMapFullscreen && (
            <button
              onClick={() => setIsMapFullscreen(false)}
              className="absolute top-4 left-4 z-[100000] flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-extrabold shadow-2xl border border-slate-700 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Shrink className="w-4 h-4 text-purple-400" />
              <span>Exit Fullscreen Map</span>
            </button>
          )}

          {/* Floating Fullscreen Action Panel */}
          {isMapFullscreen && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100000] w-[calc(100%-2rem)] max-w-md">
              <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 uppercase tracking-wider">Current Stage</span>
                  <span className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] ${
                    currentStageIndex >= 2 ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-100 text-amber-700 border border-amber-300'
                  }`}>
                    {['Dispatched', 'En Route Patient', 'Patient Picked Up', 'En Route Hospital', 'Arrived'][currentStageIndex]}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200 text-xs">
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-400 text-[10px] uppercase font-mono">
                      {isPatientPickedUp ? 'Patient (Onboard)' : 'Patient Location'}
                    </div>
                    <div className="font-bold text-slate-900 truncate">{patient.name}</div>
                    <div className="text-slate-500 truncate text-[11px]">{patient.locationName}</div>
                  </div>
                  <Truck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-right">
                    <div className="text-slate-400 text-[10px] uppercase font-mono">Hospital</div>
                    <div className="font-bold text-slate-900 truncate">{assignedHospital.name}</div>
                    <div className="text-blue-600 font-mono font-bold text-[11px]">{assignedHospital.distanceKm} km • {assignedHospital.etaMins} mins</div>
                  </div>
                </div>

                {currentStageIndex < 4 ? (
                  <button
                    onClick={handleAdvanceStage}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:from-red-700 hover:to-emerald-700 text-white font-extrabold text-sm uppercase tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Truck className="w-5 h-5" />
                    {currentStageIndex === 0 && 'Confirm Dispatch Acknowledgement'}
                    {currentStageIndex === 1 && '✓ Mark Patient Picked Up'}
                    {currentStageIndex === 2 && 'Start Transit to Hospital'}
                    {currentStageIndex === 3 && 'Mark Arrived at Emergency Bay'}
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2">
                    <Truck className="w-4 h-4" />
                    Trip Complete — Patient Handover Done
                  </div>
                )}
              </div>
            </div>
          )}

          <CesiumMap
            startPos={startPos}
            ambulancePos={[ambulance.currentLat, ambulance.currentLng]}
            targetPos={targetPos}
            startName={startName}
            targetName={targetName}
            routeData={routeData}
            height={isMapFullscreen ? 'h-full' : 'h-full'}
            interactive={true}
            fullscreen={isMapFullscreen}
            onToggleFullscreen={() => setIsMapFullscreen((prev) => !prev)}
          />
        </div>

        {/* Trip Status Panel */}
        {!isMapFullscreen && (
          <div className="w-full lg:col-span-5 space-y-4">
            <TripStatusPanel
              currentStageIndex={currentStageIndex}
              onAdvanceStage={handleAdvanceStage}
              patient={patient}
              assignedHospital={assignedHospital}
              onSelectHospital={handleSelectHospital}
            />
          </div>
        )}
      </div>
    </div>
  );
}
