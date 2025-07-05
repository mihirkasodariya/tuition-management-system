import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { useSelector } from 'react-redux';

const TextEditorComponent = ({
  content,
  style,
  styleClass,
  uuid,
  sectionDetails,
  blockDetails,
}) => {
  const { activeSection, builderEditMode } = useSelector((state) => state.builderToolkitState);
  return (
    <div
      className={cn(
        'h-auto',
        activeSection?.sub_block_uuid === uuid ? 'outline-2 outline-green-500 outline-dotted' : ''
      )}
    >
      <div
        id={uuid}
        data-section-uuid={sectionDetails?.uuid}
        data-block-uuid={blockDetails?.uuid}
        className={cn('w-auto h-full', styleClass)}
        style={style}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default memo(TextEditorComponent);
