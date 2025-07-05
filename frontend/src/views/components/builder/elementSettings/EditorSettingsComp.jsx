import React, { useState, useRef, useMemo, useEffect, memo } from 'react';
import JoditEditor from 'jodit-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { getNumberFromPx } from '@/helpers/get-initials';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { builderActions } from '@/redux/combineActions';
import '@/assets/css/builder/editor-settings.css';
import ModalV1 from '../../modal/ModalV1';
import { Button } from '@/components/ui/button';

const OpenEditorModal = memo(({ info, setInfo, data, changeHandlerFunction }) => {
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
    }),
    []
  );

  useEffect(() => {
    if (info?.isOpen && data) {
      setContent(data);
    }
  }, [info?.isOpen, data]);

  const closeModalFunction = () => {
    setInfo({ ...info, isOpen: false });
    setContent('');
  };

  const buttonClickHandler = (reset = true) => {
    if (reset) {
      setContent(data);
    } else {
      changeHandlerFunction(content, 'content');
      closeModalFunction();
    }
  };

  return (
    <ModalV1
      title="Text Editor"
      isOpen={info?.isOpen}
      onClose={closeModalFunction}
      closeOutside={false}
      // size="small"
      maxHeight="fit-content"
    >
      <div className="mb-4">
        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onChange={(newContent) => setContent(newContent)}
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button variant="destructive" onClick={buttonClickHandler}>
          Reset Content
        </Button>
        <Button onClick={() => buttonClickHandler(false)}>Add Content</Button>
      </div>
    </ModalV1>
  );
});

const EditorSettingsComp = ({ content, style }) => {
  const dispatch = useDispatch();
  const { setTemplateDataAction } = builderActions;
  const { templateSections, activeSection } = useSelector((state) => state.builderToolkitState);
  const [info, setInfo] = useState({
    isOpen: false,
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

  return (
    <>
      <div>
        <Button onClick={() => setInfo({ ...info, isOpen: true })}>Open Editor</Button>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="element-visible">Visible In Mobile </Label>
        <Switch id="element-visible" defaultChecked />
      </div>

      <OpenEditorModal
        info={info}
        setInfo={setInfo}
        data={content}
        changeHandlerFunction={changeHandlerFunction}
      />
    </>
  );
};

export default memo(EditorSettingsComp);
