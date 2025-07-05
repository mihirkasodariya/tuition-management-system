import React, { memo, useCallback, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { submitBuilderTextPromptApi } from '@/apis/ai.api';
import toast from 'react-hot-toast';

const TextSettingsComp = ({ content, style }) => {
  const dispatch = useDispatch();
  const { setTemplateDataAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const [info, setInfo] = useState({
    aiPrompt: '',
    promptLoading: false,
  });

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

  const submitPromptMessageHandler = useCallback(async () => {
    if (info?.promptLoading || !info?.aiPrompt) return;

    setInfo((prev) => ({ ...prev, promptLoading: true }));
    let json = {
      userPrompt: info?.aiPrompt,
    };
    let response = await submitBuilderTextPromptApi(json);
    if (response[0] === true) {
      changeHandlerFunction(response[1]?.data?.generatedText, 'content');
      setInfo((prev) => ({ ...prev, promptLoading: false, aiPrompt: '' }));
    } else {
      toast.error(response[1]?.message);
      setInfo((prev) => ({ ...prev, promptLoading: false }));
    }
  }, [info?.aiPrompt, info?.promptLoading]);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="element-name">Text Content</Label>
        <Textarea
          id="element-name"
          placeholder="Enter text content"
          value={content}
          onChange={(e) => changeHandlerFunction(e?.target?.value, 'content')}
          rows={4}
          minLength={4}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs">AI Prompt(Optional)</Label>
        <Input
          type="text"
          onChange={(e) => setInfo((prev) => ({ ...prev, aiPrompt: e?.target?.value }))}
          value={info?.aiPrompt}
          placeholder="Enter the prompt"
          className="h-8"
        />
        <Button
          className="w-full"
          disabled={info?.promptLoading}
          onClick={submitPromptMessageHandler}
        >
          {info?.promptLoading ? (
            <>
              {' '}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating..{' '}
            </>
          ) : (
            <>
              Generate with AI
              <Sparkles />
            </>
          )}
        </Button>
      </div>

      <div>
        <ColorPicker
          value={style?.color}
          onChange={(e) => changeHandlerFunction(e, 'color')}
          label="Text Color"
        />
      </div>

      <div>
        <ColorPicker
          value={style?.backgroundColor}
          onChange={(e) => changeHandlerFunction(e, 'backgroundColor')}
          label="Text Background Color"
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

      <div className="grid grid-cols-2">
        <div className="space-y-2">
          <Label>Font Weight</Label>
          <Select
            value={style?.fontWeight || '400'}
            onValueChange={(value) => changeHandlerFunction(value, 'fontWeight')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font weight" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={100}>Thin</SelectItem>
              <SelectItem value={200}>Extra Light</SelectItem>
              <SelectItem value={300}>Light</SelectItem>
              <SelectItem value={400}>Normal</SelectItem>
              <SelectItem value={500}>Medium</SelectItem>
              <SelectItem value={600}>Semi Bold</SelectItem>
              <SelectItem value={700}>Bold</SelectItem>
              <SelectItem value={800}>Extra Bold</SelectItem>
              <SelectItem value={900}>Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Text Align</Label>
          <Select
            value={style?.textAlign || 'left'}
            onValueChange={(value) => changeHandlerFunction(value, 'textAlign')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select text align" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
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

export default memo(TextSettingsComp);
