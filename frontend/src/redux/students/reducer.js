import {
  STUDENT_LIST,
  STUDENT_DETAILS,
  CLEAR_STUDENT_ERRORS,
  RESET_STUDENT_STATE,
  ENROLLMENT_LIST,
  ATTENDANCE_LIST,
  UPDATE_STUDENT_STATE,
  DATE_WISE_ATTENDANCE,
  HOMEWORK_LIST,
} from './constant';

const initialState = {
  loading: false,
  enrollmentLoading: false,
  error: null,
  statusCode: null,
  studentsList: null,
  singleStudentDetail: null,
  enrollmentsList: null,
  attendanceList: null,
  dateWiseAttendance: null,
  myAttendanceList: null,
  homeworkList: null,
};

export const StudentReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [STUDENT_LIST.request]: () => ({
      ...state,
      loading: true,
    }),
    [STUDENT_DETAILS.request]: () => ({
      ...state,
      loading: true,
    }),
    [ENROLLMENT_LIST.request]: () => ({
      ...state,
      enrollmentLoading: true,
    }),
    [ATTENDANCE_LIST.request]: () => ({
      ...state,
      loading: true,
    }),
    [DATE_WISE_ATTENDANCE.request]: () => ({
      ...state,
      loading: true,
    }),
    [HOMEWORK_LIST.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [STUDENT_LIST.success]: () => ({
      ...state,
      loading: false,
      studentsList: action.payload,
    }),
    [STUDENT_DETAILS.success]: () => ({
      ...state,
      loading: false,
      singleStudentDetail: action.payload,
    }),
    [ENROLLMENT_LIST.success]: () => ({
      ...state,
      enrollmentLoading: false,
      enrollmentsList: action.payload,
    }),
    [ATTENDANCE_LIST.success]: () => ({
      ...state,
      loading: false,
      attendanceList: action.payload,
    }),
    [DATE_WISE_ATTENDANCE.success]: () => ({
      ...state,
      loading: false,
      dateWiseAttendance: action.payload,
    }),
    [HOMEWORK_LIST.success]: () => ({
      ...state,
      loading: false,
      homeworkList: action.payload,
    }),

    // updating state
    [STUDENT_LIST.update]: () => ({
      ...state,
      studentsList: action.payload,
    }),
    [STUDENT_DETAILS.update]: () => ({
      ...state,
      singleStudentDetail: action.payload,
    }),
    [ENROLLMENT_LIST.update]: () => ({
      ...state,
      enrollmentsList: action.payload,
    }),
    [ATTENDANCE_LIST.update]: () => ({
      ...state,
      attendanceList: action.payload,
    }),
    [HOMEWORK_LIST.update]: () => ({
      ...state,
      homeworkList: action.payload,
    }),

    // Failure state
    [STUDENT_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Fetching students failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),
    [STUDENT_DETAILS.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Fetching students failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),
    [ENROLLMENT_LIST.fail]: () => ({
      ...state,
      enrollmentLoading: false,
      error: action?.payload?.message || 'Fetching enrollments failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),
    [ATTENDANCE_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Fetching attendance failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),
    [DATE_WISE_ATTENDANCE.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Fetching date wise attendance failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),
    [HOMEWORK_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Fetching homework failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),

    // global update State
    [UPDATE_STUDENT_STATE]: () => ({
      ...state,
      ...action.payload,
      // studentsList: action.payload?.studentsList ?? state.studentsList,
      // singleStudentDetail: action.payload?.singleStudentDetail ?? state.singleStudentDetail,
      // enrollmentsList: action.payload?.enrollmentsList ?? state.enrollmentsList,
      // attendanceList: action.payload?.attendanceList ?? state.attendanceList,
    }),

    // Clear errors
    [CLEAR_STUDENT_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_STUDENT_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
