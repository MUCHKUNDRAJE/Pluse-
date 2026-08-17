'use client';

import React, { useState } from 'react';
import { StageStepper } from '@/components/shared/StageStepper';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Phone, Hospital, User, CheckCircle2, ChevronRight, RefreshCw, ShieldCheck } from 'lucide-react';
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
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 sm:space-y-5 text-slate-900">
      {/* Toast Notification */}
      {callNotification && (
        <div className="bg-blue-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between animate-bounce shadow-md">
          <div className="flex items-center gap-2 truncate">
            <Phone className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
            <span className="truncate">{callNotification}</span>
          </div>
          <span className="text-[10px] sm:text-xs bg-blue-800 px-2 py-0.5 rounded font-mono flex-shrink-0">CONNECTING</span>
        </div>
      )}

      {/* Stage Stepper Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase text-slate-500">Call Stage Progress</span>
          <StatusBadge
            status={currentStageIndex >= 3 ? 'in-progress' : 'dispatched'}
            label={stages[currentStageIndex]}
            size="sm"
          />
        </div>
        <StageStepper stages={stages} currentStageIndex={currentStageIndex} />
      </div>

      {/* Main Action Button (Solid Red Color, No Gradient) */}
      <div className="pt-1">
        {currentStageIndex < 4 ? (
          <button
            onClick={onAdvanceStage}
            className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-lg tracking-wide uppercase shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
            {currentStageIndex === 1 && "Mark Patient Picked Up"}
            {currentStageIndex === 2 && "Start Transit to Hospital"}
            {currentStageIndex === 3 && "Mark Arrived at Emergency Bay"}
            {currentStageIndex === 0 && "Confirm Dispatch Acknowledgement"}
          </button>
        ) : (
          <div className="w-full py-3 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-center flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Trip Complete — Patient Handover Done</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Basic Info Card */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs sm:text-sm">
              <User className="w-4 h-4" />
              <span>Patient Onboard Details</span>
            </div>
            <span className="text-[10px] sm:text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              {patient.callerSource}
            </span>
          </div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Name / Age:</span>
              <span className="font-bold text-slate-900">{patient.name}, {patient.age}y</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reg #:</span>
              <span className="font-mono text-blue-700 font-bold">{patient.registrationNumber}</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-500 text-[11px] block mb-1">Symptoms:</span>
              <div className="flex flex-wrap gap-1">
                {patient.reportedSymptoms.map((symp) => (
                  <span key={symp} className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-red-100 border border-red-200 text-red-700 font-semibold">
                    {symp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nearest Hospital Auto-Assignment Summary */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 relative">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs sm:text-sm">
              <Hospital className="w-4 h-4" />
              <span>Assigned Hospital</span>
            </div>
            <button
              onClick={() => setShowHospitalSelector(!showHospitalSelector)}
              className="text-[11px] text-blue-600 hover:text-blue-800 underline font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Change
            </button>
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="font-extrabold text-slate-900 text-sm sm:text-base line-clamp-1">{assignedHospital.name}</div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{assignedHospital.address}</p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <div className="text-[10px] sm:text-xs bg-blue-50 border border-blue-200 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                ETA: {assignedHospital.etaMins}m ({assignedHospital.distanceKm}km)
              </div>
              <div className="text-[10px] sm:text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold truncate">
                {assignedHospital.traumaCenterLevel}
              </div>
            </div>

            {/* Hospital Readiness Stats */}
            <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-200 text-center text-[10px] sm:text-xs">
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px]">Gen Beds</span>
                <span className="font-extrabold text-emerald-600">{assignedHospital.generalBedsFree} free</span>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px]">ICU Beds</span>
                <span className="font-extrabold text-amber-600">{assignedHospital.icuBedsFree} free</span>
              </div>
              <div className="bg-white p-1 rounded border border-slate-200">
                <span className="text-slate-500 block text-[9px]">OT Ready</span>
                <span className={`font-extrabold ${assignedHospital.otReady ? 'text-emerald-600' : 'text-red-600'}`}>
                  {assignedHospital.otReady ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Hospital Override Selector */}
      {showHospitalSelector && (
        <div className="bg-slate-50 p-3.5 rounded-xl border border-blue-400 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 text-xs">
            <span className="font-bold text-slate-900">Nearby Hospitals (Min Distance)</span>
            <button
              onClick={() => setShowHospitalSelector(false)}
              className="text-[11px] text-slate-500 hover:text-slate-900 font-bold"
            >
              Close ✕
            </button>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {mockHospitals.map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => {
                  onSelectHospital(hosp);
                  setShowHospitalSelector(false);
                }}
                className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between text-xs ${
                  hosp.id === assignedHospital.id
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div>
                  <div className="font-bold text-xs truncate max-w-[200px] sm:max-w-none">{hosp.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {hosp.distanceKm} km • {hosp.etaMins} mins • {hosp.generalBedsFree} Beds Free
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick-contact action buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
        <span className="text-[11px] font-mono text-slate-500">Emergency Dispatch Comms:</span>
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => handleSimulatedCall(patient.name, patient.emergencyContact.phone)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all border border-slate-300"
          >
            <Phone className="w-3 h-3 text-emerald-600" />
            <span>Patient</span>
          </button>
          <button
            onClick={() => handleSimulatedCall(assignedHospital.name, assignedHospital.contact)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-all border border-slate-300"
          >
            <Phone className="w-3 h-3 text-blue-600" />
            <span>Hospital</span>
          </button>
          <button
            onClick={() => handleSimulatedCall("Control Dispatch HQ", "+91 108 000 112")}
            className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-all border border-red-200"
          >
            <Phone className="w-3 h-3 text-red-600" />
            <span>Control</span>
          </button>
        </div>
      </div>
    </div>
  );
};
