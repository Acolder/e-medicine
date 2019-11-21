/**
 * 获取URL请求参数
 * @param {string} name
 */
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let url = window.location.href;
  let r = url.substr(url.indexOf('?') + 1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}
/**
 * 获取URL参数2
 */
export function getRequestObj() {
  let url = location.href; // 获取url中"?"符后的字串 #/inquiry/inquiryPeopleMes?name=%E6%90%9C%E7%B4%A2%E6%95%B0&gender=0&age=11&description=%E6%84%9F%E5%86%92&mobile=15573803300&memberid=5b07a65484d0174579fd74b0&consulttype=1
  let index = url.indexOf('?');
  /* eslint-disable */
  let theRequest = new Object();
  if (url.indexOf('?') !== -1) {
    let str = url.substr(index + 1);
    let strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

/**
 * json 对象转url参数字符串
 * @param {json obj} data
 */
export function getParamsString(data) {
  let str = '';
  if (data) {
    for (let key in data) {
      str += `${key}=${data[key]}&`;
    }
    if(str) {
      str = `?${str.substring(0, str.length - 1)}`;
    }
    return str;
  }
}


/**
 * 去掉所有的html标记
 * @param {*} str
 */
export function delHtmlTag(str) {
  return str.replace(/<[^>]+>/g, '');
}
/**
 * 获取手机型号
 */
export function facilityModel() {
  let model = '';
  let u = navigator.userAgent, app = navigator.appVersion;
  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
  let isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    model = 'android';
  }
  if (isIos) {
    model = 'ios';
  }
  return model;
}
