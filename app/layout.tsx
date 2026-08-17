import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Activity, ShieldAlert, Truck, Hospital, User, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pulse — Emergency Ambulance Dispatch Platform',
  description: 'One tap. Fastest help. Connecting Patients, Ambulance Drivers, and Emergency Hospitals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans antialiased">
        {/* Global Emergency Header */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              Pulse
                </span>
                <span className="text-[10px] font-mono block text-red-600 font-bold uppercase tracking-wider">
                  Emergency Dispatch System
                </span>
              </div>
            </Link>

            {/* Role Shortcut Links */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/ambulance"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-all"
              >
                <Truck className="w-4 h-4 text-amber-600" />
                Ambulance Driver
              </Link>

              <Link
                href="/hospital"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-all"
              >
                <Hospital className="w-4 h-4 text-blue-600" />
                Hospital Ops
              </Link>

              <Link
                href="/patient"
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition-all"
              >
                <User className="w-4 h-4 text-emerald-600" />
                Patient Status
              </Link>
            </nav>

            {/* Hotline Badge */}
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-red-700 shadow-sm">
              <PhoneCall className="w-4 h-4 text-red-600 animate-bounce" />
              <span>HOTLINE: 108</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 font-mono">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>Call &amp; Report © 2026 Emergency Care Platform • All Rights Reserved</span>
            <div className="flex items-center gap-4 text-slate-600">
              <span>Next.js App Router</span>
              <span>•</span>
              <span>Light Mode Map</span>
              <span>•</span>
              <span>Inter Font</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
