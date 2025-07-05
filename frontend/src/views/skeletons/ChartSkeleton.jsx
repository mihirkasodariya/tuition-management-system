import React from 'react';

export const ChartSkeleton = ({ height = 'h-72' }) => (
  <div className={`rounded-xl bg-white p-6 shadow-sm ${height}`}>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="h-full w-full min-h-[180px] rounded-lg bg-gray-100 animate-pulse" />
    </div>
  </div>
);
