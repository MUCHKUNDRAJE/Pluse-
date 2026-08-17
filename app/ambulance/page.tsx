'use client';

import React, { useState, useEffect } from 'react';
import { CesiumMap } from '@/components/map/CesiumMap';
import { TripStatusPanel } from '@/components/ambulance/TripStatusPanel';
import { fetchOsrmRoute, RouteSegment } from '@/lib/osrm';
import { mockAmbulances, mockPatients, mockHospitals, Hospital, Patient, Ambulance } from '@/lib/mockData';
import { getRealLocationAndHospitals, geocodeCityOrAddress } from '@/lib/locationStore';
import { Truck, Locate, Search, MapPin, Building2 } from 'lucide-react';

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

  // Core Geolocation Fetch with Radius Expansion Notice
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
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

        {/* GPS Actions & Preset Buttons */}
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
        </div>
      </div>

      {/* Main Grid: White Light Map Canvas with Dragging + Trip Status Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 h-[500px] lg:h-[650px] sticky top-20">
          <CesiumMap
            startPos={startPos}
            ambulancePos={[ambulance.currentLat, ambulance.currentLng]}
            targetPos={targetPos}
            startName={startName}
            targetName={targetName}
            routeData={routeData}
            height="h-full"
            interactive={true}
          />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <TripStatusPanel
            currentStageIndex={currentStageIndex}
            onAdvanceStage={handleAdvanceStage}
            patient={patient}
            assignedHospital={assignedHospital}
            onSelectHospital={handleSelectHospital}
          />
        </div>
      </div>
    </div>
  );
}
