import {
  STUDENT_LIST,
  CLEAR_STUDENT_ERRORS,
  RESET_STUDENT_STATE,
  STUDENT_DETAILS,
  ENROLLMENT_LIST,
  ATTENDANCE_LIST,
  UPDATE_STUDENT_STATE,
  DATE_WISE_ATTENDANCE,
  HOMEWORK_LIST,
} from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';
import { objectToQueryString } from '@/helpers';

/**
 * The function `getStudentsListAction` is an asynchronous action creator in JavaScript that fetches a
 * list of students based on a query object and dispatches corresponding actions based on the response.
 * @param {Object} queryObject - The `queryObject` parameter is an object that contains key-value pairs
 * representing the query parameters to be included in the API request URL. These query parameters are
 * used to filter or customize the data that will be retrieved from the API endpoint.
 * @param {Boolean} [reset=false] - The `reset` parameter in the `getStudentsListAction` function is a boolean
 * flag that determines whether to reset the student list before fetching new data. If `reset` is set
 * to `true`, the function dispatches an action to update the student list with `null` before making
 * the API
 */
const getStudentsListAction =
  (queryObject, reset = false) =>
  async (dispatch) => {
    dispatch({ type: STUDENT_LIST.request });
    if (reset) {
      dispatch({ type: STUDENT_LIST.update, payload: null });
    }
    const token = getAccessToken();
    let query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_STUDENT}${API.STUDENT_ACTIONS_TYPES.STUDENTS}${query}`,
      token
    );
    if (response[0] === true) {
      dispatch({ type: STUDENT_LIST.success, payload: response[1]?.data });
    } else {
      dispatch({
        type: STUDENT_LIST.fail,
        payload: response[1],
      });
    }
  };

/**
 * The function `getStudentEnrollmentListAction` fetches a list of enrollments for a specific student
 * and dispatches actions based on the response.
 * @param {String} studentId - The `studentId` parameter in the `getStudentEnrollmentListAction` function is
 * used to specify the ID of the student for whom you want to retrieve the enrollment list. This ID is
 * typically a unique identifier assigned to each student in the system.
 * @param {Boolean} [reset=false] - The `reset` parameter in the `getStudentEnrollmentListAction` function is a
 * boolean parameter that determines whether to reset the enrollment list before fetching new data. If
 * `reset` is set to `true`, the function dispatches an action to update the enrollment list with
 * `null` before making
 */
const getStudentEnrollmentListAction =
  (studentId, reset = false) =>
  async (dispatch) => {
    dispatch({ type: ENROLLMENT_LIST.request });
    if (reset) {
      dispatch({ type: ENROLLMENT_LIST.update, payload: null });
    }
    const token = getAccessToken();
    const response = await Service.fetchGet(
      `${API.ENROLLMENT_BASE}/${studentId}${API.STUDENT_ACTIONS_TYPES.ENROLLMENTS}`,
      token
    );
    if (response[0] === true) {
      const payload = {
        _id: studentId,
        docs: response[1]?.data,
      };
      dispatch({ type: ENROLLMENT_LIST.success, payload });
    } else {
      dispatch({
        type: ENROLLMENT_LIST.fail,
        payload: response[1],
      });
    }
  };

/**
 * The function `registerNewStudentAction` sends a POST request to register a new student using the
 * provided JSON data and access token.
 * @param {Object} json - The `json` parameter in the `registerNewStudentAction` function likely contains the
 * data needed to register a new student. This data could include information such as the student's
 * name, age, grade level, contact details, etc. The function uses this JSON data to send a POST
 * request to the
 * @returns {Object} The `registerNewStudentAction` function is returning the response from the API call made to
 * register a new student.
 */
const registerNewStudentAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.BASE_STUDENT}${API.STUDENT_ACTIONS_TYPES.REGISTER}`,
    json,
    token
  );
  return response;
};

