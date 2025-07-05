import { BOARD_LIST, CLEAR_BOARD_ERRORS, RESET_BOARD_STATE } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import { getAccessToken } from '@/helpers/local-storage';

const getBoardsListAction = () => async (dispatch) => {
  dispatch({ type: BOARD_LIST.request });
  const token = getAccessToken();
  const response = await Service.fetchGet(
    `${API.BASE_BOARD}${API.BOARD_ACTIONS_TYPES.LIST}`,
    token
  );
  if (response[0] === true) {
    dispatch({ type: BOARD_LIST.success, payload: response[1]?.data });
  } else {
    dispatch({
      type: BOARD_LIST.fail,
      payload: response[1],
    });
  }
};

const createNewBoardAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.BASE_BOARD}${API.BOARD_ACTIONS_TYPES.NEW_BOARD}`,
    json,
    token
  );
  return response;
};

const updateBoardAction = async (boardId, json) => {
  const token = getAccessToken();
  const response = await Service.fetchPut(`${API.BASE_BOARD}/${boardId}`, json, token);
  return response;
};

const clearBoardErrorsAction = () => (dispatch) => {
  dispatch({
    type: CLEAR_BOARD_ERRORS,
  });
};

const resetBoardAction = () => (dispatch) => {
  dispatch({ type: RESET_BOARD_STATE });
};
export default {
  getBoardsListAction,
  createNewBoardAction,
  updateBoardAction,
  clearBoardErrorsAction,
  resetBoardAction,
};
