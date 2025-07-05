import React, { memo, useCallback, useEffect } from 'react';
import BuilderEditor from '@/views/features/builder/BuilderEditor';
import { builderActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const EditBuilder = () => {
  const dispatch = useDispatch();
  const { noteId } = useParams();
  const { setBuilderEditModeAction, fetchTemplateNoteIdAction } = builderActions;
  const { builderEditMode, singleTemplateData } = useSelector((state) => state.builderToolkitState);

  useEffect(() => {
    if (!builderEditMode) {
      changeEditModeHandler();
    }
    if (!singleTemplateData && singleTemplateData?.slug !== noteId) {
      fetchNoteIdHandlerFunction();
    }
  }, []);

  const changeEditModeHandler = useCallback(() => {
    dispatch(setBuilderEditModeAction(true));
  }, [builderEditMode]);

  const fetchNoteIdHandlerFunction = useCallback(() => {
    dispatch(fetchTemplateNoteIdAction(noteId));
  }, [noteId]);
  return (
    <div className="w-full h-screen">
      <BuilderEditor />
    </div>
  );
};

export default memo(EditBuilder);
