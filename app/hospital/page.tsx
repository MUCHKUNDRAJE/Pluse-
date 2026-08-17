'use client';

import React, { useState, useEffect } from 'react';
import { AmbulanceFeed } from '@/components/hospital/AmbulanceFeed';
import { ResourceGrid } from '@/components/hospital/ResourceGrid';
import { BedOccupancyChart } from '@/components/hospital/BedOccupancyChart';
import { Hospital as HospitalIcon, ShieldCheck, Truck, BarChart3, Locate, MapPin } from 'lucide-react';
import { mockHospitals, Hospital } from '@/lib/mockData';
import { getSavedAssignedHospital, getRealLocationAndHospitals } from '@/lib/locationStore';

export default function HospitalPage() {
  const [currentHospital, setCurrentHospital] = useState<Hospital>(mockHospitals[0]);
  const [activeTab, setActiveTab] = useState<'feed' | 'readiness' | 'occupancy'>('feed');
  const [isLocating, setIsLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Sync saved active nearby hospital on mount
  useEffect(() => {
    const saved = getSavedAssignedHospital(mockHospitals[0]);
    setCurrentHospital(saved);
  }, []);

  // Handle GPS detection directly from Hospital Dashboard
  const handleDetectNearestHospital = () => {
    setIsLocating(true);
    setNotice("Searching nearest real hospital under 5 km radius...");

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const uLat = position.coords.latitude;
          const uLng = position.coords.longitude;

          setNotice("Finding nearest real hospital (< 5 km)...");
          const liveData = await getRealLocationAndHospitals(uLat, uLng);

          setCurrentHospital(liveData.assignedHospital);
          setIsLocating(false);
          setNotice(`Synced to Nearest Real Hospital (< 5km): ${liveData.assignedHospital.name} (${liveData.assignedHospital.distanceKm} km away)`);
        },
        async () => {
          const liveData = await getRealLocationAndHospitals(21.1384, 79.1235);
          setCurrentHospital(liveData.assignedHospital);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification Banner */}
      {notice && (
        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{notice}</span>
          </div>
          <span className="bg-blue-800 px-2 py-0.5 rounded text-[10px]">NEAREST HOSPITAL SYNC</span>
        </div>
      )}

      {/* Hospital Operations Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <HospitalIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              {currentHospital.name}
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {currentHospital.address} • <span className="text-emerald-700 font-bold">{currentHospital.traumaCenterLevel}</span> • Distance: <span className="text-blue-700 font-bold">{currentHospital.distanceKm} km (&lt; 5 km)</span>
            </p>
          </div>
        </div>

        {/* Action Controls: GPS Sync + Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDetectNearestHospital}
            disabled={isLocating}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Locate className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Sync Nearest Hospital (< 5 km)'}</span>
          </button>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'feed'
                  ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-red-500" />
              <span>Incoming Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('readiness')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'readiness'
                  ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Facility Readiness</span>
            </button>

            <button
              onClick={() => setActiveTab('occupancy')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'occupancy'
                  ? 'bg-white text-blue-700 shadow-sm font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-cyan-600" />
              <span>Bed Occupancy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="space-y-6">
        {activeTab === 'feed' && (
          <div className="space-y-6">
            <AmbulanceFeed />
          </div>
        )}

        {activeTab === 'readiness' && (
          <div className="space-y-6">
            <ResourceGrid />
          </div>
        )}

        {activeTab === 'occupancy' && (
          <div className="space-y-6">
            <BedOccupancyChart />
          </div>
        )}
      </div>
    </div>
  );
}
