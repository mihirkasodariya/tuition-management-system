import { createSlice } from '@reduxjs/toolkit';
import {
  getMyAttendanceListAction,
  getMyEnrollmentsListAction,
  getMyHomeworkListAction,
  getMySubjectsListAction,
  isGoogleConnectedAction,
} from './action';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  myAttendanceList: null,
  mySubjectList: null,
  myEnrollmentList: null,
  myHomeworkList: null,
  integrations: {
    google: {
      isApiCalled: false,
      isGoogleConnected: false,
    },
  },
};

const dataSlice = createSlice({
  name: 'myDetailsSlice',
  initialState,
  reducers: {
    clearMyDetailsErrorsAction: (state, action) => {
      state.statusCode = null;
      state.error = null;
    },
    resetMyDetailsAction: (state, action) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyAttendanceListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyAttendanceListAction.fulfilled, (state, action) => {
        state.loading = false;
        state.myAttendanceList = action.payload;
      })
      .addCase(getMyAttendanceListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching attendance failed'; // Default error message
        state.statusCode = action?.payload?.statusCode || 500;
      })
      .addCase(getMySubjectsListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMySubjectsListAction.fulfilled, (state, action) => {
        state.loading = false;
        state.mySubjectList = action.payload;
      })
      .addCase(getMySubjectsListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching Subject List failed'; // Default error message
        state.statusCode = action?.payload?.statusCode || 500;
      })
      .addCase(getMyEnrollmentsListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyEnrollmentsListAction.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollmentList = action.payload;
      })
      .addCase(getMyEnrollmentsListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching Enrollments List failed'; // Default error message
        state.statusCode = action?.payload?.statusCode || 500;
      })
      .addCase(getMyHomeworkListAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyHomeworkListAction.fulfilled, (state, action) => {
        state.loading = false;
        state.myHomeworkList = action.payload;
      })
      .addCase(getMyHomeworkListAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching Homework List failed';
        state.statusCode = action?.payload?.statusCode || 500;
      })
      .addCase(isGoogleConnectedAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(isGoogleConnectedAction.fulfilled, (state, action) => {
        state.integrations.google = {
          isApiCalled: true,
          isGoogleConnected: action?.payload?.isGoogleConnected || false,
        };
      })
      .addCase(isGoogleConnectedAction.rejected, (state) => {
        state.integrations.google = {
          isApiCalled: true,
          isGoogleConnected: false,
        };
      });
  },
});

export const MyStudentDetailsReducer = dataSlice.reducer;
export const { clearMyDetailsErrorsAction, resetMyDetailsAction } = dataSlice.actions;
