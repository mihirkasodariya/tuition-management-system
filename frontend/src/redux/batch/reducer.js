import { BATCH_LIST, CLEAR_BATCH_ERRORS, RESET_BATCH_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  batchesList: null,
};

export const BatchReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [BATCH_LIST.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [BATCH_LIST.success]: () => ({
      ...state,
      loading: false,
      batchesList: action.payload,
    }),

    // Failure state
    [BATCH_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Login failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),

    // Clear errors
    [CLEAR_BATCH_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_BATCH_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
