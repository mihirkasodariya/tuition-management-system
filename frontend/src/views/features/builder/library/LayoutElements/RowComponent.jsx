import React, { memo, useState } from 'react';
import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import ButtonComponent from '../ElementComponents/ButtonComponent';
import TextComponent from '../ElementComponents/TextComponent';
import DividerComponent from '../ElementComponents/DividerComponent';
import ImageComponent from '../ElementComponents/ImageComponent';
import { cn } from '@/lib/utils';
import TextEditorComponent from '../ElementComponents/TextEditorComponent';
import VideoComponent from '../ElementComponents/VideoComponent';

const RowComponent = ({ layout, sectionIndex }) => {
  const dispatch = useDispatch();
  const { setDragLayoutAction, setTemplateDataAction, setActiveSectionAction } = builderActions;
  const { dragLayout, templateSections, activeSection } = useSelector(
    (state) => state.builderToolkitState
  );

  const elementTypesConstants = {
    button: ButtonComponent,
    text: TextComponent,
    editor: TextEditorComponent,
    divider: DividerComponent,
    image: ImageComponent,
    video: VideoComponent,
  };

  const [info, setInfo] = useState({
    dragOver: null,
    dragOverClass: '',
  });

  const onDragOverHandler = (event, index) => {
    event.preventDefault();
    let dragOver = { index, columns: layout.uuid };

    setInfo((prev) => ({
      ...prev,
      dragOver,
      dragOverClass: 'bg-purple-200',
    }));
  };

  const onDragLeaveHandler = () => {
    setInfo((prev) => ({
      ...prev,
      dragOver: null,
      dragOverClass: '',
    }));
  };

  const onDropHandler = () => {
    if (dragLayout) {
      let updatedSections = _.cloneDeep(templateSections || []);
      let index = info?.dragOver?.index;
      let json = _.cloneDeep(dragLayout);
      delete json.icon;
      updatedSections[sectionIndex].block[index].subBlock.push(json);
      dispatch(setTemplateDataAction(updatedSections));
    }
    dispatch(setDragLayoutAction(null));
    setInfo((prev) => ({
      ...prev,
      dragOver: null,
      dragOverClass: '',
    }));
  };

  const setActiveElementFunction = (block, blockIndex, subBlockId, subBlockIndex) => {
    let data = {
      section_uuid: layout?.uuid,
      block_uuid: block?.uuid,
      sub_block_uuid: subBlockId,
      block_index: blockIndex,
      sub_block_index: subBlockIndex,
    };

    dispatch(setActiveSectionAction(data));
  };

  return (
    <div
      className={cn(
        activeSection?.section_uuid === layout?.uuid ? 'border-2 border-purple-600' : ''
      )}
      id={layout?.uuid}
      data-section-index={sectionIndex}
    >
      <div
        className={cn(layout?.styleClassName)}
        style={{
          ...layout?.styles,
        }}
      >
        {layout?.block?.map((singleBlock, index) => {
          return (
            <div
              id={singleBlock?.uuid || index}
              data-section-uuid={layout?.uuid}
              data-block-index={index}
              key={singleBlock?.uuid || index}
              className={cn(
                singleBlock?.blockStyleClassName,
                _.size(_.keys(singleBlock?.subBlock)) === 0 &&
                  'bg-gray-100 opacity-90 border border-dashed',
                info?.dragOverClass && info?.dragOver?.index == index && info?.dragOverClass,
                activeSection?.section_uuid === layout?.uuid &&
                  activeSection?.block_uuid === singleBlock?.uuid &&
                  'border-2 border-amber-950 border-dashed',
                _.map(singleBlock?.subBlock, (item) => item.type).some((item) => item === 'divider')
                  ? 'block'
                  : ''
              )}
              onDragOver={(e) => onDragOverHandler(e, index)}
              onDragLeave={onDragLeaveHandler}
              onDrop={onDropHandler}
              style={{ ...singleBlock?.blockStyles }}
            >
              {_.size(_.keys(singleBlock?.subBlock)) > 0 ? (
                singleBlock?.subBlock.map((singleSubBlock, subBlockIndex) => {
                  const ComponentType = elementTypesConstants[singleSubBlock.type.toLowerCase()];
                  return ComponentType ? (
                    <div
                      // className={cn('')}
                      onClick={() =>
                        setActiveElementFunction(
                          singleBlock,
                          index,
                          singleSubBlock?.uuid,
                          subBlockIndex
                        )
                      }
                      key={singleSubBlock?.uuid || subBlockIndex}
                    >
                      <ComponentType
                        {...singleSubBlock}
                        sectionDetails={layout}
                        blockDetails={singleBlock}
                        setActiveElementFunction={setActiveElementFunction}
                      />
                    </div>
                  ) : null;
                })
              ) : (
                <h2 className={cn('p-4 text-center text-sm bg-gray-100 border border-dashed')}>
                  Add Element
                </h2>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(RowComponent);
