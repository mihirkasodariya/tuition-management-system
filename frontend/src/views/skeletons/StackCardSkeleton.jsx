import React from 'react';

const StackCardSkeleton = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
        <div className="h-6 w-32 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
    </div>
    <div className="mt-4 flex items-center space-x-2">
      <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
      <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

export default StackCardSkeleton;
