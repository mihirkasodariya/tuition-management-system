import React, { memo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import _ from 'lodash';
import ColumnComponent from './library/LayoutElements/ColumnComponent';
import { LucideMove } from 'lucide-react';
import { cn } from '@/lib/utils';
import RowComponent from './library/LayoutElements/RowComponent';

const Canvas = () => {
  const dispatch = useDispatch();
  const { setDragLayoutAction, setTemplateDataAction } = builderActions;
  const { screenSize, dragLayout, templateSections, builderEditMode } = useSelector(
    (state) => state.builderToolkitState
  );
  const [info, setInfo] = useState({
    dragOver: false,
    dragOverClass: 'bg-white',
  });

  const layoutDragOverFunction = useCallback(
    (e) => {
      e.preventDefault();

      if (!info?.dragOver) {
        let dragOverClass =
          dragLayout.type === 'column' || dragLayout.type === 'row' ? 'bg-green-200' : 'bg-red-200';
        setInfo((prev) => ({
          ...prev,
          dragOver: true,
          dragOverClass,
        }));
      }
    },
    [info?.dragOver, info?.dragOverClass, templateSections, dragLayout]
  );

  const layoutDropHandler = (e) => {
    let infoState = { dragOver: false, dragOverClass: 'bg-white' };
    if (dragLayout?.type === 'column' || dragLayout?.type === 'row') {
      let updatedSections = _.cloneDeep(templateSections || []);
      updatedSections.push(dragLayout?.json);
      dispatch(setTemplateDataAction(updatedSections));
    }

    dispatch(setDragLayoutAction(null));
    setInfo((prev) => ({
      ...prev,
      ...infoState,
    }));
  };

  const layoutDragLeaveFunction = useCallback(() => {
    setInfo((prev) => ({ ...prev, dragOver: false, dragOverClass: 'bg-white' }));
  }, []);

  const componentRenderObject = {
    column: ColumnComponent,
    row: RowComponent,
  };

  return (
    <div className={cn(builderEditMode ? 'flex justify-center' : 'flex justify-center')}>
      <div className={`relative w-full ${screenSize === 'mobile' ? 'mx-auto my-8' : ''}`}>
        {/* Mobile device frame - only shown in edit mode */}
        {screenSize === 'mobile' && builderEditMode && (
          <div
            className="absolute inset-0 border-8 border-gray-800 rounded-[2rem] pointer-events-none z-10"
            style={{
              boxShadow:
                '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-lg"></div>
            {/* Home button indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gray-300 rounded-full"></div>
          </div>
        )}

        {/* Actual canvas content */}
        <div
          className={`w-full m-auto ${screenSize === 'desktop' ? 'max-w-6xl' : 'max-w-md'} ${
            info?.dragOverClass
          } ${
            screenSize === 'mobile'
              ? builderEditMode
                ? 'mx-auto border-8 border-transparent rounded-[1.5rem] overflow-hidden bg-white'
                : 'mx-auto'
              : ''
          }`}
          style={{
            height: screenSize === 'mobile' ? '600px' : 'auto',
            width: screenSize === 'mobile' ? (builderEditMode ? '320px' : '100%') : '100%',
          }}
          onDragOver={layoutDragOverFunction}
          onDrop={layoutDropHandler}
          onDragLeave={layoutDragLeaveFunction}
        >
          {/* Scrollable content container */}
          <div className={`${screenSize === 'mobile' ? 'h-full overflow-y-auto' : ''}`}>
            <div className={`${builderEditMode && (screenSize === 'mobile' ? 'p-4' : 'p-6')}`}>
              {_.size(templateSections) > 0
                ? templateSections?.map((block, index) => {
                    const Comp = componentRenderObject[block?.type];
                    return <Comp key={block?.uuid || index} layout={block} sectionIndex={index} />;
                  })
                : builderEditMode && (
                    <div
                      className={`p-4 text-center flex justify-center items-center bg-gray-100 border border-dashed ${
                        screenSize === 'mobile' ? 'h-[500px]' : ''
                      }`}
                    >
                      <LucideMove className="mr-2" />
                      <h2>Drag and Drop Layout</h2>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Canvas);
