import {
  SUBJECTS_LIST,
  CLEAR_SUBJECT_ERRORS,
  RESET_SUBJECT_STATE,
  PUBLIC_SUBJECTS_LIST,
  PUBLIC_SUBJECT_DETAIL,
  UPDATE_SUBJECT_STATE,
} from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';
import { objectToQueryString } from '@/helpers';
import _ from 'lodash';

const getSubjectsListAction =
  (queryObject = null) =>
  async (dispatch) => {
    dispatch({ type: SUBJECTS_LIST.request });
    const token = getAccessToken();
    let query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_SUBJECT}${API.SUBJECT_ACTIONS_TYPES.LIST}${query}`,
      token
    );
    if (response[0] === true) {
      dispatch({ type: SUBJECTS_LIST.success, payload: response[1]?.data });
    } else {
      dispatch({
        type: SUBJECTS_LIST.fail,
        payload: response[1],
      });
    }
  };

const getPublicSubjectsListAction =
  (queryObject = null) =>
  async (dispatch) => {
    dispatch({ type: PUBLIC_SUBJECTS_LIST.request });
    const token = getAccessToken();
    let query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_SUBJECT}${API.SUBJECT_ACTIONS_TYPES.LIST}${query}`,
      token
    );
    if (response[0] === true) {
      let groupedData = _.groupBy(response[1]?.data, 'class');
      let payload = {
        ...queryObject,
        docs: groupedData,
      };

      dispatch({ type: PUBLIC_SUBJECTS_LIST.success, payload });
    } else {
      dispatch({
        type: PUBLIC_SUBJECTS_LIST.fail,
        payload: response[1],
      });
    }
  };

const getPublicSubjectDetailAction = (subjectID) => async (dispatch) => {
  dispatch({ type: PUBLIC_SUBJECT_DETAIL.request });
  const response = await Service.fetchGet(`${API.BASE_SUBJECT}/${subjectID}`);
  if (response[0] === true) {
    dispatch({ type: PUBLIC_SUBJECT_DETAIL.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: PUBLIC_SUBJECT_DETAIL.fail,
      payload: response[1],
    });
  }
};

const createNewSubjectAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.BASE_SUBJECT}${API.SUBJECT_ACTIONS_TYPES.NEW_SUBJECT}`,
    json,
    token
  );
  return response;
};

const updateSubjectChapterAction = async (chapterId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(
    `${API.BASE_SUBJECT}${API.SUBJECT_ACTIONS_TYPES.CHAPTERS}/${chapterId}`,
    json,
    token
  );
  return response;
};

const updateSubjectStateAction = (payload) => (dispatch) => {
  dispatch({
    type: UPDATE_SUBJECT_STATE,
    payload,
  });
};

const clearSubjectErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_SUBJECT_ERRORS,
  });
};

const resetSubjectAction = () => (dispatch) => {
  dispatch({ type: RESET_SUBJECT_STATE });
};

export default {
  getSubjectsListAction,
  createNewSubjectAction,
  getPublicSubjectsListAction,
  getPublicSubjectDetailAction,
  updateSubjectChapterAction,
  updateSubjectStateAction,
  clearSubjectErrorsAction,
  resetSubjectAction,
};
