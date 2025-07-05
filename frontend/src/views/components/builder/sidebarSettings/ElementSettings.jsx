import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import ButtonSettingsComp from '../elementSettings/ButtonSettingsComp';
import TextSettingsComp from '../elementSettings/TextSettingsComp';
import EditorSettingsComp from '../elementSettings/EditorSettingsComp';
import ImageSettingsComp from '../elementSettings/ImageSettingsComp';
import DividerSettingsComp from '../elementSettings/DividerSettingsComp';
import VideoSettingsComp from '../elementSettings/VideoSettingsComp';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { builderActions } from '@/redux/combineActions';
import { sub } from 'date-fns';

const elementTypesConstants = {
  button: ButtonSettingsComp,
  text: TextSettingsComp,
  editor: EditorSettingsComp,
  image: ImageSettingsComp,
  divider: DividerSettingsComp,
  video: VideoSettingsComp,
};

const ElementControls = memo(() => {
  const dispatch = useDispatch();
  const { setTemplateDataAction, setActiveSectionAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const onDeleteFunction = useCallback(() => {
    if (
      !activeSection?.section_uuid ||
      !activeSection?.block_uuid ||
      !activeSection?.sub_block_uuid
    )
      return;

    const sectionId = activeSection.section_uuid;
    const blockId = activeSection.block_uuid;
    const subBlockId = activeSection.sub_block_uuid;

    const updatedSections = templateSections.map((section) => {
      if (section.uuid === sectionId) {
        return {
          ...section,
          block: section.block.map((block) => {
            if (block.uuid === blockId) {
              return {
                ...block,
                subBlock: block.subBlock.filter((subBlock) => subBlock.uuid !== subBlockId),
              };
            }
            return block;
          }),
        };
      }
      return section;
    });

    const updatedActiveSection = _.cloneDeep(activeSection);
    updatedActiveSection.sub_block_uuid = null;
    updatedActiveSection.sub_block_index = null;

    // Dispatch the updated sections to the store
    dispatch(setTemplateDataAction(updatedSections));
    dispatch(setActiveSectionAction(updatedActiveSection));
  }, [templateSections, activeSection]);

  const onMoveUpFunction = useCallback(() => {
    if (
      !activeSection?.section_uuid ||
      !activeSection?.block_uuid ||
      !activeSection?.sub_block_uuid
    )
      return;

    const sectionId = activeSection.section_uuid;
    const blockIndex = activeSection.block_index;
    const subBlockIndex = activeSection.sub_block_index;

    if (subBlockIndex === 0) return; // Can't move up if it's the first subBlock
    let update_activeSection = _.cloneDeep(activeSection);
    update_activeSection.sub_block_index = subBlockIndex - 1;

    const updatedSections = templateSections.map((section) => {
      if (section.uuid === sectionId) {
        let currentSection = _.cloneDeep(section);
        [
          currentSection.block[blockIndex].subBlock[subBlockIndex - 1],
          currentSection.block[blockIndex].subBlock[subBlockIndex],
        ] = [
          currentSection.block[blockIndex].subBlock[subBlockIndex],
          currentSection.block[blockIndex].subBlock[subBlockIndex - 1],
        ];
        return currentSection;
      }
      return section;
    });

    dispatch(setTemplateDataAction(updatedSections));
    dispatch(setActiveSectionAction(update_activeSection));
  }, [templateSections, activeSection]);

  const onMoveDownFunction = useCallback(() => {
    if (
      !activeSection?.section_uuid ||
      !activeSection?.block_uuid ||
      !activeSection?.sub_block_uuid
    )
      return;

    const sectionId = activeSection.section_uuid;
    const blockIndex = activeSection.block_index;
    let section_index = _.findIndex(templateSections, { uuid: sectionId });
    const subBlockIndex = activeSection.sub_block_index;
    const subBlockCount = _.size(templateSections[section_index]?.block[blockIndex]?.subBlock);

    if (subBlockIndex >= subBlockCount - 1) return; // Can't move down if it's the last subBlock
    let update_activeSection = _.cloneDeep(activeSection);
    update_activeSection.sub_block_index = subBlockIndex + 1;

    const updatedSections = templateSections.map((section) => {
      if (section.uuid === sectionId) {
        let currentSection = _.cloneDeep(section);
        [
          currentSection.block[blockIndex].subBlock[subBlockIndex],
          currentSection.block[blockIndex].subBlock[subBlockIndex + 1],
        ] = [
          currentSection.block[blockIndex].subBlock[subBlockIndex + 1],
          currentSection.block[blockIndex].subBlock[subBlockIndex],
        ];
        return currentSection;
      }
      return section;
    });

    dispatch(setTemplateDataAction(updatedSections));
    dispatch(setActiveSectionAction(update_activeSection));
  }, [templateSections, activeSection]);

  return (
    <div className="flex  justify-end gap-2">
      {/* Delete */}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-destructive/20 hover:text-destructive"
              onClick={onDeleteFunction}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Delete</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Move Up */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveUpFunction}>
              <ArrowUp className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Move up</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Move Down */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMoveDownFunction}>
              <ArrowDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Move down</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

const ElementSettings = () => {
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const elementDetails = useMemo(() => {
    let sectionId = activeSection?.section_uuid;
    let activeBlockId = activeSection?.block_uuid;
    let activeSubBlockId = activeSection?.sub_block_uuid;
    let layout = templateSections?.find((item) => item?.uuid === sectionId) || {};
    let activeBlock = layout?.block?.find((item) => item?.uuid === activeBlockId);
    let activeSubBlock = activeBlock?.subBlock?.find((item) => item?.uuid === activeSubBlockId);
    return activeSubBlock;
  }, [activeSection, templateSections]);

  const ActiveComponent = useMemo(() => {
    return elementTypesConstants[elementDetails?.type.toLowerCase()] ?? null;
  }, [activeSection, elementDetails?.type]);

  return (
    <>
      <div className="mb-1">{ActiveComponent && <ElementControls />}</div>

      <Card>
        <CardHeader>
          <CardTitle>{elementDetails?.label} Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {ActiveComponent && <ActiveComponent {...elementDetails} />}
        </CardContent>
      </Card>
    </>
  );
};

export default memo(ElementSettings);
