'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CesiumMap } from '@/components/map/CesiumMap';
import { Truck, ChevronDown, ChevronUp, MapPin, User, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';
import { mockAmbulances, mockPatients, Ambulance, Patient } from '@/lib/mockData';

export const AmbulanceFeed: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>("amb-01");

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusText = (stageIdx: number) => {
    switch (stageIdx) {
      case 1:
        return "Dispatched — En Route Patient";
      case 2:
        return "Patient Picked Up — En Route";
      case 3:
        return "Arriving Soon (< 5 mins)";
      case 4:
        return "Arrived at Emergency Bay";
      default:
        return "En Route";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-600 animate-pulse" />
            Incoming Emergency Ambulances Feed
          </h2>
          <p className="text-xs text-slate-500">Live telemetry and real-time route tracking for hospital triage preparation</p>
        </div>
        <span className="px-3.5 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full font-mono text-xs font-bold shadow-sm">
          {mockAmbulances.length} Active Units En-Route
        </span>
      </div>

      <div className="space-y-3">
        {mockAmbulances.map((amb) => {
          const patient = mockPatients.find((p) => p.id === amb.assignedPatientId) || mockPatients[0];
          const isExpanded = expandedId === amb.id;

          return (
            <div
              key={amb.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-white border-blue-400 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(amb.id)}
                className="p-3 sm:p-4 cursor-pointer flex items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">{amb.vehicleNumber}</span>
                      <span className="text-xs text-slate-500 truncate">({amb.driverName})</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {patient.name}, {patient.age}y ({patient.gender})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & ETA */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right">
                    <StatusBadge status={amb.currentStageIndex >= 3 ? 'complete' : 'in-progress'} label={getStatusText(amb.currentStageIndex)} />
                    <div className="text-xs font-mono text-blue-700 font-extrabold mt-1 whitespace-nowrap">
                      ETA: {amb.etaMins}m ({amb.distanceToTargetKm}km)
                    </div>
                  </div>

                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expandable Mini Map Preview */}
              {isExpanded && (
                <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 space-y-4">
                  {/* Patient Triage Snapshot — stacks on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-sm">
                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Reported Symptoms:</span>
                      <div className="flex flex-wrap gap-1">
                        {patient.reportedSymptoms.map((symp) => (
                          <span key={symp} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded font-semibold">
                            {symp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Live Vitals:</span>
                      <div className="space-y-0.5 text-slate-800">
                        <div>BP: <span className="font-mono text-red-600 font-bold">{patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic} mmHg</span></div>
                        <div>SpO₂: <span className="font-mono text-amber-600 font-bold">{patient.vitals.spo2}%</span> | HR: <span className="font-mono text-blue-600 font-bold">{patient.vitals.heartRate} bpm</span></div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 block mb-0.5 font-medium">Driver Telemetry:</span>
                      <div className="space-y-0.5 text-slate-800">
                        <div>Speed: <span className="font-mono text-emerald-600 font-bold">{amb.speedKmH} km/h</span></div>
                        <div className="truncate">Phone: <span className="font-mono text-slate-900">{amb.driverPhone}</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Embedded Mini Route Map */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1 text-[11px] text-slate-500 font-mono">
                      <span>MINI ROUTE PREVIEW • OSRM TELEMETRY</span>
                      <span className="text-blue-700 font-bold">AMBULANCE → HOSPITAL</span>
                    </div>
                    <CesiumMap
                      ambulancePos={[amb.currentLat, amb.currentLng]}
                      targetPos={[28.6139, 77.2090]}
                      targetName="Apex Hospital Emergency Bay"
                      height="h-40 sm:h-56"
                      routeData={{
                        coordinates: [
                          [amb.currentLat, amb.currentLng],
                          [28.6050, 77.2150],
                          [28.6139, 77.2090]
                        ],
                        distanceKm: amb.distanceToTargetKm,
                        durationMins: amb.etaMins,
                        startName: "Vehicle",
                        endName: "Hospital"
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
