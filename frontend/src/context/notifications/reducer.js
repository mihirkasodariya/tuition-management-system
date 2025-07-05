import { initialState } from './state';

const actionHandlers = {
  FETCH_NOTIFICATIONS: (state, action) => ({
    ...state,
    notifications: action.payload || {},
  }),
  // SET_NOTIFICATION: (state, action) => ({
  //   ...state,
  //   notification: action.payload,
  // }),
  UPDATE_NOTIFICATION_STATE: (state, action) => ({
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
