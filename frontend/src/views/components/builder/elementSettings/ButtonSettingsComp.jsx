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

const ButtonSettingsComp = ({ content, style }) => {
  const dispatch = useDispatch();
  const { setTemplateDataAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const changeHandlerFunction = (value, property, isPx = false) => {
    let updatedTemplate = _.cloneDeep(templateSections);
    updatedTemplate?.forEach((section) => {
      let sectionId = section?.uuid;
      if (sectionId === activeSection?.section_uuid) {
        if (property === 'content') {
          section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
            property
          ] = value;
        } else {
          section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
            'style'
          ][property] = isPx ? value + 'px' : value;
        }
      }
    });
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="element-name">Button Title</Label>
        <Input
          id="element-name"
          placeholder="Text Element"
          value={content}
          onChange={(e) => changeHandlerFunction(e?.target?.value, 'content')}
        />
      </div>

      <div>
        <ColorPicker
          value={style?.color}
          onChange={(e) => changeHandlerFunction(e, 'color')}
          label="Button Text Color"
        />
      </div>

      <div>
        <ColorPicker
          value={style?.backgroundColor}
          onChange={(e) => changeHandlerFunction(e, 'backgroundColor')}
          label="Button Background Color"
        />
      </div>

      <div className="space-y-2">
        <Label>Font Size</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[getNumberFromPx(style?.fontSize)]}
            max={50}
            min={10}
            step={1}
            onValueChange={(e) => changeHandlerFunction(e[0], 'fontSize', true)}
          />
          <span className="w-12 text-center">{style?.fontSize}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Border Radius</Label>
        <div className="flex items-center space-x-2">
          <Slider
            value={[getNumberFromPx(style?.borderRadius)]}
            max={100}
            min={0}
            step={1}
            onValueChange={(e) => changeHandlerFunction(e[0], 'borderRadius', true)}
          />
          <span className="w-12 text-center">{style?.borderRadius}</span>
        </div>
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
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'paddingTop', true)}
              value={getNumberFromPx(style?.paddingTop || '2px')}
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
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'paddingRight', true)}
              value={getNumberFromPx(style?.paddingRight || '2px')}
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
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'paddingBottom', true)}
              value={getNumberFromPx(style?.paddingBottom || '2px')}
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
              onChange={(e) => changeHandlerFunction(e?.target?.value, 'paddingLeft', true)}
              value={getNumberFromPx(style?.paddingLeft || '2px')}
              className="h-8"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="element-visible">Visible In Mobile </Label>
        <Switch id="element-visible" defaultChecked />
      </div>
    </>
  );
};

export default memo(ButtonSettingsComp);

//    <div className="space-y-2">
//         <Label>Typography</Label>
//         <Select defaultValue="paragraph">
//           <SelectTrigger>
//             <SelectValue placeholder="Select font" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="heading1">Heading 1</SelectItem>
//             <SelectItem value="heading2">Heading 2</SelectItem>
//             <SelectItem value="paragraph">Paragraph</SelectItem>
//             <SelectItem value="caption">Caption</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
