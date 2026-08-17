import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-700/80 flex items-center justify-center text-red-400 animate-bounce">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h2 className="text-3xl font-extrabold text-white">404 — Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-md">
        The emergency dispatch route or resource page you are trying to access does not exist.
      </p>

      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
      >
        <Home className="w-4 h-4" />
        <span>Return to Call &amp; Report Home</span>
      </Link>
    </div>
  );
}
