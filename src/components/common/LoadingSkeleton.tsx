import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse p-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200/70 dark:bg-slate-800/70 rounded-md w-full"></div>
        ))}
      </div>
    </div>
  );
};
