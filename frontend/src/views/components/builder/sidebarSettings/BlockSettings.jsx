import React, { useState, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useSelector, useDispatch } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import _ from 'lodash';
import { getNumberFromPx } from '@/helpers/get-initials';
import {
  Image,
  RectangleEllipsis,
  SquareSplitVertical,
  TextSelectionIcon,
  LetterText,
  Video,
  Box,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon map for visual indicators
const typeIcons = {
  button: <RectangleEllipsis className="h-4 w-4" />,
  text: <TextSelectionIcon className="h-4 w-4" />,
  editor: <LetterText className="h-4 w-4" />,
  image: <Image className="h-4 w-4" />,
  divider: <SquareSplitVertical className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
};

const BlockSettings = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const { activeSection, templateSections } = useSelector((state) => state.builderToolkitState);
  const { setTemplateDataAction, setActiveSectionAction } = builderActions;

  const sectionLayout = useMemo(() => {
    let sectionId = activeSection?.section_uuid;
    let activeBlockId = activeSection?.block_uuid;
    let layout = templateSections?.find((item) => item?.uuid === sectionId) || {};
    let activeBlock = layout?.block?.find((item) => item?.uuid === activeBlockId);
    return { ...layout, activeBlock };
  }, [activeSection?.section_uuid, templateSections]);

  const changeSelectHandlerFunction = (value, property, isPx = false) => {
    let updatedTemplate = _.cloneDeep(templateSections);
    let currentLayout = updatedTemplate?.find((item) => item.uuid === sectionLayout?.uuid);
    currentLayout?.block?.forEach((item) => {
      if (item?.uuid === sectionLayout?.activeBlock?.uuid) {
        if (isPx) {
          value += 'px';
        }
        item.blockStyles[property] = value;
      }
    });
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  const selectSubBlockHandlerFunction = useCallback(
    (subBlockUuid) => {
      if (subBlockUuid === activeSection?.sub_block_uuid) return;
      let updatedActiveSection = {
        ...activeSection,
        sub_block_uuid: subBlockUuid,
      };
      dispatch(setActiveSectionAction(updatedActiveSection));
      setActiveTab('element');
      setTimeout(() => {
        let documentId = document.getElementById(subBlockUuid);
        if (documentId) {
          documentId.scrollIntoView({ behavior: 'instant' });
        }
      }, 100);
    },
    [activeSection]
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Block Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Minimum Height</Label>
            <div className="flex items-center space-x-2">
              <Slider
                value={[getNumberFromPx(sectionLayout?.activeBlock?.blockStyles?.minHeight)]}
                max={500}
                min={10}
                step={1}
                onValueChange={(e) => changeSelectHandlerFunction(e[0], 'minHeight', true)}
              />
              <span className="w-12 text-center">
                {sectionLayout?.activeBlock?.blockStyles?.minHeight}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Justify Content</Label>
            <Select
              defaultValue="center"
              value={sectionLayout?.activeBlock?.blockStyles?.justifyContent}
              onValueChange={(e) => changeSelectHandlerFunction(e, 'justifyContent')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Justify Content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start"> Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">Flex End</SelectItem>
                <SelectItem value="space-between">Space Between</SelectItem>
                <SelectItem value="space-around">Space Around</SelectItem>
                <SelectItem value="space-evenly">Space Evenly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Align Items</Label>
            <Select
              defaultValue="center"
              value={sectionLayout?.activeBlock?.blockStyles?.alignItems}
              onValueChange={(e) => changeSelectHandlerFunction(e, 'alignItems')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Align Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="flex-end">Flex End</SelectItem>
                <SelectItem value="stretch">Stretch</SelectItem>
                <SelectItem value="baseline">Baseline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flex Wrap Option */}
          <div className="space-y-2">
            <Label>Flex Wrap</Label>
            <Select
              defaultValue="nowrap"
              value={sectionLayout?.activeBlock?.blockStyles?.flexWrap || 'nowrap'}
              onValueChange={(e) => changeSelectHandlerFunction(e, 'flexWrap')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Flex Wrap" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nowrap">No Wrap</SelectItem>
                <SelectItem value="wrap">Wrap</SelectItem>
                <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-margin">
              Gap : {sectionLayout?.activeBlock?.blockStyles?.gap}
            </Label>
            <Slider
              defaultValue="0px"
              value={[getNumberFromPx(sectionLayout?.activeBlock?.blockStyles?.gap || '0px')]}
              max={50}
              min={1}
              step={1}
              onValueChange={(e) => changeSelectHandlerFunction(e[0], 'gap', true)}
            />
          </div>

          <div className="space-y-2">
            <Label>Padding</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Top</Label>
                <Input
                  type="number"
                  defaultValue="2"
                  max={100}
                  min={1}
                  onChange={(e) =>
                    changeSelectHandlerFunction(e?.target?.value, 'paddingTop', true)
                  }
                  value={getNumberFromPx(
                    sectionLayout?.activeBlock?.blockStyles?.paddingTop || '2px'
                  )}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Right</Label>
                <Input
                  type="number"
                  defaultValue="2"
                  max={100}
                  min={1}
                  onChange={(e) =>
                    changeSelectHandlerFunction(e?.target?.value, 'paddingRight', true)
                  }
                  value={getNumberFromPx(
                    sectionLayout?.activeBlock?.blockStyles?.paddingRight || '2px'
                  )}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Bottom</Label>
                <Input
                  type="number"
                  defaultValue="2"
                  max={100}
                  min={1}
                  onChange={(e) =>
                    changeSelectHandlerFunction(e?.target?.value, 'paddingBottom', true)
                  }
                  value={getNumberFromPx(
                    sectionLayout?.activeBlock?.blockStyles?.paddingBottom || '2px'
                  )}
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-xs">Left</Label>
                <Input
                  type="number"
                  defaultValue="2"
                  max={100}
                  min={1}
                  onChange={(e) =>
                    changeSelectHandlerFunction(e?.target?.value, 'paddingLeft', true)
                  }
                  value={getNumberFromPx(
                    sectionLayout?.activeBlock?.blockStyles?.paddingLeft || '2px'
                  )}
                  className="h-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <br />
      <Card>
        <CardHeader>
          <CardTitle>Sub Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {_.size(sectionLayout?.activeBlock?.subBlock) === 0 ? (
            <p className="px-2 py-4 text-center text-sm text-muted-foreground">
              No elements in this block
            </p>
          ) : (
            <div className="space-y-1">
              {sectionLayout?.activeBlock?.subBlock?.map((singleSubBlock) => (
                <div
                  key={singleSubBlock?.uuid}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent cursor-pointer',
                    activeSection?.sub_block_uuid === singleSubBlock?.uuid && 'bg-accent'
                  )}
                  onClick={() => selectSubBlockHandlerFunction(singleSubBlock?.uuid)}
                >
                  <Menu className="h-4 w-8 cursor-grab" />
                  {typeIcons[singleSubBlock?.type] || <Box className="h-4 w-4" />}
                  <span className="capitalize">{singleSubBlock?.type}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    #{singleSubBlock?.uuid?.slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default memo(BlockSettings);
