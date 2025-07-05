import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, MousePointer, ArrowRight } from 'lucide-react';

const NoSelectionPlaceholder = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <Card className="w-full bg-gray-50 border-dashed">
        <CardContent className="pt-6 pb-6">
          <div className="mb-4 bg-gray-100 h-12 w-12 rounded-full flex items-center justify-center mx-auto">
            <MousePointer className="h-6 w-6 text-gray-500" />
          </div>

          <h3 className="text-lg font-medium mb-2">No Element Selected</h3>

          <p className="text-gray-500 mb-6">
            Select an element from the canvas to edit its properties and styling options.
          </p>

          <div className="bg-white p-2 rounded-md border text-left">
            <div className="flex items-start mb-3">
              <div className="mr-3 mt-1">
                <div className="bg-blue-100 rounded-full p-1">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">How to select an element</h4>
                <p className="text-xs text-gray-500">
                  Click on any element in the canvas area to display its settings here.
                </p>
              </div>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <span>Drag Layout</span>
              <ArrowRight className="h-3 w-3 mx-1" />
              <span>Drag Element</span>
              <ArrowRight className="h-3 w-3 mx-1" />
              <span>Select Element</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(NoSelectionPlaceholder);
