import { USER_PROFILE, CLEAR_USER_PROFILE_ERRORS, RESET_USER_PROFILE_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  profileDetails: null,
};

export const UserProfileReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [USER_PROFILE.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [USER_PROFILE.success]: () => ({
      ...state,
      loading: false, // Ensure loading is set to false on success
      profileDetails: action.payload,
    }),

    // Failure state
    [USER_PROFILE.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Failed to load user profile', // Default error message
      statusCode: action?.payload?.statusCode || 500,
    }),

    // Clear errors
    [CLEAR_USER_PROFILE_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_USER_PROFILE_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
