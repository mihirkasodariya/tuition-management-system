import React, { useMemo, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ColorPicker from '../../color-picker/ColorPicker';
import { useSelector, useDispatch } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import _ from 'lodash';
import { getNumberFromPx } from '@/helpers/get-initials';

const SectionSettings = () => {
  const { setTemplateDataAction, setActiveSectionAction } = builderActions;
  const dispatch = useDispatch();
  const { activeSection, templateSections } = useSelector((state) => state.builderToolkitState);

  const sectionLayout = useMemo(() => {
    let sectionId = activeSection?.section_uuid;
    let layout = templateSections?.find((item) => item?.uuid === sectionId);
    return layout;
  }, [activeSection?.section_uuid, templateSections]);

  const changeColorFunction = (color, property) => {
    let sectionId = activeSection?.section_uuid;
    let updatedSections = _.cloneDeep(templateSections);

    if (property === 'background') {
      updatedSections.forEach((section) => {
        if (section?.uuid === sectionId) {
          section.styles.background = color;
        }
      });
    }

    dispatch(setTemplateDataAction(updatedSections));
  };

  const changeContainerTypeSelection = (e) => {
    let updatedTemplate = _.cloneDeep(templateSections);
    let currentLayout = updatedTemplate?.find((item) => item.uuid === sectionLayout?.uuid);
    currentLayout.properties.containerType = e;

    if (e === 'grid') {
      currentLayout.styleClassName = currentLayout.styleClassName.replace(
        'flex',
        `grid gap-0 grid-cols-${currentLayout?.properties?.columns}`
      );
      currentLayout?.block?.forEach((item) => {
        delete item.blockStyles.width;
      });
    } else if (e === 'flex') {
      currentLayout.styleClassName = currentLayout.styleClassName.replace(
        `grid gap-0 grid-cols-${currentLayout?.properties?.columns}`,
        'flex'
      );
      let equalWidths = parseFloat((100 / currentLayout?.properties?.columns).toFixed(2));
      currentLayout?.block?.forEach((item) => {
        item.blockStyles.width = equalWidths + '%';
      });
    }
    updatedTemplate.forEach((item) => {
      if (item?.uuid === sectionLayout?.uuid) {
        item = currentLayout;
      }
    });

    dispatch(setTemplateDataAction(updatedTemplate));
  };

  const customWidthChangeHandler = (value, index) => {
    let updatedTemplate = _.cloneDeep(templateSections);
    let currentLayout = updatedTemplate?.find((item) => item.uuid === sectionLayout?.uuid);
    currentLayout.block[index].blockStyles.width = `${value}%`;
    dispatch(setTemplateDataAction(updatedTemplate));
  };

  const deleteEmptyBlockFunction = useCallback(() => {
    if (!activeSection?.section_uuid) return;
    let updatedTemplate = _.cloneDeep(templateSections);
    const sectionId = activeSection.section_uuid;

    updatedTemplate = _.filter(
      updatedTemplate,
      (singleSection) => singleSection?.uuid !== sectionId
    );

    // Dispatch the updated sections to the store
    dispatch(setTemplateDataAction(updatedTemplate));
    dispatch(setActiveSectionAction(null));
  }, [templateSections, activeSection]);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button variant="destructive" className="w-full" onClick={deleteEmptyBlockFunction}>
          Delete Section
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <ColorPicker
              value={sectionLayout?.styles?.background}
              onChange={(e) => changeColorFunction(e, 'background')}
              label="Background Color"
            />
          </div>

          <div className="space-y-2">
            <Label>Container Type</Label>
            <Select
              value={sectionLayout?.properties?.containerType}
              onValueChange={changeContainerTypeSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select container type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Equal Grids</SelectItem>
                <SelectItem value="flex">Custom Width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {sectionLayout?.properties?.containerType === 'flex' && (
            <div className="group space-y-3">
              <Label>Custom Width</Label>
              {sectionLayout?.block?.map((singleBlock, index) => (
                <div className="space-y-2">
                  <Label htmlFor="section-margin">
                    Block - {index + 1} : {singleBlock?.blockStyles?.width || '50%'}{' '}
                  </Label>
                  <Slider
                    defaultValue="50%"
                    value={[getNumberFromPx(singleBlock?.blockStyles?.width || '50%')]}
                    max={100}
                    min={1}
                    step={1}
                    onValueChange={(e) => customWidthChangeHandler(e[0], index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* <div className="flex items-center justify-between">
          <Label htmlFor="section-visible">Visible</Label>
          <Switch id="section-visible" defaultChecked />
        </div> */}

          {/* <Button className="w-full">Apply Settings</Button> */}
        </CardContent>
      </Card>
    </>
  );
};

export default memo(SectionSettings);
