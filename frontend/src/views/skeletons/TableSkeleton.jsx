import React from 'react';

const TableSkeleton = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
          <div className="h-8 w-24 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 border-b border-gray-100 pb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
        ))}
      </div>

      {/* Table Rows */}
      {[...Array(5)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 py-3">
          {[...Array(4)].map((_, colIndex) => (
            <div
              key={colIndex}
              className={`h-4 rounded bg-gray-200 animate-pulse ${
                colIndex === 0 ? 'w-32' : 'w-24'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default TableSkeleton;
