const CHAT_SESSION_KEY = 'chat_session_tuition';

export const getChatSessionId = () => {
  return sessionStorage.getItem(CHAT_SESSION_KEY);
};

export const setChatSessionId = (sessionId) => {
  sessionStorage.setItem(CHAT_SESSION_KEY, sessionId);
  return true;
};

export const removeChatSessionId = () => {
  sessionStorage.removeItem(CHAT_SESSION_KEY);
  return true;
};

export const clearAllChatSessions = () => {
  sessionStorage.clear();
  return true;
};
