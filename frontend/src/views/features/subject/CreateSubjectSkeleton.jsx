import React, { memo } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CreateSubjectSkeleton = () => {
  // Mock array for skeleton items
  const mockChapters = [1]; // Show 2 chapter skeletons
  const mockSubchapters = [1, 2]; // Show 2 subchapter skeletons per chapter

  return (
    <div className="container mx-auto py-4 max-md:px-0">
      <Card className="mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-[200px] max-md:w-full" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Chapters Section Skeleton */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-[100px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>

            {mockChapters.map((chapter) => (
              <Card key={chapter} className="bg-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-[120px]" />
                    <Skeleton className="h-8 w-[80px]" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[50px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[70px]" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Subchapters Section Skeleton */}
                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-[100px]" />
                      <Skeleton className="h-8 w-[130px]" />
                    </div>

                    {mockSubchapters.map((subchapter) => (
                      <div key={subchapter} className="pl-4 border-l-2 border-gray-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-6 w-[70px]" />
                        </div>

                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[50px]" />
                          <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[60px]" />
                          <Skeleton className="h-10 w-full" />
                        </div>

                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[70px]" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-[150px]" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default memo(CreateSubjectSkeleton);
