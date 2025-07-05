import { getAccessToken } from '@/helpers/local-storage';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const navigate = useNavigate();
  const isToken = getAccessToken();

  const checkUserAuthState = useCallback(() => {
    if (!isToken) {
      return navigate('/');
      // return false;
    }
    return isToken;
  }, []);
  return checkUserAuthState;
};

export default useAuth;
