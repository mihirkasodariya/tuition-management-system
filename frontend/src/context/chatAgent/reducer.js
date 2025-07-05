import { initialState } from './state';

const actionHandlers = {
  CHAT_MODEL: (state, action) => ({
    ...state,
    isChatModalOpen: action.payload,
  }),
  SET_SESSION_ID: (state, action) => ({
    ...state,
    sessionId: action.payload,
  }),
  FETCH_SESSION_DETAILS: (state, action) => ({
    ...state,
    sessionDetails: action.payload,
  }),
  UPDATE_CHAT_AGENT_STATE: (state, action) => ({
    ...state,
    ...action.payload,
  }),
  RESET_STATE: () => ({ ...initialState }),
};
const Reducer = (state, action) => {
  const handler = actionHandlers[action?.type];
  return handler ? handler(state, action) : state;
};

export default Reducer;
