import { GET_NOTE_DETAILS, GET_NOTES_LIST } from './constant';
import Service from '@/services';
import * as API from './actionTypes';
import {
  setScreenSize,
  setDragLayout,
  setTemplateData,
  setActiveSection,
  setBuilderEditMode,
  clearBuilderErrors,
  resetBuilder,
  updateBuilderState,
} from './reducer';
import _ from 'lodash';
import templatesData from '@/data/templates.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAccessToken } from '@/helpers/local-storage';
import { objectToQueryString } from '@/helpers';

const setScreenSizeAction = (screenSize) => (dispatch) => {
  dispatch(setScreenSize(screenSize));
};

const setDragLayoutAction = (layout) => (dispatch) => {
  dispatch(setDragLayout(layout || null));
};

const setTemplateDataAction = (template) => (dispatch) => {
  dispatch(setTemplateData(template || []));
};

const setActiveSectionAction = (section) => (dispatch) => {
  dispatch(setActiveSection(section));
};

const setBuilderEditModeAction = (mode) => (dispatch) => {
  dispatch(setBuilderEditMode(mode ?? true));
};

export const fetchTemplateNoteIdAction = createAsyncThunk(
  GET_NOTE_DETAILS,
  async (noteId, { rejectWithValue }) => {
    let response = await Service.fetchGet(`${API.BASE_NOTES}/${noteId}`);
    if (response[0] === true) {
      return response[1]?.data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

export const fetchNotesAction = createAsyncThunk(
  GET_NOTES_LIST,
  async (queryObject = null, { rejectWithValue }) => {
    let query = queryObject ? objectToQueryString(queryObject) : '';
    let response = await Service.fetchGet(
      `${API.BASE_NOTES}${API.NOTES_ACTION_TYPES.NOTES_LIST}${query}`
    );
    if (response[0] === true) {
      return response[1]?.data;
    } else {
      return rejectWithValue(response[1]);
    }
  }
);

const createNewNotesAction = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost(
    `${API.BASE_NOTES}${API.NOTES_ACTION_TYPES.CREATE_NEW_NOTES}`,
    json,
    token
  );

  return response;
};

const updateNoteIdAction = async (noteId, json) => {
  const token = getAccessToken();
  let response = await Service.fetchPut(`${API.BASE_NOTES}/${noteId}`, json, token);
  return response;
};

const updateBuilderStateAction = (state) => (dispatch) => {
  dispatch(updateBuilderState(state));
};

const clearBuilderErrorsAction = () => (dispatch) => {
  dispatch(clearBuilderErrors());
};

const resetBuilderAction = () => (dispatch) => {
  dispatch(resetBuilder());
};

export default {
  setScreenSizeAction,
  setDragLayoutAction,
  setTemplateDataAction,
  setActiveSectionAction,
  setBuilderEditModeAction,
  fetchTemplateNoteIdAction,
  createNewNotesAction,
  fetchNotesAction,
  updateNoteIdAction,
  updateBuilderStateAction,
  clearBuilderErrorsAction,
  resetBuilderAction,
};
