import React, { memo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const BoardSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: isMobile ? 4 : 6 }).map((_, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-semibold bg-gray-300 h-6 w-32 rounded animate-pulse"></CardTitle>
                <CardDescription className="mt-1 bg-gray-300 h-4 w-48 rounded animate-pulse"></CardDescription>
              </div>
              <Badge className="bg-gray-300 h-6 w-16 rounded animate-pulse"></Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground bg-gray-300 h-4 w-24 rounded animate-pulse"></p>
                <p className="bg-gray-300 h-4 w-32 rounded animate-pulse"></p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground bg-gray-300 h-4 w-24 rounded animate-pulse"></p>
                <p className="bg-gray-300 h-4 w-32 rounded animate-pulse"></p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground bg-gray-300 h-4 w-24 rounded animate-pulse"></p>
                <p className="bg-gray-300 h-4 w-32 rounded animate-pulse"></p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground bg-gray-300 h-4 w-24 rounded animate-pulse"></p>
                <p className="bg-gray-300 h-4 w-32 rounded animate-pulse"></p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default memo(BoardSkeleton);