/**
 * The function `updateStudentDetailsAction` sends a PUT request to update a student's details using
 * the provided JSON data and student ID.
 * @param {Object} json - The `json` parameter in the `updateStudentDetailsAction` function is typically an
 * object containing the updated details of a student. This object would include properties such as the
 * student's name, age, grade, or any other information that needs to be updated for the student with
 * the specified `studentId
 * @param {String} studentId - The `studentId` parameter is the unique identifier of the student whose details
 * you want to update. It is used to specify which student's information should be updated in the
 * system.
 * @returns {Object} The `updateStudentDetailsAction` function is returning the response from the PUT request
 * made to update the student details.
 */
const updateStudentDetailsAction = async (json, studentId) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(
    `${API.BASE_STUDENT}${API.STUDENT_ACTIONS_TYPES.STUDENTS}/${studentId}`,
    json,
    token
  );
  return response;
};

/**
 * The function `updateStudentProgressAction` sends a PUT request to update a student's progress for a
 * specific subject in an enrollment.
 * @param {String} enrollmentId - The `enrollmentId` parameter is the unique identifier for a student's
 * enrollment in a course or program.
 * @param {String} subjectId - Subject ID is a unique identifier for a specific subject or course that a student
 * is enrolled in.
 * @param {Object} json - The `json` parameter in the `updateStudentProgressAction` function is typically an
 * object containing the data that you want to update for a specific student's progress in a subject.
 * This data could include information such as grades, attendance, assignments completed, etc. The
 * structure of the `json` object
 * @returns {Object} The `updateStudentProgressAction` function returns the response from the PUT request made
 * to the specified API endpoint with the provided enrollmentId, subjectId, and JSON data.
 */
const updateStudentProgressAction = async (enrollmentId, subjectId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(
    `${API.ENROLLMENT_BASE}/${enrollmentId}/${subjectId}`,
    json,
    token
  );
  return response;
};

/**
 * The function `getSingleStudentDetailAction` dispatches actions to request, successfully fetch, or
 * fail to fetch details of a single student based on the provided studentId.
 * @param {String} studentId - The `studentId` parameter in the `getSingleStudentDetailAction` function is the
 * unique identifier of the student for whom you want to fetch details. It is used to specify which
 * student's details to retrieve from the API.
 */
