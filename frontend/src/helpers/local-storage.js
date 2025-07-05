const ACCESS_TOKEN_KEY = 'usertoken_tuition';

export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  return true;
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  return true;
};

export const clearAll = () => {
  localStorage.clear();
  return true;
};
