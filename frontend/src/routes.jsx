import StudentDetails from './views/pages/students/StudentDetails';
import AuthWrapper from './views/layouts/AuthWrapper';
import Batches from './views/pages/batches/Batches';
import Boards from './views/pages/boards/Boards';
import PublicBoardsPage from './views/pages/boards/PublicBoardsPage';
import Dashboard from './views/pages/Dashboard';
import Home from './views/pages/Home';
import Login from './views/pages/Login';
import NotFound from './views/pages/NotFound';
import ProgressUpdate from './views/pages/progress/ProgressUpdate';
import RegisterStudent from './views/pages/students/RegisterStudent';
import StudentsList from './views/pages/students/StudentsList';
import CreateSubjectPage from './views/pages/subject/CreateSubject';
import PublicChapterDetail from './views/pages/subject/PublicChapterDetail';
import PublicSubjects from './views/pages/subject/PublicSubjects';
import SubjectLists from './views/pages/subject/SubjectLists';
import AdminAttendanceMark from './views/pages/attendance/AdminAttendanceMark';
import SubjectEdit from './views/pages/subject/SubjectEdit';
import EditSingleChapter from './views/pages/subject/EditSingleChapter';
import ContactList from './views/pages/contact/ContactList';
import Setting from './views/pages/Profile/UserSettings';
import { ADMIN, STUDENT } from './constants/roles.constants';
import MyAttendance from './views/pages/attendance/MyAttendance';
import MyAttendanceCalendar from './views/pages/attendance/MyAttendanceCalendar';
import MySubjectLists from './views/pages/subject/MySubjectLists';
import MyEnrollments from './views/pages/enrollments/MyEnrollments';
import MyChapterProgress from './views/pages/progress/MyChapterProgress';
import Builder from './views/pages/builder/Builder';
import EditBuilder from './views/pages/builder/EditBuilder';
import NotesList from './views/pages/builder/NotesList';
import MyHomeworks from './views/pages/homework/MyHomeworks';

const allRoutesMapper = [
  {
    path: '/',
    component: <Home />,
  },
  {
    path: '/login',
    component: <Login />,
  },
  {
    path: '/boards',
    component: <PublicBoardsPage />,
  },
  {
    path: '/subjects/:boardId',
    component: <PublicSubjects />,
  },
  {
    path: '/subjects/:boardId/:subjectId',
    component: <PublicChapterDetail />,
  },
  {
    path: '/dashboard',
    component: (
      <AuthWrapper roles={[ADMIN, STUDENT]}>
        <Dashboard />
      </AuthWrapper>
    ),
  },
  {
    path: '/batches',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <Batches />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/boards',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <Boards />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/subjects',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <SubjectLists />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/subject/create-subject',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <CreateSubjectPage />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/subject/:subjectId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <SubjectEdit />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/subject/:subjectId/:chapterId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <EditSingleChapter />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/students/register',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <RegisterStudent />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/students',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <StudentsList />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/students/:studentId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <RegisterStudent />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/student-details/:studentId/:pageType',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <StudentDetails />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/student-details/:studentId/student-enrollments/:enrollmentId/edit/:subjectId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <ProgressUpdate isEdit={true} />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/student-details/:studentId/student-enrollments/:enrollmentId/view/:subjectId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <ProgressUpdate isEdit={false} />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/mark-attendance',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <AdminAttendanceMark />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/contact-forms',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <ContactList />
      </AuthWrapper>
    ),
  },
  {
    path: '/settings/:settingId',
    component: (
      <AuthWrapper roles={[ADMIN, STUDENT]}>
        <Setting />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-attendance/attendance-list',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MyAttendance />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-attendance/attendance-calendar',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MyAttendanceCalendar />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-subjects',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MySubjectLists />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-subjects/enrollments',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MyEnrollments />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-subjects/enrollments/:enrollmentId/:subjectId',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MyChapterProgress />
      </AuthWrapper>
    ),
  },
  {
    path: '/my-homeworks',
    component: (
      <AuthWrapper roles={[STUDENT]}>
        <MyHomeworks />
      </AuthWrapper>
    ),
  },
  {
    path: '/admin/notes',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <NotesList />
      </AuthWrapper>
    ),
  },

  {
    path: '/builder/:noteId',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <EditBuilder />
      </AuthWrapper>
    ),
  },
  {
    path: '/builder',
    component: (
      <AuthWrapper roles={[ADMIN]}>
        <EditBuilder />
      </AuthWrapper>
    ),
  },
  { path: '/notes/:noteId', component: <Builder /> },

  {
    path: '*',
    component: <NotFound />,
  },
];

export default allRoutesMapper;
