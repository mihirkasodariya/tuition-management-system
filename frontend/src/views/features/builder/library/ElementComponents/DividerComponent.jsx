import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

const DividerComponent = ({
  uuid,
  style,
  styleClass,
  outerStyle,
  sectionDetails,
  blockDetails,
}) => {
  const { activeSection } = useSelector((state) => state.builderToolkitState);
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center',
        activeSection?.sub_block_uuid === uuid ? 'outline-2 outline-green-500 outline-dotted' : ''
      )}
      style={outerStyle}
    >
      <div
        id={uuid}
        data-section-uuid={sectionDetails?.uuid}
        data-block-uuid={blockDetails?.uuid}
        className={cn('w-full h-[1px]', styleClass)}
        style={style}
      ></div>
    </div>
  );
};

export default memo(DividerComponent);
