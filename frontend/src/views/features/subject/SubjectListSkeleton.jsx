import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SubjectListSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading Skeleton */}
      <Skeleton className="h-8 w-48 mb-6" />

      {/* Filters Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-24 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={`header-${i}`} className="h-5 w-full" />
          ))}
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-7 gap-4 px-6 py-4">
              {[...Array(7)].map((_, cellIndex) => (
                <Skeleton key={`cell-${rowIndex}-${cellIndex}`} className="h-5 w-full" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(SubjectListSkeleton);
