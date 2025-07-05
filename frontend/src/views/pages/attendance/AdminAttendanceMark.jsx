import React, { useState, useEffect, useCallback, memo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { useDispatch, useSelector } from 'react-redux';
import { studentActions } from '@/redux/combineActions';
import _ from 'lodash';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import AdminMarkAttendanceComp from '@/views/features/attendance/AdminMarkAttendanceComp';
import moment from 'moment';
import MarkAttendanceModal from '@/views/features/attendance/MarkAttendanceModal';
import toast from 'react-hot-toast';

const breadCrumbs = [
  { label: 'students', href: '/admin/students' },
  { label: 'Day wise Attendance', href: null },
];

const classRooms = Array.from({ length: 12 }, (_, i) => i + 1);

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

const AdminAttendanceMark = () => {
  const { getDateWiseAttendanceAction, updateAttendanceAction, updateStudentStateAction } =
    studentActions;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dateWiseAttendance, loading } = useSelector((state) => state.studentState);
  const { publicSubjectDetail } = useSelector((state) => state.subjectState);

  const [info, setInfo] = useState({
    name: '',
    classRoom: '',
    date: new Date(),
    filterDocs: null,
    isOpen: false,
    selectedAttendance: null,
    selectedSubject: null,
    selectedChapter: null,
    selectedTopic: null,
    progressValue: 0,
    isSubmitting: false,
  });

  useEffect(() => {
    if (!dateWiseAttendance) {
      fetchDateWiseAttendanceListHandler();
    }
  }, []);

  const fetchDateWiseAttendanceListHandler = useCallback(
    async (query = {}) => {
      dispatch(getDateWiseAttendanceAction(query));
    },
    [dateWiseAttendance]
  );

  const filterChangeHandlerFunction = useCallback(
    async (key, value) => {
      let updateState = {};
      if (key === 'name') {
        updateState.name = value;
        updateState.filterDocs =
          value === ''
            ? null
            : _.filter(dateWiseAttendance?.docs, (doc) =>
                doc?.student?.name?.toLowerCase().includes(value.toLowerCase())
              );
      } else if (key === 'classRoom') {
        updateState.classRoom = value === 'all' ? '' : value;
        updateState.filterDocs =
          value === 'all'
            ? null
            : _.filter(dateWiseAttendance?.docs, (doc) => doc?.class === Number(value));
      } else if (key === 'date') {
        updateState.date = value;
        let query = {
          date: moment(value).format('YYYY-MM-DD'),
        };
        fetchDateWiseAttendanceListHandler(query);
      } else if (key === 'reset') {
        updateState.name = '';
        updateState.classRoom = '';
        updateState.date = new Date();
        updateState.filterDocs = null;

        fetchDateWiseAttendanceListHandler();
      } else if (key === 'toggleAttendance') {
        updateState.isOpen = true;
        updateState.selectedAttendance = value;
      }

      setInfo((prev) => ({
        ...prev,
        ...updateState,
      }));
    },
    [info?.name, info?.classRoom, info?.date, dateWiseAttendance]
  );

  const navigateToStudentDetails = useCallback((studentDetails) => {
    navigate(`/admin/student-details/${studentDetails?._id}/student-profile`);
  }, []);

  const updateTheAttendanceHandler = useCallback(async () => {
    if (info?.isSubmitting) return;

    setInfo((prev) => ({
      ...prev,
      isSubmitting: true,
    }));

    let json = {
      isPresent: !info?.selectedAttendance?.isPresent,
      subject: info?.selectedSubject,
      subjectName: _.find(
        info?.selectedAttendance?.enrollment?.subjects,
        (subject) => subject?.subjectId?._id === info?.selectedSubject
      )?.subjectId?.name,
      progress: {
        chapter: info?.selectedChapter,
        subChapterId: info?.selectedTopic,
        value: info?.progressValue,
      },
      progressDetails: {
        chapterName: _.find(publicSubjectDetail?.chapters, { _id: info?.selectedChapter })?.title,
        subChapterName: publicSubjectDetail?.chapters
          ?.find((item) => item._id === info?.selectedChapter)
          ?.subChapters?.find((item) => item._id === info?.selectedTopic)?.title,
        value: info?.progressValue,
      },
    };

    let response = await updateAttendanceAction(info?.selectedAttendance?._id, json);
    if (response[0] === true) {
      toast.success(response[1]?.message);

      let updateDetails = {
        isPresent: response[1]?.data?.attendance?.isPresent,
        subject: response[1]?.data?.attendance?.subject,
        progress: response[1]?.data?.attendance?.progress,
      };

      let updatedState = _.cloneDeep(dateWiseAttendance);
      updatedState.docs = _.map(updatedState?.docs, (att) => {
        if (att._id === info?.selectedAttendance?._id) {
          att = { ...att, ...updateDetails };
          return att;
        } else return att;
      });

      dispatch(updateStudentStateAction({ dateWiseAttendance: updatedState }));

      setInfo((prev) => ({
        ...prev,
        isSubmitting: false,
        isOpen: false,
        selectedAttendance: null,
        selectedSubject: null,
        selectedChapter: null,
        selectedTopic: null,
        progressValue: 0,
      }));
    } else {
      toast.error(response[1]?.message || 'something  went wrong while updating');
      setInfo((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [
    info?.selectedAttendance,
    info?.selectedSubject,
    info?.selectedChapter,
    info?.selectedTopic,
    info?.progressValue,
    publicSubjectDetail,
  ]);

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Admin Students | AcademIQ" />
      {loading ? (
        <DataTableSkeleton />
      ) : (
        <AdminMarkAttendanceComp
          classRooms={classRooms}
          data={info?.filterDocs ?? dateWiseAttendance?.docs}
          info={info}
          setInfo={setInfo}
          filterChangeHandlerFunction={filterChangeHandlerFunction}
          navigateToStudentDetails={navigateToStudentDetails}
        />
      )}

      <MarkAttendanceModal
        info={info}
        setInfo={setInfo}
        updateTheAttendanceHandler={updateTheAttendanceHandler}
      />
    </MainWrapper>
  );
};

export default memo(AdminAttendanceMark);
