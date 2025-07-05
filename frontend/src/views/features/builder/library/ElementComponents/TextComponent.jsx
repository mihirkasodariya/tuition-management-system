import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

const TextComponent = ({ content, style, styleClass, uuid, sectionDetails, blockDetails }) => {
  const { activeSection, builderEditMode } = useSelector((state) => state.builderToolkitState);
  return (
    <div
      className={cn(
        activeSection?.sub_block_uuid === uuid ? 'outline-2 outline-green-500 outline-dotted' : ''
      )}
    >
      <p
        id={uuid}
        data-section-uuid={sectionDetails?.uuid}
        data-block-uuid={blockDetails?.uuid}
        className={cn('w-auto', styleClass)}
        style={style}
      >
        {content}
      </p>
    </div>
  );
};

export default memo(TextComponent);
