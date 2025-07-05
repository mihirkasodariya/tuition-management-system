import LoginActions from './login/action';
import UserActions from './userProfile/action';
import BatchActions from './batch/action';
import BoardActions from './boards/action';
import SubjectActions from './subjects/action';
import StudentActions from './students/action';
import GraphsActions from './graphs/action';
import ContactFormActions from './contact/action';
import MyDetailsActions from './myDetails/action';
import { clearMyDetailsErrorsAction, resetMyDetailsAction } from './myDetails/reducer';
import BuilderActions from './builder/action';

export const loginActions = { ...LoginActions };
export const userActions = { ...UserActions };
export const batchActions = { ...BatchActions };
export const boardActions = { ...BoardActions };
export const subjectActions = { ...SubjectActions };
export const studentActions = { ...StudentActions };
export const graphActions = { ...GraphsActions };
export const contactActions = { ...ContactFormActions };
export const myDetailsActions = {
  ...MyDetailsActions,
  clearMyDetailsErrorsAction,
  resetMyDetailsAction,
};
export const builderActions = { ...BuilderActions };

// after adding reset the action in to the logout hook
