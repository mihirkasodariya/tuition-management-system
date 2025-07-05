import React, { useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import StudentDashboard from '../features/dashboard/StudentDashboard';

const mapperObject = {
  admin: AdminDashboard,
  student: StudentDashboard,
};
const Dashboard = () => {
  const { profileDetails } = useSelector((state) => state.userProfileState);

  const DashboardMapper = useMemo(() => {
    let Mapper = mapperObject[profileDetails?.role];
    return Mapper ?? null;
  }, [profileDetails?.role]);

  return <DashboardMapper /> ?? null;
};

export default memo(Dashboard);
