'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ShieldCheck, Activity, Stethoscope, Microscope, Scan, Filter, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { mockHospitals, HospitalResource } from '@/lib/mockData';

export const ResourceGrid: React.FC = () => {
  const initialResources = mockHospitals[0].resources;
  const [resources, setResources] = useState<HospitalResource[]>(initialResources);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const categories = [
    'All',
    'General Capacity',
    'Operation Theatre Equipment',
    'Patient Monitoring Equipment',
    'Diagnostic Imaging',
    'Laboratory'
  ];

  const statusFilters: { label: string; value: string; icon: React.ReactNode; activeClass: string }[] = [
    { label: 'All', value: 'All', icon: <Filter className="w-3.5 h-3.5" />, activeClass: 'bg-blue-600 text-white border-blue-600' },
    { label: 'Available', value: 'Available', icon: <CheckCircle2 className="w-3.5 h-3.5" />, activeClass: 'bg-emerald-600 text-white border-emerald-600' },
    { label: 'Limited', value: 'Limited', icon: <AlertTriangle className="w-3.5 h-3.5" />, activeClass: 'bg-amber-500 text-white border-amber-500' },
    { label: 'Critical', value: 'Critical', icon: <AlertOctagon className="w-3.5 h-3.5" />, activeClass: 'bg-red-600 text-white border-red-600' },
  ];

  const cycleStatus = (id: string) => {
    setResources((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let nextStatus: 'Available' | 'Limited' | 'Critical';
          let nextAvail = item.available;

          if (item.status === 'Available') {
            nextStatus = 'Limited';
            nextAvail = Math.max(0, item.available - 1);
          } else if (item.status === 'Limited') {
            nextStatus = 'Critical';
            nextAvail = 0;
          } else {
            nextStatus = 'Available';
            nextAvail = item.total;
          }

          return { ...item, status: nextStatus, available: nextAvail };
        }
        return item;
      })
    );
  };

  const filteredResources = resources.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStat = filterStatus === 'All' || item.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesCat && matchesStat;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'General Capacity':
        return <Activity className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'Operation Theatre Equipment':
        return <Stethoscope className="w-4 h-4 text-blue-600 flex-shrink-0" />;
      case 'Patient Monitoring Equipment':
        return <ShieldCheck className="w-4 h-4 text-cyan-600 flex-shrink-0" />;
      case 'Diagnostic Imaging':
        return <Scan className="w-4 h-4 text-amber-600 flex-shrink-0" />;
      case 'Laboratory':
        return <Microscope className="w-4 h-4 text-purple-600 flex-shrink-0" />;
      default:
        return <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    }
  };

  // Count per status for summary badges
  const counts = {
    available: resources.filter((r) => r.status === 'Available').length,
    limited: resources.filter((r) => r.status === 'Limited').length,
    critical: resources.filter((r) => r.status === 'Critical').length,
  };

  return (
    <div className="space-y-4">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            Facility Readiness &amp; Equipment Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive readiness matrix for emergency ambulance dispatch routing
          </p>
        </div>

        {/* Status Summary Chips */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
            ✓ {counts.available} OK
          </span>
          <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold">
            ⚠ {counts.limited} Limited
          </span>
          <span className="text-xs px-2 py-1 rounded-lg bg-red-50 border border-red-200 text-red-700 font-bold">
            ✕ {counts.critical} Critical
          </span>
        </div>
      </div>

      {/* ── Status Filter Row (scrollable on mobile) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-500 font-mono whitespace-nowrap flex-shrink-0">Filter:</span>
        {statusFilters.map((sf) => (
          <button
            key={sf.value}
            onClick={() => setFilterStatus(sf.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 ${
              filterStatus === sf.value
                ? sf.activeClass + ' shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {sf.icon}
            <span>{sf.label}</span>
          </button>
        ))}
      </div>

      {/* ── Category Pills (scrollable on mobile) ── */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* ── Resource Cards Grid ── */}
      {filteredResources.length === 0 ? (
        <div className="py-10 text-center text-slate-400 text-sm">
          No resources match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              onClick={() => cycleStatus(res.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none active:scale-95 flex flex-col justify-between min-h-[110px] ${
                res.status === 'Available'
                  ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                  : res.status === 'Limited'
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                  : 'bg-red-50/60 border-red-200 hover:border-red-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-sm text-slate-900 leading-tight">{res.name}</div>
                  <StatusBadge status={res.status} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {getCategoryIcon(res.category)}
                  <span className="line-clamp-1">{res.category}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <div className="text-xs font-mono">
                  <span className="text-slate-500">Available: </span>
                  <span
                    className={`font-extrabold text-sm ${
                      res.status === 'Available'
                        ? 'text-emerald-700'
                        : res.status === 'Limited'
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {res.available} / {res.total}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono font-bold flex items-center gap-0.5">
                  <span>Tap to toggle</span>
                  <span>↺</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
