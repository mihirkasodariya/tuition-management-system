import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { myDetailsActions } from '@/redux/combineActions';
import _ from 'lodash';
import MetaData from '@/utils/MetaData';
import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/assets/css/attendance/calenderevent.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);
const breadCrumbs = [
  { label: 'Attendances', href: null },
  { label: 'Attendance Calendar', href: null },
];

const MyAttendanceCalendar = () => {
  const { getMyAttendanceListAction } = myDetailsActions;

  const dispatch = useDispatch();
  const { myAttendanceList, loading } = useSelector((state) => state.myDetailsState);

  const [info, setInfo] = useState({
    loading: true,
    limit: 40,
    currentPage: 1,
    startDate: moment().startOf('month').toDate(),
    endDate: moment().endOf('month').toDate(),
  });

  useEffect(() => {
    const startDate = moment(info?.startDate).format('YYYY-MM-DD');
    const endDate = moment(info?.endDate).format('YYYY-MM-DD');
    const query = {
      startDate,
      endDate,
    };
    fetchStudentAttendanceListHandler(query);
  }, [info?.startDate, info?.endDate]);

  const fetchStudentAttendanceListHandler = useCallback(
    async (queryObject) => {
      let query = {
        page: queryObject?.currentPage ?? info?.currentPage,
        limit: queryObject?.limit ?? info?.limit,
        startDate: queryObject?.startDate ?? info?.startDate,
        endDate: queryObject?.endDate ?? info?.endDate,
      };
      dispatch(getMyAttendanceListAction(query));
    },
    [myAttendanceList, info?.currentPage, info?.limit]
  );

  const onRangeChangeHandler = ({ start, end }) => {
    if (start && end) {
      setInfo((prev) => ({
        ...prev,
        startDate: start,
        endDate: end,
      }));
    }
  };

  // Transform your events into the format required by react-big-calendar
  const attendanceEvents = useMemo(
    () =>
      myAttendanceList?.docs?.map((singleAttendance) => ({
        id: singleAttendance._id,
        title: singleAttendance?.isPresent ? (
          <Badge className="bg-green-900">Present</Badge>
        ) : (
          <Badge className="bg-red-800">Absent</Badge>
        ),
        start: new Date(singleAttendance?.startDate),
        end: new Date(singleAttendance?.endDate),
      })) || [],
    [myAttendanceList]
  );
  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <MetaData title="Attendance Calendar | AcademIQ" />
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Attendance Calendar</CardTitle>
        </CardHeader>
        <CardContent className="h-screen ">
          <Calendar
            localizer={localizer}
            events={attendanceEvents}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
            defaultDate={new Date()}
            onRangeChange={onRangeChangeHandler}
          />
        </CardContent>
      </Card>
    </MainWrapper>
  );
};

export default memo(MyAttendanceCalendar);
