import React, { memo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { getNumberFromPx } from '@/helpers/get-initials';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { builderActions } from '@/redux/combineActions';

const VideoSettingsComp = ({ videoUrl, alt, style }) => {
  const dispatch = useDispatch();
  const { setTemplateDataAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);

  const changeHandlerFunction = (value, property, isPx = false, px = 'px') => {
    let updatedTemplate = _.cloneDeep(templateSections);
    updatedTemplate?.forEach((section) => {
      let sectionId = section?.uuid;
      if (sectionId === activeSection?.section_uuid) {
        if (property === 'videoUrl') {
          section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
            property
          ] = value;
        } else {
          section['block'][activeSection.block_index]['subBlock'][activeSection.sub_block_index][
            'style'
          ][property] = isPx ? value + px : value;
        }
      }
    });
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="image-source">Video Source</Label>
        <div className="flex gap-2">
          <Input
            id="video-source"
            type="text"
            placeholder="Paste video URL"
            value={videoUrl || ''}
            onChange={(e) => changeHandlerFunction(e.target.value, 'videoUrl')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-width">Width</Label>
        <div className="flex items-center space-x-2">
          <Slider
            min={0}
            max={700}
            value={[style?.width === 'auto' ? 0 : getNumberFromPx(style?.width) || 0]}
            onValueChange={(e) =>
              changeHandlerFunction(
                e[0] === 'auto' ? 'auto' : e[0],
                'width',
                e[0] === 'auto' ? false : true
              )
            }
          />
          <span className="w-12 text-center">{style?.width}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-height">Height</Label>
        <div className="flex items-center space-x-2">
          <Slider
            min={0}
            max={700}
            value={[style?.height === 'auto' ? 0 : getNumberFromPx(style?.height) || 0]}
            onValueChange={(e) =>
              changeHandlerFunction(e[0] === 0 ? 'auto' : e[0], 'height', e[0] === 0 ? false : true)
            }
          />
          <span className="w-12 text-center">{style?.height}</span>
        </div>
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
              value={getNumberFromPx(style?.marginTop || '2px')}
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
              value={getNumberFromPx(style?.marginBottom || '2px')}
              className="h-8"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(VideoSettingsComp);
