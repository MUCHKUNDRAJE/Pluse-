'use client';

import React, { useState } from 'react';
import { StageStepper } from '@/components/shared/StageStepper';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Phone, Hospital, User, CheckCircle2, ChevronRight, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { Hospital as HospitalType, Patient as PatientType, mockHospitals } from '@/lib/mockData';

interface TripStatusPanelProps {
  currentStageIndex: number;
  onAdvanceStage: () => void;
  patient: PatientType;
  assignedHospital: HospitalType;
  onSelectHospital: (hospital: HospitalType) => void;
}

export const TripStatusPanel: React.FC<TripStatusPanelProps> = ({
  currentStageIndex,
  onAdvanceStage,
  patient,
  assignedHospital,
  onSelectHospital,
}) => {
  const [showHospitalSelector, setShowHospitalSelector] = useState(false);
  const [callNotification, setCallNotification] = useState<string | null>(null);

  const stages = [
    "Dispatched",
    "En Route Patient",
    "Patient Picked Up",
    "En Route Hospital",
    "Arrived"
  ];

  const handleSimulatedCall = (targetName: string, phone: string) => {
    setCallNotification(`Dialing ${targetName} (${phone})...`);
    setTimeout(() => setCallNotification(null), 3500);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-5 shadow-lg space-y-5 text-slate-900">
      {/* Toast Notification for quick call buttons */}
      {callNotification && (
        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between animate-bounce shadow-md">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 animate-spin" />
            <span>{callNotification}</span>
          </div>
          <span className="text-xs bg-blue-800 px-2 py-0.5 rounded font-mono">CONNECTING</span>
        </div>
      )}

      {/* Stage Stepper Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase text-slate-500">Call Stage Progress</span>
          <StatusBadge
            status={currentStageIndex >= 3 ? 'in-progress' : 'dispatched'}
            label={stages[currentStageIndex]}
          />
        </div>
        <StageStepper stages={stages} currentStageIndex={currentStageIndex} />
      </div>

      {/* Main Action Button */}
      <div className="pt-1">
        {currentStageIndex < 4 ? (
          <button
            onClick={onAdvanceStage}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:from-red-700 hover:to-emerald-700 text-white font-extrabold text-lg tracking-wide uppercase shadow-lg shadow-red-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-6 h-6" />
            {currentStageIndex === 1 && "Mark Patient Picked Up"}
            {currentStageIndex === 2 && "Start Transit to Hospital"}
            {currentStageIndex === 3 && "Mark Arrived at Emergency Bay"}
            {currentStageIndex === 0 && "Confirm Dispatch Acknowledgement"}
          </button>
        ) : (
          <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-center flex items-center justify-center gap-2 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Trip Complete — Patient Delivered to Emergency Bay</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Basic Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <User className="w-4 h-4" />
              <span>Patient Onboard Details</span>
            </div>
            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              {patient.callerSource}
            </span>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Name / Age:</span>
              <span className="font-bold text-slate-900">{patient.name}, {patient.age} yrs ({patient.gender})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reg #:</span>
              <span className="font-mono text-blue-700 font-bold">{patient.registrationNumber}</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 text-xs block mb-1">Reported Symptoms:</span>
              <div className="flex flex-wrap gap-1.5">
                {patient.reportedSymptoms.map((symp) => (
                  <span key={symp} className="text-xs px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 font-semibold">
                    {symp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nearest Hospital Auto-Assignment Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Hospital className="w-4 h-4" />
              <span>Auto-Assigned Destination</span>
            </div>
            <button
              onClick={() => setShowHospitalSelector(!showHospitalSelector)}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Change Hospital
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div className="font-extrabold text-slate-900 text-base">{assignedHospital.name}</div>
            <p className="text-xs text-slate-500 line-clamp-1">{assignedHospital.address}</p>

            <div className="flex items-center gap-2 pt-1">
              <div className="text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2 py-1 rounded font-mono font-bold">
                ETA: {assignedHospital.etaMins} mins ({assignedHospital.distanceKm} km)
              </div>
              <div className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 rounded font-mono font-bold">
                {assignedHospital.traumaCenterLevel}
              </div>
            </div>

            {/* Hospital Readiness Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[10px]">General Beds</span>
                <span className="font-extrabold text-emerald-600">{assignedHospital.generalBedsFree} free</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[10px]">ICU Beds</span>
                <span className="font-extrabold text-amber-600">{assignedHospital.icuBedsFree} free</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-500 block text-[10px]">OT Ready</span>
                <span className={`font-extrabold ${assignedHospital.otReady ? 'text-emerald-600' : 'text-red-600'}`}>
                  {assignedHospital.otReady ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Hospital Override Selection List */}
      {showHospitalSelector && (
        <div className="bg-slate-50 p-4 rounded-xl border border-blue-400 space-y-3 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-900">Ranked Nearby Hospitals</span>
            <button
              onClick={() => setShowHospitalSelector(false)}
              className="text-xs text-slate-500 hover:text-slate-900 font-bold"
            >
              Close ✕
            </button>
          </div>
          <div className="space-y-2">
            {mockHospitals.map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => {
                  onSelectHospital(hosp);
                  setShowHospitalSelector(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  hosp.id === assignedHospital.id
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold text-sm">{hosp.name}</div>
                  <div className="text-xs text-slate-500">
                    {hosp.distanceKm} km away • {hosp.etaMins} mins • {hosp.generalBedsFree} Beds Free • {hosp.icuBedsFree} ICU Free
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick-contact action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
        <span className="text-xs font-mono text-slate-500">Emergency Comms Dispatch:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSimulatedCall(patient.name, patient.emergencyContact.phone)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            Call Patient
          </button>
          <button
            onClick={() => handleSimulatedCall(assignedHospital.name, assignedHospital.contact)}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-300"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            Call Hospital
          </button>
          <button
            onClick={() => handleSimulatedCall("Control Dispatch HQ", "+91 108 000 112")}
            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-all border border-red-200"
          >
            <Phone className="w-3.5 h-3.5 text-red-600" />
            Control Room
          </button>
        </div>
      </div>
    </div>
  );
};
