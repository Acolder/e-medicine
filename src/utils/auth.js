import Cookies from 'js-cookie';
const aesSecret = 'bndehs6pbr8ia8is';
const userToken = 'User-Token';
// const shareUrl = 'Share-Url';
const userID = 'User-Id';
const userSource = 'User-Source';
const userInfo = 'User-Info';
const consultInfo = 'Consult-Info';
const accessToken = 'Access-Token';
const OrderSource = 'Order-Source';
const rongcloudtoken = 'rongcloudtoken';
const CryptoJS = require('crypto-js');
export function getToken() {
  return Cookies.get(userToken);
}
export function setToken(token) {
  let date = new Date();
  date.setHours(date.getHours() + 24);
  return Cookies.set(userToken, token, { expires: date });
}
// export function getShare() {
//   return Cookies.get(shareUrl);
// }
// export function setShare(url) {
//   let date = new Date();
//   date.setHours(date.getHours() + 24);
//   return Cookies.set(shareUrl, url, { expires: date });
// }
export function removeToken() {
  return Cookies.remove(userToken);
}
export function getuserID() {
  return Cookies.get(userID);
}
export function setuserID(id) {
  return Cookies.set(userID, id);
}
export function removeuserID() {
  return Cookies.remove(userID);
}
export function getuserSource() {
  return Cookies.get(userSource);
}
export function setuserSource(source) {
  return Cookies.set(userSource, source);
}
export function removeuserSource() {
  return Cookies.remove(userSource);
}
export function getAccesstoken() {
  return Cookies.get(OrderSource);
}
export function getOrderSource() {
  return Cookies.get(accessToken);
}
export function setAccesstoken(token) {
  let date = new Date();
  date.setMinutes(date.getMinutes() + 1);
  return Cookies.set(accessToken, token, { expires: date, path: '/' });
}
export function removeAccesstoken() {
  return Cookies.remove(accessToken);
}
export function setUserInfo(userJsonString) {
  return Cookies.set(userInfo, userJsonString);
}
export function setConsultInfo(consultInfoJsonString) {
  return Cookies.set(consultInfo, consultInfoJsonString);
}
export function setOrderSource(JSONString) {
  return Cookies.set(OrderSource, JSONString);
}
export function getUserInfo() {
  let str = Cookies.get(userInfo);
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}
export function getConsultInfo() {
  let str = Cookies.get(consultInfo);
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}
export function removeUserInfo() {
  return Cookies.remove(userInfo);
}
export function removeConsultInfo() {
  return Cookies.remove(consultInfo);
}
export function removeOrderSource() {
  return Cookies.remove(OrderSource);
}
export function setRongcloudtoken(rongtoken) {
  return Cookies.set(rongcloudtoken, rongtoken);
}
export function getRongcloudtoken() {
  return Cookies.get(rongcloudtoken);
}
/**
 * aes加密
 * @param {string} content
 */
export function aesEncrypt(content) {
  let aesSecret2 = CryptoJS.enc.Utf8.parse(aesSecret);
  let encryptResult = CryptoJS.AES.encrypt(content, aesSecret2, {
    // iv: key,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  let value = encryptResult.toString();
  return value;
}
/**
 * aes解密
 * @param {string} content
 */
export function aesDecrypt(content) {
  let bytes = CryptoJS.AES.decrypt(content, aesSecret, {
    // iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  let decryptResult = bytes.toString(CryptoJS.enc.Utf8);
  let value = decryptResult.toString();
  return value;
}
/**
 * base64 encrypt
 * @param {string} content
 */
export function base64Encrypt(content) {
  let wordArray = CryptoJS.enc.Utf8.parse(content);
  let base64 = CryptoJS.enc.Base64.stringify(wordArray);
  return base64;
}
/**
 * base64 decrypt
 * @param {string} content
 */
export function base64Decrypt(content) {
  let parsedWordArray = CryptoJS.enc.Base64.parse(content);
  let parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
  return parsedStr;
}
/**
 * 获取随机数
 */
export function getNoncestr() {
  let data = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  let result = '';
  for (let i = 0; i < 15; i++) {
    let r = Math.floor(Math.random() * 62); // 取得0-62间的随机数，目的是以此当下标取数组data里的值！
    result += data[r]; // 输出15次随机数的同时，让rrr加15次，就是15位的随机字符串了。
  }
  let now = new Date();
  let day = `${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
  return day + result;
}
/**
 * 获取时间戳
 */
export function getTimestamp() {
  let timestamp = Date.parse(new Date());
  return timestamp;
}
/**
 * 获取签名
 * @param {string} accesstoken
 * @param {string} appid
 * @param {strin} appsecret
 * @param {string} noncestr
 * @param {*} timestamp
 */
export function getSign(accesstoken, appid, appsecret, noncestr, timestamp) {
  let appkey = 'b37443f8f19f123ebbd01b07615af4cdfdc9a89b1a839f413323703f40e8847d';
  let str = `accesstoken=${accesstoken}&appid=${appid}&appsecret=${appsecret}&noncestr=${noncestr}&timestamp=${timestamp}&appkey=${appkey}`;
  let cryptoObj = CryptoJS.enc.Utf8.parse(str);
  let sign = CryptoJS.MD5(cryptoObj).toString(CryptoJS.enc.Hex).toUpperCase();
  return sign;
}
// 获取加密签名MD5(userkey+secret+timestamp)
export function GetSin(userkey, timestamp, secret) {
  let str = `${userkey}${secret}${timestamp}`;
  let cryptoObj = CryptoJS.enc.Utf8.parse(str);
  let sign = CryptoJS.MD5(cryptoObj).toString(CryptoJS.enc.Hex);
  return sign;
}
/**
 * 将json对象 转换成 key：value
 * @param {object} data
 */
export function serializeData(data) {
  if (typeof data !== 'object') {
    return ('');
  }
  let buffer = [];
  // Serialize each key in the object.
  for (let name in data) {
    if (!data.hasOwnProperty(name)) {
      continue;
    }
    let value = data[name];
    value = value ? value : '';
    buffer.push(
      `${encodeURIComponent(name)}=${encodeURIComponent(value)}`
    );
  }
  // Serialize the buffer and clean it up for transportation.
  let source = buffer.join('&').replace(/%20/g, '+');
  return (source);
}
