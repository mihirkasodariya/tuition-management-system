import { getAccessToken } from '@/helpers/local-storage';
import Service from '@/services';
import axios from 'axios';

export const submitBuilderTextPromptApi = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost('/ai/builder/text', json, token);
  return response;
};

export const getSessionDetailsApi = async (sessionId) => {
  const token = getAccessToken();
  const response = await Service.fetchGet(`/ai/session-details/${sessionId}`, token);
  return response;
};

export const createChatSessionApi = async (json) => {
  const response = await Service.fetchPost('/ai/chat-agent/new-session', json);
  return response;
};

export const submitMessageChatApi = async (sessionId, json) => {
  try {
    const token = getAccessToken();
    const url = `http://localhost:8002/api/v1/agent/${sessionId}/chat-agent`;
    const { data } = await axios.post(url, json, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    return (
      error.response?.data || {
        success: false,
        message: 'Failed to submit message',
      }
    );
  }
};

export const submitPublicAiAgentApi = async (sessionId, json) => {
  const response = await Service.fetchPost(`/ai/${sessionId}/public-chat-agent`, json);
  return response[1];
};
