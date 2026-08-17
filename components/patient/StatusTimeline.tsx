'use client';

import React from 'react';
import { SectionCard } from '@/components/shared/SectionCard';
import { Clock, Phone, Truck, UserCheck, Hospital, CheckCircle2 } from 'lucide-react';
import { mockTimelineEvents } from '@/lib/mockData';

export const StatusTimeline: React.FC = () => {
  const getEventIcon = (iconType: string) => {
    switch (iconType) {
      case 'phone':
        return <Phone className="w-4 h-4 text-blue-600" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-amber-600" />;
      case 'user':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'hospital':
        return <Hospital className="w-4 h-4 text-purple-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <SectionCard
      title={
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Clock className="w-5 h-5 text-blue-600" />
          Incident Event Audit Log &amp; Post-Incident Timeline
        </div>
      }
      subtitle="Verifiable chronological log for dispatch center, ambulance crew, and emergency room"
    >
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {mockTimelineEvents.map((evt) => (
          <div key={evt.id} className="relative flex items-start gap-4 group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-6 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                evt.completed
                  ? 'bg-white border-emerald-600 shadow-sm'
                  : 'bg-slate-100 border-slate-300 text-slate-400'
              }`}
            >
              {getEventIcon(evt.iconType)}
            </div>

            <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm text-slate-900">{evt.stageName}</span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded font-medium ${
                    evt.completed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {evt.timestamp}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};
