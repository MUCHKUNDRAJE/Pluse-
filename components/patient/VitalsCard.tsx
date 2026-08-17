'use client';

import React from 'react';
import { SectionCard } from '@/components/shared/SectionCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Heart, Activity, Thermometer, Droplet, UserCheck, ShieldAlert, Pill, PhoneCall, AlertTriangle } from 'lucide-react';
import { Patient } from '@/lib/mockData';

interface VitalsCardProps {
  patient: Patient;
}

export const VitalsCard: React.FC<VitalsCardProps> = ({ patient }) => {
  const { vitals } = patient;

  const getStatusColor = (status: 'normal' | 'warning' | 'critical') => {
    switch (status) {
      case 'critical':
        return 'text-red-800 border-red-300 bg-red-50';
      case 'warning':
        return 'text-amber-900 border-amber-300 bg-amber-50';
      default:
        return 'text-emerald-900 border-emerald-300 bg-emerald-50';
    }
  };

  return (
    <SectionCard
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <Activity className="w-5 h-5 text-red-600 animate-pulse" />
            Patient Clinical Report &amp; Live Telemetry
          </div>
          <span className="text-xs font-mono text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-bold">
            {patient.registrationNumber}
          </span>
        </div>
      }
      subtitle="Transmitted directly to en-route ambulance and receiving emergency room"
    >
      <div className="space-y-6">
        {/* Patient Demographic Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
          <div>
            <span className="text-slate-500 text-xs block">Full Name:</span>
            <span className="font-bold text-slate-900">{patient.name}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">Age / Gender:</span>
            <span className="font-semibold text-slate-800">{patient.age} yrs • {patient.gender}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">Call Placed By:</span>
            <span className="font-semibold text-blue-700">{patient.callerSource}</span>
          </div>
          <div>
            <span className="text-slate-500 text-xs block">Dispatch Priority:</span>
            <StatusBadge status="critical" label="CRITICAL CODE RED" size="sm" />
          </div>
        </div>

        {/* Dynamic Vitals Grid */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-slate-500 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            Live Vital Signs (Range Indicators)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* BP */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm ${getStatusColor(vitals.bpStatus)}`}>
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Blood Pressure</span>
                <Heart className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold font-mono text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic}</span>
                <span className="text-[10px] block text-slate-600">mmHg (Syst/Diast)</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-red-700">
                {vitals.bpStatus === 'critical' ? 'Elevated Critical' : 'Normal'}
              </span>
            </div>

            {/* Blood Sugar */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm ${getStatusColor(vitals.bloodSugarStatus)}`}>
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Blood Sugar</span>
                <Droplet className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold font-mono text-slate-900">{vitals.bloodSugar}</span>
                <span className="text-[10px] block text-slate-600">mg/dL (Random)</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-800">
                {vitals.bloodSugarStatus === 'warning' ? 'Slightly High' : 'Normal'}
              </span>
            </div>

            {/* Pulse */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm ${getStatusColor(vitals.heartRateStatus)}`}>
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Heart Rate</span>
                <Activity className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold font-mono text-slate-900">{vitals.heartRate}</span>
                <span className="text-[10px] block text-slate-600">BPM (Tachycardia)</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-800">
                {vitals.heartRateStatus === 'warning' ? 'Elevated' : 'Normal'}
              </span>
            </div>

            {/* SpO2 */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm ${getStatusColor(vitals.spo2Status)}`}>
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>SpO₂ Saturation</span>
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold font-mono text-slate-900">{vitals.spo2}%</span>
                <span className="text-[10px] block text-slate-600">O2 Oxygen Level</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-amber-800">
                {vitals.spo2Status === 'warning' ? 'Mild Hypoxia' : 'Normal'}
              </span>
            </div>

            {/* Temp */}
            <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-sm ${getStatusColor(vitals.tempStatus)}`}>
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Temperature</span>
                <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="my-2">
                <span className="text-xl font-extrabold font-mono text-slate-900">{vitals.temperature}°F</span>
                <span className="text-[10px] block text-slate-600">Body Temp</span>
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                {vitals.tempStatus === 'normal' ? 'Afebrile Normal' : 'Fever'}
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms, Allergies & Known Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Reported Symptoms
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {patient.reportedSymptoms.map((symp) => (
                <span key={symp} className="px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-lg text-xs font-bold shadow-sm">
                  {symp}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-purple-600" />
              Allergies &amp; Ongoing Medications
            </span>
            <div className="space-y-1 text-xs">
              <div>
                <span className="text-slate-500">Allergies: </span>
                <span className="font-bold text-red-600">{patient.allergies.join(', ')}</span>
              </div>
              <div>
                <span className="text-slate-500">Medications: </span>
                <span className="text-slate-800">{patient.medications.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Info */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Emergency Contact (Placed Call)</div>
              <div className="font-bold text-slate-900 text-sm">
                {patient.emergencyContact.name} ({patient.emergencyContact.relation})
              </div>
            </div>
          </div>

          <a
            href={`tel:${patient.emergencyContact.phone}`}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call {patient.emergencyContact.phone}</span>
          </a>
        </div>
      </div>
    </SectionCard>
  );
};
