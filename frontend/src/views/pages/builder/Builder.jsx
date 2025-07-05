import React, { memo, useCallback, useEffect } from 'react';
import { builderActions } from '@/redux/combineActions';
import { useDispatch, useSelector } from 'react-redux';
import BuilderView from '@/views/features/builder/BuilderView';
import { useParams } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import Header from '@/views/components/navbar/Header';
import InitialLoader from '@/views/components/loaders/loader';
import MetaData from '@/utils/MetaData';

const Builder = () => {
  const dispatch = useDispatch();
  const { noteId } = useParams();
  const isMobile = useIsMobile();
  const {
    setBuilderEditModeAction,
    fetchTemplateNoteIdAction,
    setScreenSizeAction,
    setActiveSectionAction,
    clearBuilderErrorsAction,
  } = builderActions;
  const { builderEditMode, activeSection, singleTemplateData, error, loading, templateSections } =
    useSelector((state) => state.builderToolkitState);

  useEffect(() => {
    if (builderEditMode) {
      changeEditModeHandler();
    }
    if (activeSection) {
      clearActiveSectionFunction();
    }

    if (!singleTemplateData && singleTemplateData?.slug !== noteId) {
      fetchNoteIdHandlerFunction();
    }
  }, [noteId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearErrorFunctionHandler();
    }
  }, [error]);

  useEffect(() => {
    changeScreenSizeFunction(isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  const changeScreenSizeFunction = useCallback(
    (size) => {
      dispatch(setScreenSizeAction(size));
    },
    [isMobile]
  );

  const changeEditModeHandler = useCallback(() => {
    dispatch(setBuilderEditModeAction(false));
  }, [builderEditMode]);

  const fetchNoteIdHandlerFunction = useCallback(() => {
    dispatch(fetchTemplateNoteIdAction(noteId));
  }, [noteId, singleTemplateData]);

  const clearActiveSectionFunction = useCallback(() => {
    dispatch(setActiveSectionAction(null));
  }, []);

  const clearErrorFunctionHandler = useCallback(() => {
    dispatch(clearBuilderErrorsAction());
  }, [error]);

  return (
    <div className="w-full h-screen">
      <Header />
      {loading ? (
        <div>
          <MetaData title={`${noteId} | AcademIQ`} description={`${noteId} | AcademIQ`} />
          <InitialLoader loading={true} />
        </div>
      ) : templateSections ? (
        <>
          <MetaData
            title={`${singleTemplateData?.title} | AcademIQ`}
            description={`${singleTemplateData?.description} | AcademIQ`}
          />
          <BuilderView />
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center p-8 text-center shadow-none border-0">
          <div className="rounded-full p-3 bg-muted mb-4">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Notes Not Found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            The requested notes could not be found. Please check the notes slug or try another
            search.
          </p>
        </Card>
      )}
    </div>
  );
};

export default memo(Builder);
