import {
  GET_MY_ATTENDANCE_LIST,
  GET_MY_ENROLLMENTS_LIST,
  GET_MY_HOMEWORK_LIST,
  GET_MY_SUBJECTS_LIST,
  IS_GOOGLE_INTEGRATION_CONNECTED,
} from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { objectToQueryString } from '@/helpers';
import { BASE_URL } from '@/services/config';
import axios from 'axios';

/**
 * This function retrieves a user's attendance list based on a query object and dispatches actions
 * based on the success or failure of the API call.
 * @param {Object} queryObject - The `queryObject` parameter in the `getMyAttendanceListAction` function is an
 * object that contains query parameters to be included in the API request URL. These query parameters
 * are used to filter or customize the data that will be returned by the API endpoint. The
 * `objectToQueryString` function is
 */

export const getMyAttendanceListAction = createAsyncThunk(
  GET_MY_ATTENDANCE_LIST,
  async (queryObject, { rejectWithValue }) => {
    const token = getAccessToken();
    const query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.STUDENT_ATTENDANCE}${API.BASE_ACTIONS_TYPES.ATTENDANCE}${query}`,
      token
    );
    if (response[0] === true) {
      return response[1].data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

export const getMySubjectsListAction = createAsyncThunk(
  GET_MY_SUBJECTS_LIST,
  async (queryObject, { rejectWithValue }) => {
    const token = getAccessToken();
    const query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_SUBJECT}${API.BASE_ACTIONS_TYPES.LIST}${query}`,
      token
    );
    if (response[0] === true) {
      return response[1].data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

export const getMyEnrollmentsListAction = createAsyncThunk(
  GET_MY_ENROLLMENTS_LIST,
  async (queryObject, { rejectWithValue }) => {
    const token = getAccessToken();
    const response = await Service.fetchGet(
      `${API.BASE_STUDENT_ENROLLMENT}${API.BASE_ACTIONS_TYPES.MY_ENROLLMENTS}`,
      token
    );
    if (response[0] === true) {
      return response[1].data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

export const getMyHomeworkListAction = createAsyncThunk(
  GET_MY_HOMEWORK_LIST,
  async (queryObject, { rejectWithValue }) => {
    const token = getAccessToken();
    const query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_STUDENT_HOMEWORK}${API.BASE_ACTIONS_TYPES.MY_HOMEWORKS}${query}`,
      token
    );
    if (response[0] === true) {
      return response[1].data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

export const isGoogleConnectedAction = createAsyncThunk(
  IS_GOOGLE_INTEGRATION_CONNECTED,
  async (queryObject, { rejectWithValue }) => {
    try {
      const token = getAccessToken();

      let url = `${BASE_URL}${API.BASE_AUTH}${API.BASE_ACTIONS_TYPES.GOOGLE}${API.BASE_ACTIONS_TYPES.MY_PROFILE}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data?.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export default {
  getMyAttendanceListAction,
  getMySubjectsListAction,
  getMyEnrollmentsListAction,
  getMyHomeworkListAction,
  isGoogleConnectedAction,
};
