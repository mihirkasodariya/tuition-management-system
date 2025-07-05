import React, { memo } from 'react';

const ElementLayoutCart = ({ label, Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed rounded-xl p-3 group hover:shadow-md hover:border-black cursor-pointer">
      <Icon className="p-2 h-9 w-9 bg-gray-100 rounded-full" />
      <h2 className="text-sm">{label}</h2>
    </div>
  );
};

export default memo(ElementLayoutCart);
