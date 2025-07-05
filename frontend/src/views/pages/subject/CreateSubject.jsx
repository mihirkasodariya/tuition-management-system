import React, { useState, memo, useEffect, useCallback } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import CreateSubjectSkeleton from '../../features/subject/CreateSubjectSkeleton';
import CreateSubjectForm from '../../features/subject/CreateSubjectForm';
import { useSelector, useDispatch } from 'react-redux';
import { boardActions } from '@/redux/combineActions';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [
  { label: 'Subject', href: '/subject/all' },
  { label: 'Create Subject', href: null },
];

const classrooms = Array.from({ length: 12 }, (_, i) => i + 1);

const CreateSubjectPage = () => {
  const { getBoardsListAction } = boardActions;
  const dispatch = useDispatch();
  const { boardsList } = useSelector((state) => state.boardState);

  const [info, setInfo] = useState({
    optionsLoading: true,
    isSubmitting: false,
  });

  useEffect(() => {
    if (!boardsList) {
      fetchBoardsListHandler();
    } else {
      setInfo((prev) => ({
        ...prev,
        optionsLoading: false,
      }));
    }
  }, [boardsList]);

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Admin Create Subject | AcademIQ" />
      {info?.optionsLoading ? (
        <CreateSubjectSkeleton />
      ) : (
        <CreateSubjectForm
          boards={boardsList}
          classrooms={classrooms}
          info={info}
          setInfo={setInfo}
        />
      )}
    </MainWrapper>
  );
};

export default memo(CreateSubjectPage);
