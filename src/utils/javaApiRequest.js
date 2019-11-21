import axios from 'axios';
import { Toast } from 'mint-ui';
import { getToken, removeToken, base64Encrypt, base64Decrypt, serializeData } from '@/utils/auth';


// create an axios instance
const service = axios.create({
  baseURL: process.env.MALL_BASE_HOST,
  timeout: 15000
});

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  let token = getToken();
  if (token) {
    config.headers['usertoken'] = token;
  }
  if (config.method.toLowerCase() === 'post') {
    if (config.data) {
      let dataStr = JSON.stringify(config.data);
      let base64Str = base64Encrypt(dataStr);
      config.data = serializeData({ param: base64Str });
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
  response => {
    if (response.data) {
      try {
        let str = base64Decrypt(response.data);
        let res_data = JSON.parse(str);
        response.data = res_data;
        if (parseInt(response.data.resultCode, 10) === -1) {
          Toast('网络超时，请稍后重试');
        } else if (parseInt(response.data.resultCode, 10) === -3) {
          Toast(response.data.msg);
        } else if (parseInt(response.data.resultCode, 10) === -2) {
          removeToken();
          // removeAccesstoken();
        }
      } catch (e) {
        console.error('出错了，' + e + ',接口返回数据:' + response.data);
      }
    }
    return response;
  },
  error => {
    console.log('error:' + error);
  }
);

export default service;
