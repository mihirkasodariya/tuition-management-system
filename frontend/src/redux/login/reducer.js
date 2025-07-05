import { USER_LOGIN, CLEAR_LOGIN_ERRORS, RESET_LOGIN_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  isLoginSuccess: null,
  role: null,
};

export const LoginReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [USER_LOGIN.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [USER_LOGIN.success]: () => ({
      ...state,
      loading: false, // Ensure loading is set to false on success
      isLoginSuccess: true,
      role: action.payload,
    }),

    // Failure state
    [USER_LOGIN.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Login failed', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),

    // Clear errors
    [CLEAR_LOGIN_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_LOGIN_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