const getSingleStudentDetailAction = (studentId) => async (dispatch) => {
  dispatch({ type: STUDENT_DETAILS.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(
    `${API.BASE_STUDENT}${API.STUDENT_ACTIONS_TYPES.STUDENTS}/${studentId}`,
    token
  );
  if (response[0] === true) {
    dispatch({ type: STUDENT_DETAILS.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: STUDENT_DETAILS.fail,
      payload: response[1],
    });
  }
};

/**
 * The function `getStudentAttendanceListAction` fetches a student's attendance list based on the
 * provided student ID and query parameters.
 * @param {String} studentId - The `studentId` parameter is the unique identifier of the student for whom you
 * want to retrieve the attendance list.
 * @param {Object} queryObject - The `queryObject` parameter in the `getStudentAttendanceListAction` function is
 * an object that contains key-value pairs representing the query parameters to be included in the API
 * request URL. These query parameters are used to filter or customize the data that will be returned
 * by the API endpoint.
 */
const getStudentAttendanceListAction = (studentId, queryObject) => async (dispatch) => {
  dispatch({ type: ATTENDANCE_LIST.request });

  const token = getAccessToken();
  const query = queryObject ? objectToQueryString(queryObject) : '';
  const response = await Service.fetchGet(
    `${API.ATTENDANCE_BASE}/${studentId}${API.STUDENT_ACTIONS_TYPES.ATTENDANCE}${query}`,
    token
  );
  if (response[0] === true) {
    const payload = {
      _id: studentId,
      ...response[1]?.data,
    };

    dispatch({ type: ATTENDANCE_LIST.success, payload });
  } else {
    dispatch({
      type: ATTENDANCE_LIST.fail,
      payload: response[1],
    });
  }
};

/**
 * The function `createNewEnrollmentAction` sends a POST request to a specific API endpoint with the
 * provided JSON data and access token.
 * @param {Object} json - The `json` parameter in the `createNewEnrollmentAction` function is a JSON object that
 * contains the data needed to create a new enrollment. This data typically includes information such
 * as the student's details, course information, and any other relevant data required for the
 * enrollment process.
 * @returns {Object} The `createNewEnrollmentAction` function is returning the response from the POST request
 * made to the specified API endpoint with the provided JSON data and access token.
 */
const createNewEnrollmentAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.ENROLLMENT_BASE}${API.STUDENT_ACTIONS_TYPES.NEW_ENROLLMENT}`,
    json,
    token
  );
  return response;
};

/**
 * The function `getDateWiseAttendanceAction` dispatches an action to request date-wise attendance data
 * and handles success or failure responses accordingly.
 * @param {Object} queryObject - The `queryObject` parameter is an object that contains key-value pairs
 * representing the query parameters to be included in the API request URL. These query parameters are
 * used to filter or customize the data that will be returned by the API endpoint. The
 * `objectToQueryString` function is likely used to convert this
 */
const getDateWiseAttendanceAction = (queryObject) => async (dispatch) => {
  dispatch({ type: DATE_WISE_ATTENDANCE.request });

  const token = getAccessToken();
  const query = queryObject ? objectToQueryString(queryObject) : '';
  const response = await Service.fetchGet(
    `${API.ATTENDANCE_BASE}${API.STUDENT_ACTIONS_TYPES.ADMIN}${API.STUDENT_ACTIONS_TYPES.DATE_WISE}${query}`,
    token
  );
  if (response[0] === true) {
    dispatch({ type: DATE_WISE_ATTENDANCE.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: DATE_WISE_ATTENDANCE.fail,
      payload: response[1],
    });
  }
};

/**
 * The function `updateAttendanceAction` updates attendance information for a specific attendance ID
 * using a PUT request with the provided JSON data and access token.
 * @param {String} attendanceId - The `attendanceId` parameter is the unique identifier of the attendance record
 * that you want to update.
 * @param {Object} json - The `json` parameter in the `updateAttendanceAction` function is a JavaScript object
 * that contains the data you want to update for the attendance record identified by `attendanceId`.
 * This object should include the fields and values that you want to change or modify in the attendance
 * record.
 * @returns {Object} The `updateAttendanceAction` function returns the response from the PUT request made to the
 * specified API endpoint with the provided JSON data and access token.
 */
const updateAttendanceAction = async (attendanceId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(
    `${API.ATTENDANCE_BASE}${API.STUDENT_ACTIONS_TYPES.ADMIN}/${attendanceId}`,
    json,
    token
  );
  return response;
};

/**
 * The function `getStudentHomeworkListAction` fetches a student's homework list based on the
 * provided student ID and query parameters.
 * @param {String} studentId - The unique identifier of the student for whom you want to retrieve the homework list.
 * @param {Object} queryObject - An object containing query parameters for filtering or customizing the homework list.
 */
const getStudentHomeworkListAction =
  (studentId, queryObject = null) =>
  async (dispatch) => {
    dispatch({ type: HOMEWORK_LIST.request });

    const token = getAccessToken();
    const query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.HOMEWORK_BASE}${API.STUDENT_ACTIONS_TYPES.HOMEWORK_LIST}${query}`,
      token
    );
    if (response[0] === true) {
      const payload = {
        _id: studentId,
        ...response[1]?.data,
      };
      dispatch({ type: HOMEWORK_LIST.success, payload });
    } else {
      dispatch({
        type: HOMEWORK_LIST.fail,
        payload: response[1],
      });
    }
  };

/**
 * The function `assignNewHomeworkAction` asynchronously assigns new homework to a student using a POST
 * request with the provided JSON data and access token.
 * @param {String} studentId - The `studentId` parameter in the `assignNewHomeworkAction` function is the unique
 * identifier of the student to whom the homework is being assigned.
 * @param {Object} json - The `json` parameter in the `assignNewHomeworkAction` function is a JavaScript object
 * that contains the details of the homework assignment to be assigned to the student. It typically
 * includes information such as the title of the homework, the due date, instructions, and any other
 * relevant details needed for the
 * @returns The `assignNewHomeworkAction` function returns the response from the API call made to
 * assign new homework to a specific student.
 */
