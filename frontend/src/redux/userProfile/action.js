import { USER_PROFILE, CLEAR_USER_PROFILE_ERRORS, RESET_USER_PROFILE_STATE } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';

const getUserProfileAction = () => async (dispatch) => {
  dispatch({ type: USER_PROFILE.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(`${API.BASE_USER}${API.USERS_PROFILE.Profile}`, token);
  if (response[0] === true) {
    dispatch({ type: USER_PROFILE.success, payload: response[1].data });
  } else {
    dispatch({
      type: USER_PROFILE.fail,
      payload: response[1],
    });
  }
};

const updateUserPasswordAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(
    `${API.BASE_USER}${API.USERS_PROFILE.Profile}${API.USERS_PROFILE.UPDATE_PASSWORD}`,
    json,
    token
  );
  return response;
};

const clearUserProfileErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_USER_PROFILE_ERRORS,
  });
};

const resetUserProfileAction = () => (dispatch) => {
  dispatch({ type: RESET_USER_PROFILE_STATE });
};
export default {
  getUserProfileAction,
  updateUserPasswordAction,
  clearUserProfileErrorsAction,
  resetUserProfileAction,
};
