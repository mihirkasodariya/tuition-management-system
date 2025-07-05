import React, { memo, useState, useCallback, useEffect } from 'react';
import MetaData from '@/utils/MetaData';
import AttendanceGraph from '@/views/components/graphsStudents/AttendanceGraph';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Card } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { graphActions } from '@/redux/combineActions';
import SubjectProgressGraph from '@/views/components/graphsStudents/SubjectProgressGraph';

const StudentDashboard = () => {
  const [info, setInfo] = useState({
    loading: false,
  });

  const { getStudentDashboardListAction } = graphActions;
  const dispatch = useDispatch();
  const { attendanceGraphData, subjectProgressGraphData, loading } = useSelector(
    (state) => state.graphState
  );

  useEffect(() => {
    if (!attendanceGraphData) {
      fetchStudentDashboardGraphDataHandler();
    }
  }, []);

  const fetchStudentDashboardGraphDataHandler = useCallback(() => {
    dispatch(getStudentDashboardListAction());
  }, [attendanceGraphData]);
  return (
    <MainWrapper>
      <MetaData title="Student Dashboard | AcademIQ" />

      {info?.loading ? (
        <DashboardSkeleton />
      ) : (
        <div className=" space-y-8 p-2">
          {' '}
          <div className="p-3 space-y-4">
            <Card className="w-full">
              <AttendanceGraph attendanceData={attendanceGraphData} />
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
            <Card>
              <SubjectProgressGraph subjectsProgress={subjectProgressGraphData?.subjectsProgress} />
            </Card>
          </div>
        </div>
      )}
    </MainWrapper>
  );
};

export default memo(StudentDashboard);
