import { USER_LOGIN, CLEAR_LOGIN_ERRORS, RESET_LOGIN_STATE } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { setAccessToken } from '@/helpers/local-storage';

const loginUserAction = (json) => async (dispatch) => {
  dispatch({ type: USER_LOGIN.request });
  const response = await Service.fetchPost(`${API.USERS_LOGIN.USER}${API.USERS_LOGIN.LOGIN}`, json);
  if (response[0] === true) {
    setAccessToken(response[1]?.accessToken);
    dispatch({ type: USER_LOGIN.success, payload: response[1]?.data?.role });
  } else {
    dispatch({
      type: USER_LOGIN.fail,
      payload: response[1],
    });
  }
};

const clearLoginErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_LOGIN_ERRORS,
  });
};

const resetLoginAction = () => (dispatch) => {
  dispatch({ type: RESET_LOGIN_STATE });
};
export default {
  loginUserAction,
  clearLoginErrorsAction,
  resetLoginAction,
};
