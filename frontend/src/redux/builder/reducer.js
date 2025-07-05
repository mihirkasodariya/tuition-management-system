import { createSlice } from '@reduxjs/toolkit';
import { fetchTemplateNoteIdAction, fetchNotesAction } from './action';
import _ from 'lodash';

const initialState = {
  loading: false,
  error: null,
  statusCode: null,
  screenSize: 'desktop',
  dragLayout: null,
  templateSections: null,
  singleTemplateData: null,
  activeSection: null,
  builderEditMode: true,
  notesList: null,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    },
    setDragLayout: (state, action) => {
      state.dragLayout = action.payload;
    },
    setTemplateData: (state, action) => {
      state.templateSections = action.payload;
    },
    setActiveSection: (state, action) => {
      state.activeSection = action.payload;
    },
    setBuilderEditMode: (state, action) => {
      state.builderEditMode = action.payload;
    },
    updateBuilderState: (state, action) => {
      _.assign(state, action.payload);
    },
    clearBuilderErrors: (state, action) => {
      state.statusCode = null;
      state.error = null;
    },
    resetBuilder: (state, action) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplateNoteIdAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTemplateNoteIdAction.fulfilled, (state, action) => {
        state.loading = false;
        state.singleTemplateData = action.payload || null;
        state.templateSections = action.payload?.templateSections || null;
      })
      .addCase(fetchTemplateNoteIdAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching note details failed'; // Default error message
        state.statusCode = action?.payload?.statusCode || 500;
      })
      .addCase(fetchNotesAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.notesList = action.payload || null;
      })
      .addCase(fetchNotesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || 'Fetching notes list failed'; // Default error message
        state.statusCode = action?.payload?.statusCode || 500;
      });
  },
});

export const {
  setScreenSize,
  setDragLayout,
  setTemplateData,
  setActiveSection,
  updateBuilderState,
  setBuilderEditMode,
  clearBuilderErrors,
  resetBuilder,
} = builderSlice.actions;
export const builderReducerToolkit = builderSlice.reducer;
