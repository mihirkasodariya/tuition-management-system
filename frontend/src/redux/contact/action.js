import { CONTACT_FORM_LIST, CLEAR_CONTACT_FORM_ERRORS, RESET_CONTACT_FORM_STATE } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';
import { objectToQueryString } from '@/helpers';

const getContactFormListAction =
  (queryObject = null) =>
  async (dispatch) => {
    dispatch({ type: CONTACT_FORM_LIST.request });
    const token = getAccessToken();
    const query = queryObject ? objectToQueryString(queryObject) : '';
    const response = await Service.fetchGet(
      `${API.BASE_CONTACT}${API.CONTACT_ACTION_TYPES.ADMIN}${API.CONTACT_ACTION_TYPES.CONTACTS}${query}`,
      token
    );
    if (response[0] === true) {
      dispatch({ type: CONTACT_FORM_LIST.success, payload: response[1]?.data });
    } else {
      dispatch({
        type: CONTACT_FORM_LIST.fail,
        payload: response[1],
      });
    }
  };

const clearContactErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_CONTACT_FORM_ERRORS,
  });
};

const resetContactAction = () => (dispatch) => {
  dispatch({ type: RESET_CONTACT_FORM_STATE });
};

export default {
  getContactFormListAction,
  clearContactErrorsAction,
  resetContactAction,
};
