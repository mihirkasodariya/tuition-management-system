import { AxiosConfig, RequestMethodInstance } from './axiosInstance';
import { API_URL } from './config';
import axios from 'axios';

const handleHeaders = (token, contentType) => {
  const axiosConfig = new AxiosConfig();
  if (!contentType) {
    axiosConfig.removeContentType();
  } else if (contentType === 'formData') {
    axiosConfig.addFormHeaderContentType();
  }
  if (token) {
    axiosConfig.addAuthorization(token);
  }
  return axiosConfig.getConfig();
};

const processResponse = async (response) => {
  if (response?.message === 'Network Error') {
    return [false, { message: response.message, statusCode: 500 }, 500];
  }

  if (response.status === 200) {
    return [true, response.data, response.status];
  } else if (response.status === 401) {
    onUserKickedOut();
    return [false, response.data, response.status];
  } else {
    return [response.status, response.data, response.status];
  }
};

const apiFetch = new RequestMethodInstance();
const Service = {
  fetchGet: async (url, token = null, contentType = null) => {
    try {
      const endpoint = API_URL + url;
      const headers = handleHeaders(token, contentType);
      const response = await apiFetch.getMethod(endpoint, headers);
      return processResponse(response);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log(`Request to ${url} was cancelled`);
        // Return a specific value or throw a custom error to indicate cancellation
        return [false, { message: 'api is aborted' }];
      }
      onFailure('network', url);
      return processResponse(error?.response || error);
    }
  },

  fetchPost: async (url, body, token = null, contentType = 'json') => {
    try {
      const endpoint = API_URL + url;
      const headers = handleHeaders(token, contentType);
      const response = await apiFetch.postMethod(endpoint, body, headers);
      return processResponse(response);
    } catch (error) {
      onFailure('network', url);
      return processResponse(error?.response || error);
    }
  },

  fetchPut: async (url, body = null, token = null, contentType = 'json') => {
    try {
      const endpoint = API_URL + url;
      const headers = handleHeaders(token, contentType);
      const response = await apiFetch.putMethod(endpoint, body, headers);
      return processResponse(response);
    } catch (error) {
      onFailure('network', url);
      return processResponse(error?.response || error);
    }
  },

  fetchPatch: async (url, body = null, token = null, contentType = 'json') => {
    try {
      const endpoint = API_URL + url;
      const headers = handleHeaders(token, contentType);
      const response = await apiFetch.patchMethod(endpoint, body, headers);
      return processResponse(response);
    } catch (error) {
      onFailure('network', url);
      return processResponse(error?.response || error);
    }
  },

  fetchDelete: async (url, token = null, body = {}, contentType = 'json') => {
    try {
      const endpoint = API_URL + url;
      const headers = handleHeaders(token, contentType);
      const response = await apiFetch.deleteMethod(endpoint, body, headers);
      return processResponse(response);
    } catch (error) {
      onFailure('network', url);
      return processResponse(error?.response || error);
    }
  },

  cancelAllRequests: () => {
    apiFetch.cancelAllRequests();
  },

  // Cancel a specific API request if needed
  cancelRequest: (url, method) => {
    const endpoint = API_URL + url;
    apiFetch.cancelRequest(endpoint, method);
  },
};

const onFailure = async (res, url) => {
  console.log('API FAILED ' + url);
};

const onUserKickedOut = async () => {
  localStorage.clear();
  window.location.reload();
};

export default Service;
