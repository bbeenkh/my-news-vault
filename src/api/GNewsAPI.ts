import { DEFAULT_API_TIMEOUT } from '@/constants';
import axios from 'axios';
import initInterceptors from './interceptors';

const GNewsAPI = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GNEWS_API_BASEURL,
  timeout: DEFAULT_API_TIMEOUT,
  params: {
    apikey: process.env.NEXT_PUBLIC_GNEWS_API_KEY,
    lang: 'ko',
    country: 'kr',
  },
});

export default initInterceptors(GNewsAPI);
