import React, { memo, useCallback, useMemo } from 'react';
import MainWrapper from '@/views/layouts/Mainwrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import UpdateStudentDetails from './UpateStudentDetails';
import AttendanceList from './AttendanceList';
import Enrollments from './Enrollments';
import AttendanceCalendar from './AttendanceCalendar';
import HomeworkList from './HomeworkList';

const menuItems = [
  {
    id: 'student-profile',
    label: 'Student Profile',
    breadCrumbs: [
      { label: 'Students', href: '/admin/students' },
      { label: 'Student Details', href: null },
      { label: 'Profile', href: null },
    ],
  },
  {
    id: 'student-enrollments',
    label: 'Student Enrollments',
    breadCrumbs: [
      { label: 'Students', href: '/admin/students' },
      { label: 'Student Details', href: null },
      { label: 'Enrollments', href: null },
    ],
  },
  {
    id: 'student-attendance',
    label: 'Student Attendance',
    breadCrumbs: [
      { label: 'Students', href: '/admin/students' },
      { label: 'Student Details', href: null },
      { label: 'Attendance', href: null },
    ],
  },
  {
    id: 'student-attendance-calendar',
    label: 'Attendance Calendar',
    breadCrumbs: [
      { label: 'Students', href: '/admin/students' },
      { label: 'Student Details', href: null },
      { label: 'Attendance Calendar', href: null },
    ],
  },
  {
    id: 'student-homework',
    label: 'HomeWorks',
    breadCrumbs: [
      { label: 'Students', href: '/admin/students' },
      { label: 'Student Details', href: null },
      { label: 'Homeworks', href: null },
    ],
  },
];

const settingsMenuMapper = {
  'student-profile': UpdateStudentDetails,
  'student-enrollments': Enrollments,
  'student-attendance': AttendanceList,
  'student-attendance-calendar': AttendanceCalendar,
  'student-homework': HomeworkList,
};

const StudentDetails = () => {
  const { studentId, pageType } = useParams();
  const navigate = useNavigate();

  const ComponentRender = useMemo(
    () => settingsMenuMapper[pageType] || settingsMenuMapper['student-profile'],
    [pageType]
  );
  const breadCrumbs = useMemo(() => {
    let current = menuItems.find((item) => item.id === pageType);
    return current?.breadCrumbs || menuItems[0].breadCrumbs;
  }, [pageType]);

  const handleTabChange = useCallback(
    (id) => {
      navigate(`/admin/student-details/${studentId}/${id}`);
    },
    [pageType]
  );

  return (
    <MainWrapper breadCrumbs={breadCrumbs}>
      <div className="flex gap-6 mt-4 h-[85vh]">
        <div className="flex flex-col gap-6  w-4/5">
          <div className="max-h-[85vh] overflow-y-auto pr-2 ">
            <ComponentRender />
          </div>
        </div>

        <div className="sticky w-1/5 top-4">
          <Card className=" bg-white dark:bg-gray-800 p-4 border-r dark:border-gray-700">
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            <div className="max-h-[calc(100vh-100px)] overflow-y-auto pr-2">
              <nav className="flex flex-col space-y-1">
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={studentId === item.id ? 'secondary' : 'ghost'}
                    className={`justify-start text-left ${
                      pageType === item.id ? 'font-medium bg-gray-100 dark:bg-gray-700' : ''
                    }`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
          </Card>
        </div>
      </div>
    </MainWrapper>
  );
};

export default memo(StudentDetails);
