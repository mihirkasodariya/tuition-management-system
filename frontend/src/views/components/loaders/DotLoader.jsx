import React, { memo } from 'react';
import '@/assets/css/loaders/dot-loader.css';
import { cn } from '@/lib/utils';
import PropTypes from 'prop-types';

const DotsLoader = ({ parentClass }) => {
  return (
    <div className={cn('w-full justify-center items-center', parentClass)}>
      <div className="dot-loader1 m-auto"></div>
    </div>
  );
};

DotsLoader.prototype = {
  parentClass: PropTypes.string,
};
export default memo(DotsLoader);
