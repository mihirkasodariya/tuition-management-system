import React, { memo } from 'react';
import Canvas from './Canvas';

const BuilderView = () => {
  return (
    <div>
      <Canvas />
    </div>
  );
};

export default memo(BuilderView);
