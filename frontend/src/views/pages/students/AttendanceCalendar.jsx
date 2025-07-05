import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import { studentActions } from '@/redux/combineActions';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/assets/css/attendance/calenderevent.css';
import { Badge } from '@/components/ui/badge';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const EventCalendar = () => {
  const { getStudentAttendanceListAction, getStudentEnrollmentListAction } = studentActions;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { enrollmentsList, attendanceList } = useSelector((state) => state.studentState);
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

  useEffect(() => {
    if (studentId && (!enrollmentsList || enrollmentsList?._id !== studentId)) {
      fetchStudentEnrollmentListHandler();
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
        startDate: queryObject?.startDate ?? info?.startDate,
        endDate: queryObject?.endDate ?? info?.endDate,
      };
      dispatch(getStudentAttendanceListAction(studentId, query));
    },
    [attendanceList, studentId, info?.currentPage, info?.limit]
  );

  // Transform your events into the format required by react-big-calendar
  const attendanceEvents = useMemo(
    () =>
      attendanceList?.docs?.map((singleAttendance) => ({
        id: singleAttendance._id,
        title: singleAttendance?.isPresent ? (
          <Badge className="bg-green-900">Present</Badge>
        ) : (
          <Badge className="bg-red-800">Absent</Badge>
        ),
        start: new Date(singleAttendance?.startDate),
        end: new Date(singleAttendance?.endDate),
      })) || [],
    [attendanceList]
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

  return (
    <div className="h-screen">
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
    </div>
  );
};

export default memo(EventCalendar);
