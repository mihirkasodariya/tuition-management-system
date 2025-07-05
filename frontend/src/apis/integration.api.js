import { getAccessToken } from '@/helpers/local-storage';
import { BASE_URL } from '@/services/config';
import axios from 'axios';

export const connectToGoogleApi = async () => {
  try {
    const token = getAccessToken();
    let url = `${BASE_URL}/auth/google`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let { authUrl } = response?.data;
    window.open(authUrl, '_blank', 'noopener,noreferrer');
  } catch (error) {
    console.log('error', error.response.data);
  }
};
