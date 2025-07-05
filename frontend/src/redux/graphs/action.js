import {
  DASHBOARD_GRAPH_DATA,
  CLEAR_GRAPH_ERRORS,
  RESET_GRAPH_STATE,
  STUDENT_DASHBOARD_GRAPH_DATA,
} from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';

const getAdminDashboardListAction = () => async (dispatch) => {
  dispatch({ type: DASHBOARD_GRAPH_DATA.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(
    `${API.BASE_GRAPH}${API.GRAPH_ACTION_TYPES.ADMIN}${API.GRAPH_ACTION_TYPES.DASHBOARD}`,
    token
  );
  if (response[0] === true) {
    dispatch({ type: DASHBOARD_GRAPH_DATA.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: DASHBOARD_GRAPH_DATA.fail,
      payload: response[1],
    });
  }
};

const getStudentDashboardListAction = (queryObject) => async (dispatch) => {
  dispatch({ type: STUDENT_DASHBOARD_GRAPH_DATA.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(
    `${API.BASE_GRAPH}${API.GRAPH_ACTION_TYPES.STUDENT}${API.GRAPH_ACTION_TYPES.DASHBOARD}`,
    token
  );
  if (response[0] === true) {
    dispatch({ type: STUDENT_DASHBOARD_GRAPH_DATA.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: STUDENT_DASHBOARD_GRAPH_DATA.fail,
      payload: response[1],
    });
  }
};

const clearGraphErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_GRAPH_ERRORS,
  });
};

const resetGraphAction = () => (dispatch) => {
  dispatch({ type: RESET_GRAPH_STATE });
};
export default {
  getAdminDashboardListAction,
  getStudentDashboardListAction,
  clearGraphErrorsAction,
  resetGraphAction,
};
