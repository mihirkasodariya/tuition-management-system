import { useReducer } from 'react';
import { Actions } from './action';
import Reducer from './reducer';
import { getSessionDetailsApi } from '@/apis/ai.api';
import { removeChatSessionId, setChatSessionId } from '@/helpers/session-storage';

export const initialState = {
  isChatModalOpen: false,
  sessionDetails: null,
  sessionId: null,
};

export const ChatAgentState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const chatModalAction = (isOpen) => {
    dispatch({ type: Actions.CHAT_MODEL, payload: isOpen });
  };

  const setSessionIdAction = (sessionId = null) => {
    if (sessionId === null) {
      removeChatSessionId();
    } else {
      setChatSessionId(sessionId);
    }
    dispatch({ type: Actions.SET_SESSION_ID, payload: sessionId });
  };

  const fetchSessionDetailsAction = async (sessionId) => {
    let response = await getSessionDetailsApi(sessionId);
    if (response[0] === true) {
      dispatch({
        type: Actions.FETCH_SESSION_DETAILS,
        payload: response[1]?.data,
      });
    }

    return response;
  };

  const updateChatAgentStateAction = (payload) => {
    dispatch({ type: Actions.UPDATE_CHAT_AGENT_STATE, payload });
  };

  const resetChatAgentAction = () => {
    dispatch({ type: Actions.RESET_STATE });
  };

  return {
    ...state,
    chatModalAction,
    setSessionIdAction,
    fetchSessionDetailsAction,
    updateChatAgentStateAction,
    resetChatAgentAction,
  };
};
