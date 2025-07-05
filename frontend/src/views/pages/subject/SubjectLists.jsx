import React, { memo, useState, useCallback, useEffect } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import SubjectsListComponent from '@/views/features/subject/SubjectsListComponent';
import SubjectListSkeleton from '@/views/features/subject/SubjectListSkeleton';
import { useSelector, useDispatch } from 'react-redux';
import { boardActions, subjectActions } from '@/redux/combineActions';
import MetaData from '@/utils/MetaData';
import { useNavigate } from 'react-router-dom';

const breadCrumbs = [{ label: 'Subject Lists', href: null }];
const classrooms = Array.from({ length: 12 }, (_, i) => i + 1);

const SubjectsListPage = () => {
  const { getBoardsListAction } = boardActions;
  const { getSubjectsListAction } = subjectActions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { boardsList } = useSelector((state) => state.boardState);
  const { subjectsList, loading } = useSelector((state) => state.subjectState);

  const [info, setInfo] = useState({
    optionsLoading: true,
    classRoom: '1',
    boardType: '',
    name: '',
  });

  useEffect(() => {
    if (!boardsList) {
      fetchBoardsListHandler();
    } else {
      setInfo((prev) => ({
        ...prev,
        optionsLoading: false,
        boardType: boardsList?.[0]?._id || '',
      }));
      let query = {
        classRoom: info?.classRoom,
        boardType: boardsList?.[0]?._id || '',
      };
      fetchSubjectsListHandler(query);
    }
  }, [boardsList]);

  const handleChangeFilterFunction = useCallback(
    (key, value) => {
      setInfo((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [info?.classRoom, info?.boardType, info?.name]
  );

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const fetchSubjectsListHandler = useCallback(
    async (query) => {
      dispatch(getSubjectsListAction(query));
    },
    [subjectsList, info?.classRoom, info?.boardType, info?.name]
  );

  const handleFilterSearchFunction = useCallback(() => {
    if (loading) return;
    let query = {
      classRoom: info?.classRoom,
      boardType: info?.boardType,
    };
    if (info?.name) {
      query.name = info?.name;
    }

    fetchSubjectsListHandler(query);
  }, [info?.classRoom, info?.boardType, info?.name, loading]);

  const navigateToEditPage = useCallback((subjectDetails) => {
    navigate(`/admin/subject/${subjectDetails._id}`);
  }, []);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Admin Subjects | AcademIQ" />

      {info?.optionsLoading ? (
        <SubjectListSkeleton />
      ) : (
        <SubjectsListComponent
          classrooms={classrooms}
          boards={boardsList}
          info={info}
          handleChangeFilterFunction={handleChangeFilterFunction}
          handleFilterSearchFunction={handleFilterSearchFunction}
          buttonLoading={loading}
          navigateToEditPage={navigateToEditPage}
        />
      )}
    </MainWrapper>
  );
};

export default memo(SubjectsListPage);