const assignNewHomeworkAction = async (studentId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.HOMEWORK_BASE}${API.STUDENT_ACTIONS_TYPES.ASSIGN_HOME_WORK}/${studentId}`,
    json,
    token
  );

  return response;
};

/**
 * The function `updateRatingHomeworkAction` asynchronously updates the rating for a specific homework
 * assignment.
 * @param {String} homeworkId - The `homeworkId` parameter is the unique identifier of the homework for which
 * you want to update the rating.
 * @param {Object} json - The `json` parameter in the `updateRatingHomeworkAction` function likely contains the
 * data that needs to be updated for the homework with the specified `homeworkId`. This data could
 * include the new rating or any other information related to the homework that needs to be modified.
 * The function sends a
 * @returns The `updateRatingHomeworkAction` function is returning the response from the PATCH request
 * made to the API endpoint for updating the rating of a homework assignment.
 */
const updateRatingHomeworkAction = async (homeworkId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPatch(
    `${API.HOMEWORK_BASE}${API.STUDENT_ACTIONS_TYPES.ASSIGN_RATING}/${homeworkId}`,
    json,
    token
  );

  return response;
};

/**
 * This function deletes a homework item using an API call with the provided homework ID.
 * @param {String} homeworkId - The `homeworkId` parameter is the unique identifier of the homework that you
 * want to delete. It is used to specify which homework should be deleted from the system.
 * @returns The `deleteHomeworkAction` function is returning the response from the API call made to
 * delete a homework item with the specified `homeworkId`.
 */
const deleteHomeworkAction = async (homeworkId) => {
  const token = getAccessToken();
  const response = await Service.fetchDelete(`${API.HOMEWORK_BASE}/${homeworkId}`, token);
  return response;
};

/**
 * This function updates homework details by sending a PUT request to the API endpoint with the
 * provided homework ID and JSON data, using the access token for authentication.
 * @param {String} homeworkId - The `homeworkId` parameter is the unique identifier of the homework that you
 * want to update.
 * @param {Object} json - The `json` parameter in the `updateHomeworkDetailsAction` function is an object
 * containing the details that you want to update for a specific homework. It could include properties
 * such as `title`, `description`, `dueDate`, `subject`, etc. This object will be sent as the payload
 * @returns The `updateHomeworkDetailsAction` function is returning the response from the PUT request
 * made to the API endpoint `${API.HOMEWORK_BASE}/` with the updated homework details in
 * JSON format.
 */
const updateHomeworkDetailsAction = async (homeworkId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(`${API.HOMEWORK_BASE}/${homeworkId}`, json, token);
  return response;
};

/**
 * The function `updateStudentStateAction` is a Redux action creator that dispatches an action of type
 * `UPDATE_STUDENT_STATE` with a given payload.
 * @param {Object} payload - The `payload` parameter in the `updateStudentStateAction` function typically
 * contains the data that needs to be updated for a student state. This data could include information
 * such as the student's name, ID, grades, or any other relevant details that need to be modified in
 * the application state.
 */
const updateStudentStateAction = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_STUDENT_STATE,
    payload,
  });
};

/**
 * The clearStudentErrorsAction function is a Redux action creator that dispatches an action of type
 * CLEAR_STUDENT_ERRORS.
 */
const clearStudentErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_STUDENT_ERRORS,
  });
};

/**
 * The function `resetStudentAction` is a Redux action creator that dispatches an action of type
 * `RESET_STUDENT_STATE`.
 */
const resetStudentAction = () => (dispatch) => {
  dispatch({ type: RESET_STUDENT_STATE });
};

export default {
  getStudentsListAction,
  registerNewStudentAction,
  updateStudentDetailsAction,
  getSingleStudentDetailAction,
  getStudentEnrollmentListAction,
  updateStudentProgressAction,
  createNewEnrollmentAction,
  getStudentAttendanceListAction,
  updateStudentStateAction,
  getDateWiseAttendanceAction,
  updateAttendanceAction,
  getStudentHomeworkListAction,
  assignNewHomeworkAction,
  updateRatingHomeworkAction,
  deleteHomeworkAction,
  updateHomeworkDetailsAction,
  clearStudentErrorsAction,
  resetStudentAction,
};
