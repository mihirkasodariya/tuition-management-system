import { CONTACT_FORM_LIST, CLEAR_CONTACT_FORM_ERRORS, RESET_CONTACT_FORM_STATE } from './constant';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  contactList: null,
};

export const ContactFormReducer = (state = initialState, action) => {
  const actionHandlers = {
    // Loading state
    [CONTACT_FORM_LIST.request]: () => ({
      ...state,
      loading: true,
    }),

    // Success state
    [CONTACT_FORM_LIST.success]: () => ({
      ...state,
      loading: false,
      contactList: action.payload,
    }),

    // Failure state
    [CONTACT_FORM_LIST.fail]: () => ({
      ...state,
      loading: false,
      error: action?.payload?.message || 'Contact form failed',
      statusCode: action?.payload?.statusCode || 500,
    }),

    // Clear errors
    [CLEAR_CONTACT_FORM_ERRORS]: () => ({
      ...state,
      statusCode: null,
      error: null,
    }),

    // Reset state to initial
    [RESET_CONTACT_FORM_STATE]: () => initialState,
  };

  const handler = actionHandlers[action.type];
  return handler ? handler() : state;
};
