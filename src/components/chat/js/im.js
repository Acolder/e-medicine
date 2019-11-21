import RCS from './qiniu-upload';
var RongIMClient = RongIMLib.RongIMClient;
// 监听消息
var messageListener = function(callback) {
  RongIMClient.setOnReceiveMessageListener({
    // 接收到的消息
    onReceived: function (message) {
      // 判断消息类型
      callback && callback(message);
    }
  });
}

//发送消息
var sendMessage = function (targetId, msg, callback) {
  RongIMClient.getInstance().sendMessage (RongIMLib.ConversationType.GROUP, targetId, msg, {
    // 发送消息成功
    onSuccess: function (message) {
      //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
      callback && callback (message);
    },
    onError: function (errorCode, message) {
      var info = '';
      switch (errorCode) {
        case RongIMLib.ErrorCode.TIMEOUT:
          info = '超时';
          break;
        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
          info = '未知错误';
          break;
        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
          info = '在黑名单中，无法向对方发送消息';
          break;
        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
          info = '不在讨论组中';
          break;
        case RongIMLib.ErrorCode.NOT_IN_GROUP:
          info = '不在群组中';
          break;
        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
          info = '不在聊天室中';
          break;
        default:
          info = x;
          break;
      }
      alert ('发送失败:' + info);
    },
  });
};
var sendImage = function(targetId, imgFile, callback) {
  // var fileType = RongIMLib.FileType.FILE;
  var fileType = RongIMLib.FileType.IMAGE;
  RongIMClient.getInstance().getFileUrl(fileType, imgFile.filename, null, {
    onSuccess: function(res){
      let msg = new RongIMLib.ImageMessage({content: imgFile.thumbnail, imageUri: res.downloadUrl});
      sendMessage(targetId, msg, callback);
    },
    onError: function(error){
      console.log(error);
    }
  });
}
var uploadImg = function(targetId, imgFile, callback) {
  RCS.imageStartUpload(imgFile, function(data) {
    sendImage(targetId, data, callback);
  });
}
// 获取会话列表
var getConversationList = function(callback) {
  RongIMClient.getInstance ().getConversationList({
    onSuccess: function(list) {
      // console.log(list);
      callback && callback(list);
      // list => 会话列表集合。
    },
    onError: function(error) {
      console.log(error);
    }
  },null);
}
// 设置连接监听状态 （ status 标识当前连接状态 ）
// 连接状态监听器
var setConnectionStatusListener = function(callback) {
  RongIMClient.setConnectionStatusListener({
    onChanged: function (status) {
      callback && callback(status);
    }
  });
}
export {
  sendMessage,
  messageListener,
  uploadImg,
  getConversationList,
  setConnectionStatusListener
};
