import axios from 'axios';
import { serializeData } from '@/utils/auth';
const service = axios.create({
  baseURL: process.env.YILIN_BASE_HOST,
  timeout: 5000
});

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      let jsonStr = JSON.stringify(config.data);
      config.data = serializeData({ jsonString: jsonStr });
    }
  }
  return config;
}, error => {
  // Do something with request error
  console.log(error);
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('error' + error);
  }
);

export default service;
