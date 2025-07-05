import React from 'react';
import StackCardSkeleton from './StackCardSkeleton';
import { ChartSkeleton } from './ChartSkeleton';

const DashboardSkeleton = () => {
  return (
    <div className="h-screen w-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-64 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="flex space-x-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse" />
          <div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <StackCardSkeleton key={index} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <ChartSkeleton height="h-96" />
        <ChartSkeleton height="h-96" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
