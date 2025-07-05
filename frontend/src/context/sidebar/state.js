import { useReducer } from 'react';
import { Actions } from './action';
import Reducer from './reducer';

export const initialState = {
  isSidebarOpen: true,
  navMainAdmin: {
    dashboard: false,
    batch: false,
    education_boards: false,
    tuition_subject: true,
    students: true,
    contact: false,
    notes: false,
  },

  navMainStudent: {
    dashboard: false,
    subjects: true,
    attendance: true,
    homework: true,
  },
};

export const SidebarState = () => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  const isSidebarOpenAction = (isOpen) => {
    dispatch({ type: Actions.IS_SIDEBAR_OPEN, payload: isOpen });
  };

  const changeNavMainAdminAction = (payload) => {
    dispatch({ type: Actions.CHANGE_NAV_MAIN_ADMIN, payload });
  };

  const changeNavMainStudentAction = (payload) => {
    dispatch({ type: Actions.CHANGE_NAV_MAIN_STUDENT, payload });
  };

  const updateSidebarStateAction = (payload) => {
    dispatch({ type: Actions.UPDATE_SIDEBAR_STATE, payload });
  };

  const resetSidebarAction = () => {
    dispatch({ type: Actions.RESET_STATE });
  };

  return {
    ...state,
    isSidebarOpenAction,
    changeNavMainAdminAction,
    changeNavMainStudentAction,
    updateSidebarStateAction,
    resetSidebarAction,
  };
};
