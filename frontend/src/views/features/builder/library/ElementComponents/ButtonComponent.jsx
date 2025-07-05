import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

const ButtonComponent = ({
  uuid,
  content,
  style,
  url = '',
  styleClass = '',
  sectionDetails,
  blockDetails,
}) => {
  const { activeSection, builderEditMode } = useSelector((state) => state.builderToolkitState);
  return (
    <div
      className={cn(
        activeSection?.sub_block_uuid === uuid ? 'outline-2 outline-green-500 outline-dotted' : ''
      )}
    >
      <a
        href={builderEditMode ? null : url}
        id={uuid}
        data-section-uuid={sectionDetails?.uuid}
        data-block-uuid={blockDetails?.uuid}
      >
        <button style={style} className={cn('m-0 p-0', styleClass)}>
          {content}
        </button>
      </a>
    </div>
  );
};

export default memo(ButtonComponent);
