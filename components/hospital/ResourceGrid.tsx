'use client';

import React, { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ShieldCheck, Activity, Stethoscope, Microscope, Scan, Filter } from 'lucide-react';
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
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'Operation Theatre Equipment':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'Patient Monitoring Equipment':
        return <ShieldCheck className="w-4 h-4 text-cyan-600" />;
      case 'Diagnostic Imaging':
        return <Scan className="w-4 h-4 text-amber-600" />;
      case 'Laboratory':
        return <Microscope className="w-4 h-4 text-purple-600" />;
      default:
        return <Filter className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Category Tabs & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Facility Readiness &amp; Equipment Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              Interactive readiness matrix for emergency ambulance dispatch routing
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Filter Status:</span>
            {['All', 'Available', 'Limited', 'Critical'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  filterStatus === st
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-200 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
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
      </div>

      {/* Grid of Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredResources.map((res) => {
          return (
            <div
              key={res.id}
              onClick={() => cycleStatus(res.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none glass-panel-hover flex flex-col justify-between ${
                res.status === 'Available'
                  ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                  : res.status === 'Limited'
                  ? 'bg-amber-50/50 border-amber-200 hover:border-amber-400'
                  : 'bg-red-50/60 border-red-200 hover:border-red-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-sm text-slate-900">{res.name}</div>
                  <StatusBadge status={res.status} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  {getCategoryIcon(res.category)}
                  <span>{res.category}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <div className="text-xs font-mono">
                  <span className="text-slate-500">Available: </span>
                  <span
                    className={`font-extrabold text-base ${
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

                <div className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-mono font-bold">
                  <span>Toggle</span>
                  <span>↺</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
