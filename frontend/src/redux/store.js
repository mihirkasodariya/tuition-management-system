import { configureStore } from '@reduxjs/toolkit';
import { LoginReducer } from './login/reducer';
import { UserProfileReducer } from './userProfile/reducer';
import { BatchReducer } from './batch/reducer';
import { BoardReducer } from './boards/reducer';
import { SubjectReducer } from './subjects/reducer';
import { StudentReducer } from './students/reducer';
import { GraphReducer } from './graphs/reducer';
import { ContactFormReducer } from './contact/reducer';
import { MyStudentDetailsReducer } from './myDetails/reducer';
import { builderReducerToolkit } from './builder/reducer';

const initialState = {};

const reducer = {
  loginState: LoginReducer,
  userProfileState: UserProfileReducer,
  batchState: BatchReducer,
  boardState: BoardReducer,
  subjectState: SubjectReducer,
  studentState: StudentReducer,
  graphState: GraphReducer,
  contactFormState: ContactFormReducer,
  myDetailsState: MyStudentDetailsReducer,
  builderToolkitState: builderReducerToolkit,
};
const store = configureStore({
  reducer,
  preloadedState: initialState,
  //   middleware,
  devTools: true,
  //   import.meta.env.VITE_DEVELOPMENT_MODE === "production" ? false : true,
});

export default store;
