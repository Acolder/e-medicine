/**
 * Created by lven on 2018/5/23.
 */
export default {
  // 1.page自适应屏幕
  selfAdaptionScreen: function (height, clientHeight) {
    // 设置滚动窗高度。
    let footer = document.getElementsByTagName('footer')[0];
    let page = document.getElementById('inquiry-page');
    let top = document.getElementById('top');
    let pageHeight;
    if (clientHeight > 0) {
      pageHeight = clientHeight;
    } else {
      pageHeight = document.body.clientHeight;
    }
    if (footer) {
      pageHeight = document.body.clientHeight - footer.clientHeight;
    }
    if (top) {
      pageHeight = pageHeight - top.clientHeight;
    }
    if (height && height > 0) {
      pageHeight = pageHeight - height;
    }
    // if (isIPhoneX()) {
    //   pageHeight = pageHeight - 10;
    // }
    page.style.height = pageHeight + 'px';
  },
  // ios弹起小键盘,适应屏幕,根据不同的设备,设置屏幕的大小
  // 根据屏幕,判断ios型号
  getIOSHeightHasKeyboard: function (headHeight) {
    let clientHeight = document.documentElement.clientHeight;
    let userheight = 200;
    let iPhoneXHeight = 754;
    let iPhoneXPHeight = 837;
    let iPhone8PlusHeigh = 736;
    let iPhone8Heigh = 666;
    let iPhoneSEHeigh = 568;
    // iPhone 6/7/8
    if (clientHeight === iPhone8Heigh - headHeight) {
      userheight = clientHeight - 258 - 120;
    }
    // iPhone 6/7/8 plus
    else if (clientHeight === iPhone8PlusHeigh - headHeight) {
      userheight = clientHeight - 271 - 85;
    }
    // iPhone X
    else if (clientHeight === iPhoneXHeight - headHeight) {
      userheight = clientHeight - 382;
    }
    // iPhone XP
    else if (clientHeight === iPhoneXPHeight - headHeight) {
      userheight = clientHeight - 382 - 50;
    }
    // iPhone SE
    else if (clientHeight === iPhoneSEHeigh - headHeight) {
      userheight = clientHeight - 342;
    }
    return userheight - 32;
    // let innerHeight = window.innerHeight;
    // return innerHeight;
  },
  isIOS: function () {
    let u = navigator.userAgent;
    // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    return isiOS;
  },
  isPC: function () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // 移动端
      return false;
    }
    else {
      // PC端
      return true;
    }
  }
};

// 是否iPhone X
// function isIPhoneX() {
//   return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375);
// }