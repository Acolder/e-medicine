import ajax from '@/utils/ajax';
import wx from 'weixin-js-sdk';
// 微信配置信息
let wxjsconfig = {
  debug: false,
  jsApiList: [
    'checkJsApi',
    'onMenuShareTimeline',
    'onMenuShareAppMessage',
    'onMenuShareQQ',
    'onMenuShareWeibo',
    'onMenuShareQZone',
    'hideMenuItems',
    'showMenuItems',
    'hideAllNonBaseMenuItem',
    'showAllNonBaseMenuItem',
    'translateVoice',
    'startRecord',
    'stopRecord',
    'onVoiceRecordEnd',
    'playVoice',
    'onVoicePlayEnd',
    'pauseVoice',
    'stopVoice',
    'uploadVoice',
    'downloadVoice',
    'chooseImage',
    'previewImage',
    'uploadImage',
    'downloadImage',
    'getNetworkType',
    'openLocation',
    'getLocation',
    'hideOptionMenu',
    'showOptionMenu',
    'closeWindow',
    'scanQRCode',
    'chooseWXPay',
    'openProductSpecificView',
    'addCard',
    'chooseCard',
    'openCard'
  ]
};

function init(code) {
  let url = location.href;
  let postData = {
    url: url,
    appId: 'AppId',
    appSecret: 'Secret',
  };
  if (code) {
    postData.code = code;
  }
  return ajax.post(`/api/system/getWxJsConfig`, postData).then((response) => {
    console.log(response, 'response');
    if (response.status === 200 && response.data.code === 0) {
      let data = response.data.data;
      wxjsconfig.appId = data.appid;
      wxjsconfig.timestamp = data.timestamp;
      wxjsconfig.nonceStr = data.noncestr;
      wxjsconfig.signature = data.signature.toLowerCase();
      wxjsconfig.access_token = data.access_token;
      wx.config(wxjsconfig);
      return {
        wx: wx,
        wxconfig: data
      };
    }
  });
}

function getOpenIdUrl(url) {
  let appid = process.env.APPID;
  let openUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${url}&response_type=code&scope=snsapi_base&state=drugstore#wechat_redirect`;
  console.log(openUrl, 'openurl');
  return openUrl;
}


export default {
  init,
  getOpenIdUrl,
};
