import Data from '@/components/chat/js/config';
import '@/components/chat/js/init';
import * as imModule from '@/components/chat/js/im';
import router from '@/router';
import { removeToken } from '@/utils/auth';
import { Toast } from 'mint-ui';

// 链接融云
export function connectRongIM(talkToken, callback) {
  let instance = null;
  let callbacks = {
    getInstance: function (inst) {
      instance = inst;
      callback && callback(instance);
    },
    getCurrentUser: function (userInfo) {
      // console.log(userInfo.userId);
    },
  };
  let params = {
    appKey: Data.appKey,
    token: talkToken,
  };
  /* eslint-disable */
  QuickInit.init(params, callbacks);
}
// 监听消息
export function messageListener (callback) {
  imModule.messageListener (res => {
    if (res) {
      if (res.messageType === 'UnknownMessage' && res.objectName === 'app:latlong') {
        let locationId = 'location' + res.targetId;
        let locationContent = JSON.parse(res.content.message.content.content).address;
        let locationList = JSON.parse(localStorage.getItem('locationList'));
        if (locationList) {
          locationList[locationId] = locationContent;
        } else {
          locationList = {};
          locationList[locationId] = locationContent;
        }
        localStorage.setItem('locationList', JSON.stringify(locationList));
        return false;
      }
      let unreadMsgLists = JSON.parse (localStorage.getItem ('unreadMsgLists'));
      let unreadMsg = unreadMsgLists ? unreadMsgLists : [];
      let unreadIndex = unreadMsg.findIndex (v => v.groupId === res.targetId);
      if (unreadIndex === -1) {
        let unread = {
          groupId: res.targetId,
          num: 1,
        };
        unreadMsg.push (unread);
      } else {
        unreadMsg[unreadIndex].num += 1;
      }
      localStorage.setItem ('unreadMsgLists', JSON.stringify (unreadMsg));
    }
    callback && callback (res);
  });
}
// 连接状态监听器
export function connectionStatusListener(callback) {
  imModule.setConnectionStatusListener(status => {
    switch (status) {
      case RongIMLib.ConnectionStatus.CONNECTED:
        console.log('链接成功');
        let instance = RongIMClient.getInstance();
        callback && callback(instance);
        break;
      case RongIMLib.ConnectionStatus.CONNECTING:
        console.log('正在链接');
        break;
      case RongIMLib.ConnectionStatus.DISCONNECTED:
        console.log('断开连接');
        reconnect();
        break;
      case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
        console.log('其他设备登录');
        removeToken();
        router.push({
          path: '/login'
        });
        Toast('账号在其他设备登录');
        break;
      case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
        console.log('域名不正确');
        break;
      case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
        console.log('网络不可用');
        reconnect();
        break;
    }
  });
}

// 重新连接
function reconnect() {
  var callback = {
    onSuccess: function(userId) {
      console.log('Reconnect successfully. ' + userId);
    },
    onTokenIncorrect: function() {
      console.log('token无效');
    },
    onError: function(errorCode){
      console.log(errorcode);
    }
  };
  var config = {
    // 默认 false, true 启用自动重连，启用则为必选参数
    auto: true,
    // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
    url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
    // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
    rate: [100, 1000, 3000, 6000, 10000]
  };
  RongIMClient.reconnect(callback, config);
}
