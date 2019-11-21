import NativeShare from 'nativeshare';
import ajax from '@/utils/ajax.js';
/** ***************分享*******************/
/** ***************分享*******************/
/** ***************分享*******************/
// 分享操作
// 微信配置
export function SHARE(shareUrl, iconUrl, shareTitle, _self) {
  let ICONURL = iconUrl || 'https://kmyhl.oss-cn-shenzhen.aliyuncs.com/e-medicine/home_btn_zxzy.png';
  let wxConfig = {};
  let obj = {};
  let SHRAEURL = '';
  if (shareUrl.indexOf('/inquiry/doing') > -1) {
    SHRAEURL = shareUrl.replace('/inquiry/doing', '/checkInquiry');
  } else if (shareUrl.indexOf('/inquiry/intoSecond') > -1) {
    SHRAEURL = shareUrl.replace('/inquiry/intoSecond', '/checkInquiry');
  } else if (shareUrl.indexOf('/inquiry/guideDefault') > -1) {
    SHRAEURL = shareUrl.replace('/inquiry/guideDefault', '/checkInquiry');
  } else if (shareUrl.indexOf('/prescription/prescription_detail') > -1) {
    SHRAEURL = shareUrl.replace('/prescription/prescription_detail', '/prescription/prescription_order');
  } else {
    SHRAEURL = shareUrl;
  }
  let nativeShare = new NativeShare();
  let postData = {
    url: shareUrl,
    appId: 'AppId',
    appSecret: 'Secret',
  };
  // 判断是否微信内分享(微信内分享)
  if (/MicroMessenger/.test(window.navigator.userAgent)) {
    // 获取微信分享所需的必要参数
    ajax.post(`/api/system/getWxJsConfig`, postData).then((response) => {
      if (response.status === 200 && response.data.code === 0) {
        let data = response.data.data;
        obj.appId = data.appid; // 微信的appid
        obj.timestamp = data.timestamp; // 时间戳
        obj.nonceStr = data.noncestr; // 生成签名的随机串
        obj.signature = data.signature.toLowerCase(); // 签名
        obj.access_token = data.access_token; // 调用微信接口的唯一凭证
        wxConfig.wechatConfig = obj;
        // 让你修改的分享的文案同步到标签里，比如title文案会同步到<title>标签中
        // 这样可以让一些不支持分享的浏览器也能修改部分文案，默认都不会同步
        wxConfig.syncDescToTag = true;
        wxConfig.syncIconToTag = true;
        wxConfig.syncTitleToTag = true;
        // let Share = new NativeShare(wxConfig);
        // 微信分享的配置
        nativeShare.setConfig(wxConfig);
        // 设置分享文案
        nativeShare.setShareData({
          icon: ICONURL, // 分享的icon
          link: SHRAEURL, // 该链接必须在JS接口安全域名内
          title: shareTitle || '康美e抓药', // 分享标题
          desc: '在线抓品质中药', // 描述
          from: '',
          success() {
            console.log('接口调用成功');
          },
          fail() {
            console.log('接口调用失败');
          },
          trigger() {
            console.log('点击了分享按钮');
          }
        });
        console.log('微信中待分享的数据配置完成');
        console.log(nativeShare.getConfig());
        console.log(nativeShare.getShareData());
      }
    });
  } else {
  // 设置分享文案(普通浏览器)
    nativeShare.setShareData({
      icon: ICONURL,
      link: SHRAEURL,
      title: shareTitle || '康美e抓药',
      desc: '在线抓品质中药',
      // from: '',
      success: function() {
        console.log('接口调用成功');
      },
      fail: function() {
        console.log('接口调用失败');
      }
    });
    console.log('普通的浏览器中待分享的数据配置完成');
    console.log(nativeShare.getShareData());
    // 唤起浏览器原生分享组件(如果在微信中不会唤起，此时call方法只会设置文案。类似setShareData)
    // try {
    //   nativeShare.call();
    //   // 如果是分享到微信则需要 nativeShare.call('wechatFriend')
    // } catch (err) {
    // // 浏览器不支持，降级处理
    //   console.log('不支持分享');
    // // 如果不支持，你可以在这里做降级处理
    // }
  }
}
