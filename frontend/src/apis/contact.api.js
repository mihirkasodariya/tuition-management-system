import { getAccessToken } from '@/helpers/local-storage';
import Service from '@/services';

export const submitContactFormApi = async (json) => {
  const token = getAccessToken();
  const response = await Service.fetchPost('/contact/new-contact-form', json, token);
  return response;
};
