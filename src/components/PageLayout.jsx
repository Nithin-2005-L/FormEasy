import React from 'react';
import { Link } from 'react-router-dom';

const PageLayout = ({ title, subtitle, children, action }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        {/* Top bar aligned with landing page */}
        <header className="mb-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-500 shadow-lg shadow-sky-500/30">
              <span className="text-lg font-bold text-slate-950">F</span>
            </div>
            <span className="text-base sm:text-lg font-semibold tracking-tight">
              FormEasy
            </span>
          </Link>
          {action}
        </header>

        {/* Card */}
        <main className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7 shadow-xl shadow-slate-900/60">
          {(title || subtitle) && (
            <div className="mb-6 space-y-1">
              {title && (
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-50">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-300">{subtitle}</p>
              )}
            </div>
          )}
          <div className="text-slate-100">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PageLayout;


