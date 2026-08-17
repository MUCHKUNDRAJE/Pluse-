'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { mockHospitals } from '@/lib/mockData';
import { SectionCard } from '@/components/shared/SectionCard';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

export const BedOccupancyChart: React.FC = () => {
  const deptData = mockHospitals[0].departmentOccupancy;

  const totalGeneralOccupied = deptData.reduce((acc, d) => acc + d.generalOccupied, 0);
  const totalGeneralFree = deptData.reduce((acc, d) => acc + d.generalFree, 0);
  const totalIcuOccupied = deptData.reduce((acc, d) => acc + d.icuOccupied, 0);
  const totalIcuFree = deptData.reduce((acc, d) => acc + d.icuFree, 0);

  const overallDonutData = [
    { name: 'General Beds Occupied', value: totalGeneralOccupied, color: '#EF4444' },
    { name: 'General Beds Free', value: totalGeneralFree, color: '#10B981' },
    { name: 'ICU Beds Occupied', value: totalIcuOccupied, color: '#F59E0B' },
    { name: 'ICU Beds Free', value: totalIcuFree, color: '#3B82F6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Departmental Breakdown Bar Chart */}
      <div className="lg:col-span-2">
        <SectionCard
          title={
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Departmental Bed &amp; ICU Occupancy Breakdown
            </div>
          }
          subtitle="Real-time capacity tracking across General, ICU, Emergency, Maternity, and Pediatric units"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="department" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', color: '#0F172A', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="generalOccupied" name="General Occupied (Red)" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="generalFree" name="General Free (Green)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icuOccupied" name="ICU Occupied (Yellow)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="icuFree" name="ICU Free (Blue)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Donut Chart Capacity Summary */}
      <div>
        <SectionCard
          title={
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              Overall Hospital Occupancy Ratio
            </div>
          }
          subtitle="General vs. ICU beds allocation status"
        >
          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overallDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {overallDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xl font-extrabold font-mono text-slate-900">
                {Math.round(((totalGeneralOccupied + totalIcuOccupied) / (totalGeneralOccupied + totalGeneralFree + totalIcuOccupied + totalIcuFree)) * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Capacity Busy</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-700">Gen Busy ({totalGeneralOccupied})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-700">Gen Free ({totalGeneralFree})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-700">ICU Busy ({totalIcuOccupied})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-slate-700">ICU Free ({totalIcuFree})</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};
