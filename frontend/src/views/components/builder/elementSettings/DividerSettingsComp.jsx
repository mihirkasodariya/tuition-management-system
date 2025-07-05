import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ColorPicker from '../../color-picker/ColorPicker';
import { getNumberFromPx } from '@/helpers/get-initials';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { builderActions } from '@/redux/combineActions';
import { Textarea } from '@/components/ui/textarea';

const DividerSettingsComp = ({ content, style }) => {
  const dispatch = useDispatch();
  const { setTemplateDataAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const changeHandlerFunction = (value, property, isPx = false, px = 'px') => {
    let updatedTemplate = _.cloneDeep(templateSections);
    updatedTemplate?.forEach((section) => {
      let sectionId = section?.uuid;
      if (sectionId === activeSection?.section_uuid) {
        section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
          'style'
        ][property] = isPx ? value + px : value;
      }
    });
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  const changeHandlerOuterStyleFunction = (value, property, isPx = false, px = 'px') => {
    let updatedTemplate = _.cloneDeep(templateSections);
    updatedTemplate?.forEach((section) => {
      let sectionId = section?.uuid;
      if (sectionId === activeSection?.section_uuid) {
        section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
          'outerStyle'
        ][property] = isPx ? value + px : value;
      }
    });
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  return (
    <>
      <div>
        <ColorPicker
          value={style?.borderColor}
          onChange={(e) => changeHandlerFunction(e, 'borderColor')}
          label="Divider Color"
        />
      </div>

      <div className="space-y-2">
        <Label> Width</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[getNumberFromPx(style?.width)]}
            max={100}
            min={0}
            step={1}
            onValueChange={(e) => changeHandlerFunction(e[0], 'width', true, '%')}
          />
          <span className="w-12 text-center">{style?.width}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label> Border Height</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[getNumberFromPx(style?.borderTopWidth)]}
            max={8}
            min={0.1}
            step={0.1}
            onValueChange={(e) => changeHandlerFunction(e[0], 'borderTopWidth', true)}
          />
          <span className="w-12 text-center">{style?.borderTopWidth}</span>
        </div>
      </div>

      <div className="space-y-2 w-full">
        <Label>Line Style</Label>
        <Select
          value={style?.borderStyle || 'solid'}
          onValueChange={(value) => changeHandlerFunction(value, 'borderStyle')}
          className="w-full"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select divider style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={'solid'}>solid</SelectItem>
            <SelectItem value={'dashed'}>dashed</SelectItem>
            <SelectItem value={'dotted'}>dotted</SelectItem>
            <SelectItem value={'double'}>double</SelectItem>
            <SelectItem value={'groove'}>groove</SelectItem>
            <SelectItem value={'ridge'}>ridge</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Divider Position</Label>
        <Select
          defaultValue="center"
          value={style?.alignItems}
          onValueChange={(e) => changeHandlerOuterStyleFunction(e, 'alignItems')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Align Items" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start">Start</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="flex-end">End</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Margin</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Top</Label>
            <Input
              type="number"
              defaultValue="2"
              max={100}
              min={1}
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'marginTop', true)}
              value={getNumberFromPx(style?.marginTop)}
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
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'marginBottom', true)}
              value={getNumberFromPx(style?.marginBottom)}
              className="h-8"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(DividerSettingsComp);
