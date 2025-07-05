import React, { useState, useEffect, useCallback, memo } from 'react';
import StudentsListComponent from '@/views/features/students/StudentsListComponent';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { batchActions, boardActions, studentActions } from '@/redux/combineActions';
import _ from 'lodash';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import MetaData from '@/utils/MetaData';

const breadCrumbs = [{ label: 'students', href: null }];

const classRooms = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12

const DataTableSkeleton = memo(({ numRows = 6, numCols = 5 }) => {
  return (
    <div className="rounded-md border overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center h-12 px-4 bg-muted text-sm font-medium">
        {Array.from({ length: numCols }).map((_, i) => (
          <div key={i} className="w-full min-w-[100px]">
            <Skeleton className="h-5 w-3/4 rounded" />
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y">
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center h-16 px-4 text-sm gap-6">
            {Array.from({ length: numCols }).map((_, colIndex) => (
              <div key={colIndex} className="w-full min-w-[100px] py-2">
                <Skeleton className="h-4 w-full rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});

const StudentsList = () => {
  const { getBatchesListAction } = batchActions;
  const { getBoardsListAction } = boardActions;
  const { getStudentsListAction } = studentActions;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { batchesList } = useSelector((state) => state.batchState);
  const { boardsList } = useSelector((state) => state.boardState);
  const { studentsList } = useSelector((state) => state.studentState);

  const [info, setInfo] = useState({
    loading: true,
    name: '',
    classRoom: '',
    boardType: '',
    batchType: '',
    currentPage: 1,
    limit: 20,
    timeOut: null,
  });

  useEffect(() => {
    if (!batchesList) {
      fetchBatchesListHandler();
    }

    if (!boardsList) {
      fetchBoardsListHandler();
    }

    fetchStudentsListHandler();
  }, []);

  useEffect(() => {
    if (batchesList && boardsList && studentsList) {
      setInfo((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [boardsList, batchesList, studentsList, info?.loading]);

  const fetchBatchesListHandler = useCallback(async () => {
    dispatch(getBatchesListAction());
  }, [batchesList]);

  const fetchBoardsListHandler = useCallback(async () => {
    dispatch(getBoardsListAction());
  }, [boardsList]);

  const fetchStudentsListHandler = useCallback(
    async (query, reset = false) => {
      let queryParams = {
        limit: query?.limit ?? info?.limit,
        name: query?.name ?? info?.name,
        boardType: query?.boardType ?? info?.boardType,
        batch: query?.batchType ?? info?.batchType,
        classRoom: query?.classRoom ?? info?.classRoom,
        page: query?.currentPage ?? info?.currentPage,
      };

      dispatch(getStudentsListAction(queryParams, reset));
    },
    [studentsList, info?.name, info?.classRoom, info?.batchType, info?.boardType, info?.currentPage]
  );

  const filterChangeHandlerFunction = useCallback(
    async (key, value) => {
      let updateObject = {
        loading: true,
      };

      if (key === 'classRoom' || key === 'boardType' || key === 'batchType') {
        updateObject[key] = value === 'all' ? '' : value;
        updateObject.currentPage = 1;
      }

      if (key === 'page') {
        updateObject.currentPage = value;
      }
      if (key === 'reset') {
        clearTimeout(info?.timeOut);
        updateObject = {
          loading: true,
          name: '',
          classRoom: '',
          boardType: '',
          batchType: '',
          currentPage: 1,
          limit: 1,
          timeOut: null,
        };

        let isEqual = _.isEqual(updateObject, info);
        if (isEqual) return;
      }

      if (key === 'name') {
        clearTimeout(info?.timeOut);
        let timeOut = setTimeout(() => {
          fetchStudentsListHandler({ [key]: value }, true);
          setInfo((prev) => ({
            ...prev,
            timeOut: null,
          }));
        }, 1000);

        setInfo((prev) => ({
          ...prev,
          [key]: value,
          timeOut,
        }));
      } else {
        setInfo((prev) => ({
          ...prev,
          ...updateObject,
        }));
        fetchStudentsListHandler(updateObject, true);
      }
    },
    [info?.name, info?.classRoom, info?.batchType, info?.boardType, info?.currentPage]
  );

  const navigateToStudentDetails = useCallback((studentDetails) => {
    navigate(`/admin/student-details/${studentDetails?._id}/student-profile`);
  }, []);

  const navigateToStudentAttendanceList = useCallback((studentDetails) => {
    navigate(`/admin/student-details/${studentDetails?._id}/student-attendance`);
  }, []);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Admin Students | AcademIQ" />
      {info?.loading ? (
        <DataTableSkeleton />
      ) : (
        <StudentsListComponent
          classRooms={classRooms}
          boardTypes={boardsList}
          batchTypes={batchesList}
          data={studentsList}
          info={info}
          setInfo={setInfo}
          filterChangeHandlerFunction={filterChangeHandlerFunction}
          navigateToStudentDetails={navigateToStudentDetails}
          navigateToStudentAttendanceList={navigateToStudentAttendanceList}
        />
      )}
    </MainWrapper>
  );
};

export default memo(StudentsList);
