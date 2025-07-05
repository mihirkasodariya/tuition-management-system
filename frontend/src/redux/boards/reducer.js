import { BOARD_LIST, CLEAR_BOARD_ERRORS, RESET_BOARD_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  boardsList: null,
};

export const BoardReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [BOARD_LIST.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [BOARD_LIST.success]: () => ({
      ...state,
      loading: false,
      boardsList: action.payload,
    }),

    // Update states
    [BOARD_LIST.update]: () => ({
      ...state,
      boardsList: action.payload,
    }),

    // Failure state
    [BOARD_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Request failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),

    // Clear errors
    [CLEAR_BOARD_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_BOARD_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
