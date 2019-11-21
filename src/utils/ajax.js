import axios from 'axios';
import { Toast } from 'mint-ui';

import {
  getToken,
  removeToken,
  aesEncrypt,
  getNoncestr,
  getTimestamp,
  getSign,
  setAccesstoken,
  getAccesstoken,
  removeAccesstoken,
} from '@/utils/auth';

const appid = '8145955969';
const appSecret = 'l8y70yhm8vonwc904i6ugjs3s1zfqo77';

function getAccessToken() {
  let accessToken = '';
  accessToken = getAccesstoken();
  if (accessToken) {
    return accessToken;
  }
  let requestObj;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    requestObj = new XMLHttpRequest();
  } else { // code for IE6, IE5
    /* eslint-disable */
    requestObj = new ActiveXObject('Microsoft.XMLHTTP');
  }
  let url = `${process.env.BASE_HOST}/api/system/Token?appid=${aesEncrypt(appid)}&appSecret=${aesEncrypt(appSecret)}`;
  requestObj.open('get', url, false);
  requestObj.send('');
  let obj = requestObj.response;
  if (typeof obj !== 'object') {
    obj = JSON.parse(obj);
  }
  if (obj.code === 0) {
    accessToken = obj.data.accesstoken;
  }
  if (accessToken) {
    setAccesstoken(accessToken);
  }
  return accessToken;
}


// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_HOST,
  timeout: 5000
});


// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  let token = getToken();
  let accessToken = getAccessToken();
  let timestamp = getTimestamp();
  let noncestr = getNoncestr();
  let sign = getSign(accessToken, appid, appSecret, noncestr, timestamp);
  if (token) {
    config.headers['usertoken'] = token;
  }
  if (accessToken) {
    config.headers['accesstoken'] = accessToken;
  }
  if (timestamp) {
    config.headers['timestamp'] = timestamp;
  }
  if (noncestr) {
    config.headers['noncestr'] = noncestr;
  }
  if (sign) {
    config.headers['sign'] = sign;
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
    if (response.data && response.data.code === -3) {
      removeToken();
      removeAccesstoken();
    } else if (response.data.code === -1){
      let errorMsg = response.data.message;
      errorMsg = !!errorMsg ? errorMsg : '网络异常，请稍后再试。';
      if (errorMsg !== '操作成功') {
        Toast(errorMsg);
      }
    } else if (response.data.code === -2) {
      removeToken();
    }
    return response
  },
  error => {
    console.log('error' + error);
  }
);

export default service;
