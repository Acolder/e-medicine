// var t1 = new Date().getTime();

function showInfo(str){
  // var t = document.getElementById("show");
  // var dt = new Date().getTime() - t1 + " ms 后: "
  // t.innerHTML += dt + str + "<br>";
  console.info(str);
}

showInfo("开始加载");


// function isSupport(APIName){
//   var d = document, w = window;
//   var id = "RongCloudCloud-API-Test" + new Date().getTime;
//   var iframe = d.getElementById(id);
//   if(!iframe){
//     iframe = d.createElement("iframe");
//     iframe.id = id;
//     iframe.style.display = "none";
//     d.body.appendChild(iframe);
//   }
//   var nativeAPI = iframe.contentWindow[APIName];
//   var API = w[APIName];
//   if(API && nativeAPI.toString() == API.toString()){
//     return true;
//   }
//   return false;
// }


// var isSupportSocket = isSupport("WebSocket");
//
// if(isSupportSocket){
//   require.config({
//     paths: {
//       protobuf: '//cdn.ronghub.com/protobuf-2.3.0.min',
//       RongIMLib: '//cdn.ronghub.com/RongIMLib-2.3.0'
//     }
//   });
//
//   require(['protobuf','RongIMLib'], function(protobuf,RongIMLib) {
//     showInfo("require done");
//     init(RongIMLib, protobuf);
//   });
// }else{
//   require.config({
//     paths: {
//       RongIMLib: '//cdn.ronghub.com/RongIMLib-2.3.0'
//     }
//   });
//
//   require(['RongIMLib'], function(RongIMLib) {
//     showInfo("require done");
//
//     // var RongIMClient = RongIMLib.RongIMClient;
//
//     init(RongIMLib);
//   });
// }
"use strict";
let RongIMLib=require('./RongIMLib-require-2.3.0');
showInfo("require done");
function init(RongIMLib, protobuf){
  let appKey = 'lmxuhwagli3md';
  let token = '0OmR1B6ycYMBzDmb1h8CamggL3VocKlVR7/eZsJrgXqIP/3NIEA0qIuGoZyOF5c5/J0r0IryqzozgwMXB9BWH7nefrZOxfHqjSIUdVkyzs/lJfW8lIIhoA==';
  // var targetId = '5b07775784d017434e5473a0';
  var RongIMClient = RongIMLib.RongIMClient;

  var RongIMClient = RongIMLib.RongIMClient;
  var config = { };
  if (protobuf) {
    config.protobuf = protobuf;
  }
  //初始化
  RongIMClient.init(appKey,null,{protobuf:protobuf});

  var _instance = RongIMClient.getInstance();
  // 连接状态监听器
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      console.info(status)
      switch (status) {
        case RongIMLib.ConnectionStatus.CONNECTED:
          showInfo("链接成功");
          break;
        case RongIMLib.ConnectionStatus.CONNECTING:
          console.log('正在链接');
          break;
        case RongIMLib.ConnectionStatus.DISCONNECTED:
          console.log('断开连接');
          break;
        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          console.log('其他设备登录');
          break;
        case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          console.log('域名不正确');
          break;
        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          console.log('网络不可用');
          break;
      }
    }
  });

  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      // showTips("新消息，类型为：" + message.messageType);
      // showResult("新消息",message,start);
      console.log(message);

      switch(message.messageType){
        case RongIMClient.MessageType.TextMessage:
          /*
          显示消息方法：
          消息里是 原生emoji
          RongIMLib.RongIMEmoji.emojiToHTML(message.content.content);
            */
          break;
        case RongIMClient.MessageType.VoiceMessage:
          // 对声音进行预加载
          // message.content.content 格式为 AMR 格式的 base64 码
          break;
        case RongIMClient.MessageType.ImageMessage:
          // message.content.content => 图片缩略图 base64。
          // message.content.imageUri => 原图 URL。
          break;
        case RongIMClient.MessageType.DiscussionNotificationMessage:
          // message.content.extension => 讨论组中的人员。
          break;
        case RongIMClient.MessageType.LocationMessage:
          // message.content.latiude => 纬度。
          // message.content.longitude => 经度。
          // message.content.content => 位置图片 base64。
          break;
        case RongIMClient.MessageType.RichContentMessage:
          // message.content.content => 文本消息内容。
          // message.content.imageUri => 图片 base64。
          // message.content.url => 原图 URL。
          break;
        case RongIMClient.MessageType.InformationNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.ContactNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.ProfileNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.CommandNotificationMessage:
          // do something...
          break;
        case RongIMClient.MessageType.CommandMessage:
          // do something...
          break;
        case RongIMClient.MessageType.UnknownMessage:
          // do something...
          break;
        default:
        // do something...
      }
    }
  });


  //开始链接
  RongIMClient.connect(token, {
    onSuccess: function(userId) {
      showInfo("链接成功，用户id：" + userId);
      sendMessage();
      getConversationList();
    },
    onTokenIncorrect: function() {
      showInfo('token无效');
    },
    onError:function(errorCode){
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = '未知错误';
          break;
        case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
          info = '不可接受的协议版本';
          break;
        case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
          info = 'appkey不正确';
          break;
        case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
          info = '服务器不可用';
          break;
      }
      console.log(info);
    }
  });

  function getConversationList(){
    _instance.getConversationList({
      onSuccess: function(list){
        showInfo(JSON.stringify(list, null, '\t'));
      },
      onError:function(errorCode){
        showInfo(errorCode);
      }
    }, null, 2);
  }

  //发送消息
  function sendMessage(){
    var msg = new RongIMLib.TextMessage({content:"hello RongCloud!",extra:"附加信息"});
    var conversationtype = RongIMLib.ConversationType.PRIVATE;
    var targetId = "5b07775784d017434e5473a0";
    _instance.sendMessage(conversationtype, targetId, msg, {
      onSuccess: function (message) {
        console.log(message);
        showInfo(JSON.stringify(message, null, '\t'));
      },
      onError: function (errorCode,message) {
        showInfo(errorCode);
      }
    });
  }
}
export default {
  initiate:function () {
    var RongIMClient = RongIMLib.RongIMClient;
    init(RongIMLib);
  }
}
