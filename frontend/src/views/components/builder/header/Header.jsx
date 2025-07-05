import React, { memo, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Eye, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { builderActions } from '@/redux/combineActions';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import _ from 'lodash';

const BuilderHeader = () => {
  const dispatch = useDispatch();
  const { noteId } = useParams();
  const {
    setScreenSizeAction,
    setActiveSectionAction,
    updateBuilderStateAction,
    updateNoteIdAction,
  } = builderActions;
  const { screenSize, templateSections, notesList, singleTemplateData } = useSelector(
    (state) => state.builderToolkitState
  );

  const [info, setInfo] = useState({
    isSubmitting: false,
  });

  const changeScreenSizeHandler = useCallback(
    (type) => {
      dispatch(setScreenSizeAction(type));
      dispatch(setActiveSectionAction(null));
    },
    [screenSize]
  );

  const updateSubmitHandlerFunction = useCallback(async () => {
    let json = {
      templateSections,
    };
    if (info?.isSubmitting) return;
    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));
    let response = await updateNoteIdAction(noteId, json);
    if (response[0] === true) {
      let payload = {};
      if (notesList) {
        let updateData = _.cloneDeep(notesList);
        updateData.docs = updateData?.docs?.map((item) => {
          if (item?.slug === noteId) {
            return response[1]?.data;
          } else {
            return item;
          }
        });
        payload.notesList = _.cloneDeep(updateData);
      }
      payload.singleTemplateData = response[1]?.data;
      payload.templateSections = response[1]?.data?.templateSections;
      dispatch(updateBuilderStateAction(payload));
      toast.success(response[1]?.message);
    } else {
      toast.error(response[1]?.message || 'unable to update note details');
    }
    setInfo((prev) => ({
      ...prev,
      isSubmitting: false,
    }));
  }, [info?.isSubmitting, templateSections]);

  return (
    <div className="p-4 shadow-sm flex justify-between items-center">
      <div>
        <Button
          variant="ghost"
          className={`${screenSize === 'desktop' && 'bg-green-300 hover:bg-green-300'}`}
          onClick={() => changeScreenSizeHandler('desktop')}
        >
          <Monitor />
          Desktop
        </Button>

        <Button
          variant="ghost"
          className={`${screenSize === 'mobile' && 'bg-green-300 hover:bg-green-300'}`}
          onClick={() => changeScreenSizeHandler('mobile')}
        >
          <Smartphone />
          Mobile
        </Button>

        <Button variant="ghost" asChild>
          <Link to={`/notes/${noteId}`}>
            {' '}
            <Eye /> view
          </Link>
        </Button>
      </div>

      <div className>
        <Button onClick={updateSubmitHandlerFunction} disabled={info?.isSubmitting}>
          {info?.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Note Template'
          )}
        </Button>
      </div>
    </div>
  );
};

export default memo(BuilderHeader);
