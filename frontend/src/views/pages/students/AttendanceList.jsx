import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { studentActions } from '@/redux/combineActions';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';

const headers = [
  { title: 'Summary', key: 'summary' },
  { title: 'Subject', key: 'subjectName' },
  { title: 'Chapter', key: 'chapterName' },
  { title: 'Progress', key: 'value' },
  { title: 'Time', key: 'time' },
  { title: 'Meet', key: 'meet' },
  { title: 'Attended', key: 'isPresent' },
];

const AttendanceList = () => {
  const { studentId } = useParams();
  const { getStudentEnrollmentListAction, getStudentAttendanceListAction } = studentActions;

  const dispatch = useDispatch();
  const { enrollmentsList, attendanceList } = useSelector((state) => state.studentState);

  const [info, setInfo] = useState({
    loading: true,
    limit: 20,
    currentPage: 1,
  });

  useEffect(() => {
    if (studentId && (!enrollmentsList || enrollmentsList?._id !== studentId)) {
      fetchStudentEnrollmentListHandler();
    }

    if (
      studentId &&
      (!attendanceList || attendanceList?._id !== studentId || attendanceList?.limit === 40)
    ) {
      fetchStudentAttendanceListHandler();
    }
  }, [studentId]);

  useEffect(() => {
    if (enrollmentsList?._id === studentId && attendanceList?._id === studentId) {
      setInfo((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, [enrollmentsList, attendanceList]);

  const fetchStudentEnrollmentListHandler = useCallback(async () => {
    dispatch(getStudentEnrollmentListAction(studentId));
  }, [enrollmentsList, studentId]);

  const fetchStudentAttendanceListHandler = useCallback(
    async (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(getStudentAttendanceListAction(studentId, query));
    },
    [attendanceList, studentId, info?.currentPage, info?.limit]
  );

  const paginationHandlerFunction = useCallback(
    (page) => {
      setInfo((prev) => ({ ...prev, currentPage: page, loading: true }));
      let query = {
        currentPage: page,
      };
      fetchStudentAttendanceListHandler(query);
    },
    [info?.currentPage, info?.limit]
  );

  return (
    <>
      <MetaData title="Attendance | AcademIQ" />
      <CustomTable1
        headers={headers}
        docs={attendanceList?.docs?.map((singleData) => ({
          ...singleData,
          subjectName: singleData?.subject?.name,
          chapterName: singleData?.progress?.chapter?.title,
          value: singleData?.progress?.value || 0 + '%',
          isPresent: singleData?.isPresent ? (
            <Badge className="bg-green-900">Present</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Absent</Badge>
          ),
          time: moment(singleData?.startDate).format('LLL'),
          meet: (
            <a href={singleData?.googleMeet?.meetLink} target="_blank">
              link
            </a>
          ),
        }))}
        cardTitle="Attendance Data"
        loading={info?.loading}
        totalPages={attendanceList?.totalPages}
        currentPage={attendanceList?.currentPage}
        onPageChange={(page) => paginationHandlerFunction(page)}
        limit={info?.limit}
      />
    </>
  );
};

export default memo(AttendanceList);
