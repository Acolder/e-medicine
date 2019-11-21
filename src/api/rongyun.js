/**
 * Created by lven on 2018/11/27.
 */
/* eslint-disable */
import { getRongyunParam } from '@/views/inquiry/inquiry';
// 接受信息监听
export function onReceived(message, _this, readMoreHistory = false) {
  if (message.targetId === _this.consults.groupid) {
    let actor = '';
    let avatar = '';
    if (message.senderUserId === _this.userId) {
      actor = 'user';
      avatar = _this.user.photopath;
    }
    else {
      actor = 'doctor';
      avatar = _this.consults.doctorphotopath;
    }
    let data = {};
    if (message.messageType === 'TextMessage') {
      let mes = window.RongIMLib.RongIMEmoji.emojiToSymbol(
        message.content.content);
      mes = window.RongIMLib.RongIMEmoji.symbolToHTML(mes);
      data = {
        message: mes,
        actor: actor,
        avatar: avatar
      };
      // _this.sendChat(data);
    }
    // 2. 图片类型
    else if (message.messageType === 'ImageMessage') {
      data = {
        actor: actor,
        type: 'image',
        class: 'hasImage',
        url: message.content.imageUri,
        avatar: avatar
      };
      // _this.sendChat(data);
      // TODO 等待医生端发送的图片接受成功,先设置800ms.后期待优化
      // setTimeout(() => {
      //   _this.scrollToBottom();
      // }, 800);
    }
    // 3.声音类型
    else if (message.messageType === 'VoiceMessage') {
      data = {
        actor: actor,
        avatar: avatar,
        class: 'voiceInfo',
        duration: message.content.duration,
        base64: message.content.content
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 4. 医生开出个人处方 / 无库存处方消息
    else if (message.messageType === 'UnknownMessage' &&
      message.content.message.objectName === 'app:dialecticalPresc') {
      let content = JSON.parse(message.content.message.content.content);
      // console.info('recipe detail:', content);
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:dialecticalPresc',
        description: content.description || content.message,
        orderId: content.orderId || content.order_id,
        status: content.status,
        sendType: content.type || ''
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 5. 医生结束问诊
    else if (message.messageType === 'UnknownMessage' &&
      message.content.message.objectName === 'app:endConsult') {
      data = {
        type: 'app:endConsult'
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 6. 医生问诊评价
    else if (message.messageType === 'UnknownMessage' &&
    message.content.message.objectName === 'app:evaluate') {
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:evaluate'
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 7. 接收问诊单
    else if (message.messageType === 'UnknownMessage' && message.content.message.objectName === 'app:doctorPresc') {
      let content = JSON.parse(message.content.message.content.content);
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:doctorPresc',
        inquiryId: content.id,
        inquiryTitle: content.title
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 8. 发送已提交的问诊单
    else if (message.messageType === 'UnknownMessage' && message.content.message.objectName === 'app:doctorComfirmPresc') {
      let content = JSON.parse(message.content.message.content.content);
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:doctorComfirmPresc',
        inquiryId: content.id,
        inquiryTitle: content.title
      };
      // _this.sendChat(data);
      // _this.scrollToBottom();
    }
    // 9. 问诊人消息
    else if (message.messageType === 'UnknownMessage' && message.content.message.objectName === 'app:patientMessage') {
      let content = JSON.parse(message.content.message.content.content);
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:patientMessage',
        title: content.title,
        description: content.diease
      };
    }
    // 10. 处方审核失败消息
    else if (message.messageType === 'UnknownMessage' && message.content.message.objectName === 'app:PrescriptionProtocol') {
      let content = JSON.parse(message.content.message.content.content);
      data = {
        actor: actor,
        avatar: avatar,
        type: 'app:PrescriptionProtocol',
        title: content.title,
        url: content.photoString
      };
    }
    // 如果未设置接收类型，返回
    if (JSON.stringify(data) === '{}') {
      clearUnreadCount(message);
      return false;
    }
    // 是否加载更多
    if (readMoreHistory) {
      // 是
      _this.insertChat(data);
    } else {
      // 否，即首次查看
      _this.sendChat(data);
      if (message.messageType !== 'TextMessage' && message.messageType === 'ImageMessage') {
        setTimeout(() => {
          _this.scrollToBottom();
        }, 800);
      } else {
        _this.scrollToBottom();
      }
    }
    // 清除未读消息
    clearUnreadCount(message);
  }
}
export function ryOnReceived(message) {
  let _this = this;
  if (message.targetId === this.consultData.groupid) {
    let doctorInfo = {
      'name': this.consultData.realname,
      'portrait': this.consultData.avatar,
    };
    message.doctorInfo = doctorInfo;
    this.messageList.push(message);
    _this.scrollToBottom();
    clearUnreadCount(message);
  }
  if (message.messageType === 'ImageMessage') {
    setTimeout(function () {
      _this.scrollToBottom();
    }, 500);
  }
}
// 初始化
export function ryInit(ryOnReceivedFn, ryOnSuccessConnectFn) {
  let appKey = getRongyunParam().appKey;
  let token = getRongyunParam().token;
  if (!token) {
    // window.location.href = '/login';
    return;
  }
  let config = {
    protobuf: '//cdn.ronghub.com/protobuf-2.3.0.min.js'
  };
  window.RongIMLib.RongIMClient.init(appKey, null, config);
  window.instance = window.RongIMClient.getInstance();
  // 连接状态监听器
  window.RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      switch (status) {
        case window.RongIMLib.ConnectionStatus.CONNECTED:
          console.log('链接成功!!!');
          break;
        case window.RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接...');
          break;
        case window.RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接');
          break;
        case window.RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log('其他设备登录');
          break;
        case window.RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log('域名不正确');
          break;
        case window.RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log('网络不可用');
          break;
      }
    }
  });
  window.RongIMClient.setOnReceiveMessageListener({
    onReceived: (message) => {
      ryOnReceivedFn && ryOnReceivedFn(message);
    }
  });
  // 链接融云
  window.RongIMClient.connect(token, {
    onSuccess: function (userId) {
      // 链接成功后 才可 发送消息
      console.info('融云链接成功!：', userId);
      window.RongIMLib.RongIMEmoji.init(); // 表情初始化
      ryOnSuccessConnectFn && ryOnSuccessConnectFn();
    },
    onTokenIncorrect: function () {
      console.log('token无效');
    },
    onError: function (errorCode) {
      console.log(errorCode);
    }
  });
}
// 获取历史消息
export function ryGetHistoryMessage(
  conversationType, targetId, pullMessageTime, count, ResultCallback) {
  window.instance.getHistoryMessages(conversationType, targetId,
    pullMessageTime, count, {
      onSuccess: function (list, hasMsg) {
        // list 为拉取到的历史消息列表
        // hasMsg 为 boolean 值，如果为 true 则表示还有剩余历史消息可拉取，为 false 的话表示没有剩余历史消息可供拉取。
        // renderHistoryMessages 为自定义的渲染页面方法
        ResultCallback(list, hasMsg, window.instance);
      }
    });
}
export function rySentMessage(message, targetId, sendFN) {
  // let conversationtype = window.RongIMLib.ConversationType.GROUP;
  let conversationtype = this.consultData.conversationType;
  let msg = {};
  if (message.messageName === 'TextMessage') {
    msg = new window.RongIMLib.TextMessage(JSON.stringify(message.content));
    msg.content = message.content;
  } else if (message.messageName === 'ImageMessage') {
    msg = new window.RongIMLib.ImageMessage(message);
  }
  window.instance.sendMessage(conversationtype, targetId, msg, {
    onSuccess: (message) => {
      if (sendFN) {
        sendFN();
      }
    },
    onError: function (errorCode, message) {
      console.log(targetId);
      console.log('发送文字消息失败', errorCode);
    }
  });
}
export function getTotalUnreadCount(func) {
  window.instance.getTotalUnreadCount({
    onSuccess: function (count) {
      // count => 所有会话总未读数。
      if (func) {
        func(count);
      }
      console.info(count);
      return count;
    },
    onError: function (error) {
      // error => 获取总未读数错误码。
      console.info(error);
    }
  });
}
// 清除未读消息
function clearUnreadCount(msg) {
  window.RongIMClient.getInstance().clearUnreadCount(msg.conversationType, msg.targetId, {
    onSuccess: function () {
      // 清除未读消息成功。
      console.info('清除未读消息成功。');
    },
    onError: function (error) {
      // error => 清除未读消息数错误码。
      console.info('清除未读消息数错误码。', error);
    }
  });
}
