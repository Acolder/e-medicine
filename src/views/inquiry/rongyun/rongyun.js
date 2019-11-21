function sendTextMessage(content, groupid) {
  /*
  文档： http://www.rongcloud.cn/docs/web.html#5_1、发送消息
       http://rongcloud.cn/docs/api/js/TextMessage.html
  1: 单条消息整体不得大于128K
  2: conversatinType 类型是 number，targetId 类型是 string
  */
  // let content = {
  //   content: '文字聊天：~~',
  //   extra: {
  //     'name': 'name',
  //     'age': 12
  //   }
  // };
  let conversationtype = RongIMLib.ConversationType.GROUP; // 私聊
  let msg = new RongIMLib.TextMessage(content);
  //let targetId = '5b07775784d017434e5473a0';
  let targetId = groupid;
  let instance = RongIMClient.getInstance();
  instance.sendMessage(conversationtype, targetId, msg, {
    onSuccess: function (message) {
      console.log('发送文字消息成功:', message.content.content, message);
    },
    onError: function (errorCode, message) {
      console.log('发送文字消息失败', errorCode);
    }
  });
}
let RongYun = {
  instance: '',
  connected: false,
  config: {
    appKey: 'lmxuhwagli3md',
    token: '0OmR1B6ycYMBzDmb1h8CamggL3VocKlVR7/eZsJrgXqIP/3NIEA0qIuGoZyOF5c5/J0r0IryqzozgwMXB9BWH7nefrZOxfHqjSIUdVkyzs/lJfW8lIIhoA==',
    connectionStatusListener: {
      onChanged: function (status) {
        console.log(status);
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            break;
        }
      }
    },
    onReceiveMessageListener: {
      // 接收到的消息
      onReceived: function (message) {
        // 判断消息类型
        console.log('onReceived:', message);
      }
    }
  },
  setConfig: function (config) {
    this.config = Object.assign(this.config, config);
  },
  initiate: function () {
    let appKey = this.config.appKey;
    let token = this.config.token;
    let config = {
      protobuf: '//cdn.ronghub.com/protobuf-2.3.0.min.js'
    };
    RongIMLib.RongIMClient.init(appKey, null, config);
    //RongYun.instance = RongIMClient.getInstance();
// 连接状态监听器
    RongIMClient.setConnectionStatusListener(
      this.config.connectionStatusListener);
    RongIMClient.setOnReceiveMessageListener(
      this.config.onReceiveMessageListener);
// 开始链接
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        //链接成功后 才可 发送消息
        RongYun.connected = true;
        console.info('链接成功，用户id：' + userId);
      },
      onTokenIncorrect: function () {
        //console.log('token无效');
      },
      onError: function (errorCode) {
        console.log(errorCode);
      }
    });
  },
  setMsg: function (content, groupid) {
    if (this.connected) {
      sendTextMessage(content, groupid);
    } else {
      console.info('waiting connected.....');
      setTimeout(() => {
        sendTextMessage(content, groupid);
      }, 2000);
    }
  }
};
export default RongYun;


