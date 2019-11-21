import ajax from '@/utils/ajax';
import { getToken, setToken, setConsultInfo } from '@/utils/auth';
import { getParamsString } from '@/utils/index';
import router from '@/router';
let userToken = getToken();

export function login(username, password) {
  // sessionStorage.clear();
  return ajax.post('api/v2/user/login',
    { Mobile: username, Password: password });
}

export function weixinLogin(openId) {
  return ajax.post('/api/user/externalLogin', {
    LoginType: 'weixin',
    OpenId: openId,
  }).then(res => {
    if (res.status === 200) {
      if (res.data.code === 0) {
        let data = res.data.data;
        if (data && data.usertoken) {
          setToken(data.usertoken);
        }
      }
      return res.data;
    }
  });
}

export function logout() {
  return ajax({
    url: '',
    method: 'get'
  });
}
export function getUserByToken(usertoken) {
  return ajax.get('/api/user/info', {
    params: {
      'usertoken': usertoken
    }
  });
}
export function getUserInfo() {
  return ajax.get('/api/user/info', {
    params: {
      usertoken: userToken
    }
  });
}
// 去往登录页
export function goLogin() {
  let returnUrl = location.href;
  sessionStorage.setItem('returnUrl', returnUrl);
  if (/MicroMessenger/.test(window.navigator.userAgent)) {
    // 微信中打开则直接微信登录
    router.replace({ path: '/weixin/entry' });
  } else {
    router.replace({ path: '/login' });
  }
  // window.location.href = `/login`;
}


/**
 * 登录后调转
 * @param {object} data
 * @param {string} returnUrl
 */
export function redirectAfterLogin(data, returnUrl) {
  let query = {
    // 药葫芦下单10056 电商平台下单10058
    source: '10056',
    userid: data.userid,
    userToken: data.usertoken,
    consultSource: '1',
    // 问诊来源：1药葫芦 2问诊室 3药柜 4药箱 5电商
    rongyunToken: encodeURIComponent(data.rongcloudtoken)
  };
  if (returnUrl) {
    // 跳首页(这里拦截特殊的URL)
    if (returnUrl.indexOf('/login') > -1 || returnUrl.indexOf('/weixin/transfer') > -1 || returnUrl.indexOf('/registe') > -1 || returnUrl.indexOf('/findPassword') > -1 || returnUrl.indexOf('/weixin/hub') > -1) {
      router.replace({
        path: '/',
        query: query
      });
    }
    if (returnUrl.indexOf('http') >= 0) {
      let paramsStr = getParamsString(query);
      location.replace(returnUrl + paramsStr);
    } else {
      router.replace({
        path: returnUrl,
        query: query
      });
    }
  } else {
    router.replace({
      path: '/',
      query: query
    });
  }
}

// 在线问医
export function intoInquiry(type) {
  // 问诊入口为 checkInquiry, type === 2
  // 判断是否登录
  let userToken = getToken();
  if (!userToken) {
    if (type === 2) {
      // goLogin();
      router.replace({ path: '/login' });
      // window.location.replace(`/login`);
    } else {
      router.replace({ path: '/login' });
      // window.location.href = `/login`;
    }
  }
  let consultType;
  if (type === 0) {
    consultType = 0; // 0是中医？
  } else {
    consultType = 1; // 1.是在线医生？
  }
  // 把就诊人存入缓存中.
  setConsultInfo(JSON.stringify({ 'consultType': consultType }));
  let url = 'api/v2/user/isExistsMember';
  ajax.get(url).then((res) => {
    if (res.status === 200 && res.data.code === 0) {
      // 1.没有咨询中，候诊中的订单，且没有就诊人,即(第一次进入)
      if (!res.data.data.isexistsmember) {
        // 第一次进入页面
        if (type === 2) {
          window.location.replace(`/inquiry/guideDefault?consultType=${consultType}`);
        } else {
          window.location.href = `/inquiry/guideDefault?consultType=${consultType}`;
        }
      } else {
        if (res.data.data.memberinfo && JSON.stringify(res.data.data.memberinfo) !== '{}') {
          let recentMemberInfo = JSON.stringify(res.data.data.memberinfo);
          sessionStorage.setItem('recentMemberInfo', recentMemberInfo);
        }
        if (type === 2) {
          window.location.replace(`/inquiry/intoSecond?consultType=${consultType}`);
        } else {
          window.location.href = `/inquiry/intoSecond?consultType=${consultType}`;
        }
      }
    } else if (res.data.code === -2) {
      // window.location.href = '/login';
      router.replace({ path: '/login' });
    }
  });
}
