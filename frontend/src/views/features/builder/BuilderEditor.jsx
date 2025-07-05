import BuilderHeader from '@/views/components/builder/header/Header';
import React, { memo } from 'react';
import ElementSidebar from './ElementSidebar';
import SidebarSettings from './SidebarSettings';
import Canvas from './Canvas';

const BuilderEditor = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="h-[10%] min-h-[60px]">
        <BuilderHeader />
      </div>

      <div className="grid grid-cols-5 flex-1 overflow-hidden border-t-2 border-gray-200">
        {/* Elements Sidebar */}
        <div className="overflow-y-auto">
          <ElementSidebar />
        </div>

        {/* Main Canvas */}
        <div className="col-span-3 bg-gray-100 overflow-y-auto">
          <Canvas />
        </div>

        {/* Settings Sidebar */}
        <div className="overflow-y-auto">
          <SidebarSettings />
        </div>
      </div>
    </div>
  );
};

export default memo(BuilderEditor);
