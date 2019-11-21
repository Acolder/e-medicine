
import axios from 'axios';
import CryptoJS from 'crypto-js';

const accessid = 'LTAIUD8km3L4sA6C';
const accesskey = 'K4q6eJWWghFcIrQzMKhT89jenMqDrr';
const host = 'https://kmyhl.oss-cn-shenzhen.aliyuncs.com';
// oss 上传目录
const g_dirname = 'e-medicine';


/**
 * web端直接获取policy信息 todo:改成服务器获取
 */
function getWebPolicy() {
  return new Promise(function(resolve) {
    let policyText = {
      'expiration': '2050-01-01T12:00:00.000Z', // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      'conditions': [
        ['content-length-range', 0, 20 * 1024 * 1024] // 设置上传文件的大小限制 1000*1024*1024=1048576000=1GB
      ]
    };
    let wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(policyText));
    let policyBase64 = CryptoJS.enc.Base64.stringify(wordArray);
    let bytes = CryptoJS.HmacSHA1(policyBase64, accesskey, { asBytes: true });
    let signature = CryptoJS.enc.Base64.stringify(bytes);
    resolve({
      policyBase64,
      signature,
    });
  });
}

/**
 * 获取随机字符串
 * @param {长度} len
 */
function random_string(len) {
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

function webPostObject(file, fileName) {
  return getWebPolicy().then(result => {
    let ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    let key = `${g_dirname}/${random_string(10)}${ext}`;
    let form_data = new FormData();
    form_data.append('name', fileName);
    form_data.append('key', key);
    form_data.append('policy', result.policyBase64);
    form_data.append('OSSAccessKeyId', accessid);
    form_data.append('success_action_status', '200');
    form_data.append('signature', result.signature);
    form_data.append('file', file, fileName);
    return axios.post(
      `${host}`,
      form_data,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then((res) => {
      if (res.status === 200) {
        let imgUrl = `${host}/${key}`;
        return { url: imgUrl };
      }
    });
  });
}
export {
  webPostObject
};
