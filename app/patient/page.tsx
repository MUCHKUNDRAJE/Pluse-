'use client';

import React, { useState, useEffect } from 'react';
import { StageStepper } from '@/components/shared/StageStepper';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SectionCard } from '@/components/shared/SectionCard';
import { CesiumMap } from '@/components/map/CesiumMap';
import { VitalsCard } from '@/components/patient/VitalsCard';
import { StatusTimeline } from '@/components/patient/StatusTimeline';
import { mockPatients, mockAmbulances, mockHospitals, Patient, Ambulance, Hospital } from '@/lib/mockData';
import { getRealLocationAndHospitals, geocodeCityOrAddress } from '@/lib/locationStore';
import { fetchOsrmRoute, RouteSegment } from '@/lib/osrm';
import { User, Truck, Hospital as HospitalIcon, Phone, Locate, Search, MapPin } from 'lucide-react';

export default function PatientPage() {
  const [patient, setPatient] = useState<Patient>(mockPatients[0]);
  const [ambulance, setAmbulance] = useState<Ambulance>(mockAmbulances[0]);
  const [hospital, setHospital] = useState<Hospital>(mockHospitals[0]);
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>(mockHospitals);
  const [routeData, setRouteData] = useState<RouteSegment | null>(null);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(2);
  const [isLocating, setIsLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>("Searching OpenStreetMap real hospitals...");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const patientStages = [
    "Call Placed",
    "Ambulance Dispatched",
    "Ambulance Arriving",
    "Picked Up",
    "En Route Hospital",
    "Arrived Emergency Bay"
  ];

  useEffect(() => {
    handleFetchUserLocation();
  }, []);

  useEffect(() => {
    async function loadRoute() {
      const route = await fetchOsrmRoute(
        ambulance.currentLat,
        ambulance.currentLng,
        patient.lat,
        patient.lng
      );
      setRouteData(route);
    }
    loadRoute();
  }, [ambulance.currentLat, ambulance.currentLng, patient.lat, patient.lng]);

  const handleFetchUserLocation = () => {
    setIsLocating(true);
    setNotice("Searching real OpenStreetMap hospitals around your location...");

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const uLat = position.coords.latitude;
          const uLng = position.coords.longitude;

          const liveData = await getRealLocationAndHospitals(uLat, uLng);

          setPatient(liveData.patient);
          setHospital(liveData.assignedHospital);
          setNearbyHospitals(liveData.nearbyHospitals);
          setAmbulance(liveData.ambulance);

          const newRoute = await fetchOsrmRoute(
            liveData.ambulance.currentLat,
            liveData.ambulance.currentLng,
            uLat,
            uLng
          );
          setRouteData(newRoute);
          setIsLocating(false);
          setNotice(`Nearest OpenStreetMap Hospital Found (${liveData.assignedHospital.distanceKm} km): ${liveData.assignedHospital.name}`);
        },
        async () => {
          loadDefaultPreset();
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      loadDefaultPreset();
    }
  };

  const loadDefaultPreset = async () => {
    setIsLocating(true);
    setNotice("Searching OpenStreetMap emergency hospitals...");
    const liveData = await getRealLocationAndHospitals(21.1384, 79.1235);
    setPatient(liveData.patient);
    setHospital(liveData.assignedHospital);
    setNearbyHospitals(liveData.nearbyHospitals);
    setAmbulance(liveData.ambulance);

    const newRoute = await fetchOsrmRoute(
      liveData.ambulance.currentLat,
      liveData.ambulance.currentLng,
      21.1384,
      79.1235
    );
    setRouteData(newRoute);
    setIsLocating(false);
    setNotice(`Nearest Real Hospital (${liveData.assignedHospital.distanceKm} km): ${liveData.assignedHospital.name}`);
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setNotice(`Searching real hospitals around "${searchQuery}"...`);

    const coords = await geocodeCityOrAddress(searchQuery);
    if (coords) {
      const liveData = await getRealLocationAndHospitals(coords[0], coords[1]);
      setPatient(liveData.patient);
      setHospital(liveData.assignedHospital);
      setNearbyHospitals(liveData.nearbyHospitals);
      setAmbulance(liveData.ambulance);

      const newRoute = await fetchOsrmRoute(
        liveData.ambulance.currentLat,
        liveData.ambulance.currentLng,
        coords[0],
        coords[1]
      );
      setRouteData(newRoute);
      setNotice(`Nearest Real Hospital (${liveData.assignedHospital.distanceKm} km): ${liveData.assignedHospital.name}`);
    } else {
      setNotice(`Could not locate "${searchQuery}". Try another landmark.`);
    }
    setIsSearching(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notice */}
      {notice && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span>{notice}</span>
          </div>
          <span className="bg-emerald-800 px-2 py-0.5 rounded text-[10px]">MIN KM SEARCH</span>
        </div>
      )}

      {/* Patient Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <User className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight">
              Patient Emergency Dispatch Tracking
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 font-mono mt-0.5 line-clamp-2">
              Patient: <span className="text-slate-900 font-bold">{patient.name}</span> &bull; Incident Reg: <span className="text-blue-700 font-bold">{patient.registrationNumber}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <form onSubmit={handleSearchLocation} className="flex items-center gap-1 flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search Area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 text-slate-900 placeholder-slate-400 w-full sm:w-44"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all flex-shrink-0"
              title="Search Location"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <button
            onClick={handleFetchUserLocation}
            disabled={isLocating}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all flex-shrink-0"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Detect GPS'}</span>
          </button>

          <StatusBadge status="in-progress" label={patientStages[currentStageIndex]} size="md" />
        </div>
      </div>

      {/* Emergency Status Card */}
      <SectionCard
        title={
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <Truck className="w-5 h-5 text-amber-600 animate-bounce" />
            Active Dispatch Stage &amp; Live Approaching Map
          </div>
        }
        subtitle="Live telemetry feed connecting bystander call center, driver unit, and receiving emergency bay"
      >
        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <StageStepper
              stages={patientStages}
              currentStageIndex={currentStageIndex}
              onSelectStage={(idx) => setCurrentStageIndex(idx)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-amber-700 font-bold">
                    <Truck className="w-4 h-4" />
                    <span>Assigned Ambulance Unit</span>
                  </div>
                  <span className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold">
                    ETA: {ambulance.etaMins} mins
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-extrabold text-base text-slate-900">{ambulance.vehicleNumber}</div>
                  <div className="text-xs text-slate-500">Driver: <span className="text-slate-900 font-semibold">{ambulance.driverName}</span></div>
                  <div className="text-xs text-slate-500">Driver Phone: <span className="text-slate-900 font-mono font-semibold">{ambulance.driverPhone}</span></div>
                </div>
              </div>

              <a
                href={`tel:${ambulance.driverPhone}`}
                className="mt-4 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver Directly</span>
              </a>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <HospitalIcon className="w-4 h-4" />
                    <span>Nearest Hospital (Min Km)</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                    {hospital.distanceKm} km away
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-extrabold text-base text-slate-900">{hospital.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{hospital.address}</div>
                  <div className="text-xs text-slate-500">Min Distance: <span className="text-slate-900 font-mono font-semibold">{hospital.distanceKm} km ({hospital.etaMins} mins)</span></div>
                </div>
              </div>

              <a
                href={`tel:${hospital.contact}`}
                className="mt-4 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hospital Desk</span>
              </a>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 text-xs font-mono text-slate-500">
              <span>LIVE AMBULANCE APPROACH MAP</span>
              <span className="text-blue-700 font-bold">REAL-TIME OSRM TELEMETRY</span>
            </div>
            <CesiumMap
              ambulancePos={[ambulance.currentLat, ambulance.currentLng]}
              targetPos={[hospital.lat, hospital.lng]}
              targetName={`Destination: ${hospital.name}`}
              startPos={[patient.lat, patient.lng]}
              startName={`Your Location: ${patient.locationName}`}
              height="h-48 sm:h-64"
              routeData={routeData}
              hospitals={nearbyHospitals}
              onSelectHospital={(hosp) => setHospital(hosp)}
            />
          </div>
        </div>
      </SectionCard>

      <VitalsCard patient={patient} />
      <StatusTimeline />
    </div>
  );
}
