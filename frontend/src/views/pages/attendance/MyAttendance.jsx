import React, { useState, useEffect, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myDetailsActions } from '@/redux/combineActions';
import _ from 'lodash';
import MetaData from '@/utils/MetaData';
import CustomTable1 from '@/views/components/tables/TableV1';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import MainWrapper from '@/views/layouts/Mainwrapper';

const headers = [
  { title: 'Summary', key: 'summary' },
  { title: 'Subject', key: 'subjectName' },
  { title: 'Chapter', key: 'chapterName' },
  { title: 'Progress', key: 'value' },
  { title: 'Time', key: 'time' },
  { title: 'Meet', key: 'meet' },
  { title: 'Attended', key: 'isPresent' },
];
const breadCrumbs = [
  { label: 'Attendances', href: null },
  { label: 'Attendance Calendar', href: null },
];

const MyAttendance = () => {
  const { getMyAttendanceListAction } = myDetailsActions;

  const dispatch = useDispatch();
  const { myAttendanceList, loading } = useSelector((state) => state.myDetailsState);

  const [info, setInfo] = useState({
    loading: true,
    limit: 20,
    currentPage: 1,
  });

  useEffect(() => {
    if (!myAttendanceList || myAttendanceList?.limit === 40) {
      fetchStudentAttendanceListHandler();
    }
  }, []);

  const fetchStudentAttendanceListHandler = useCallback(
    async (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
      };
      dispatch(getMyAttendanceListAction(query));
    },
    [myAttendanceList, info?.currentPage, info?.limit]
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
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="My Attendance | AcademIQ" />
      <br />
      <CustomTable1
        headers={headers}
        docs={myAttendanceList?.docs?.map((singleData) => ({
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
        loading={loading}
        totalPages={myAttendanceList?.totalPages}
        currentPage={myAttendanceList?.currentPage}
        onPageChange={(page) => paginationHandlerFunction(page)}
        limit={info?.limit}
      />
    </MainWrapper>
  );
};

export default memo(MyAttendance);
