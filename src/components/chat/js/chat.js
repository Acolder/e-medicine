// 大视频窗口
var conversationType = 3;
export function videoInit(element, videoBox) {
    var clearChild = function() {
        videoBox.innerHTML = "";
        element.innerHTML = "";
    };

    var setMain = function(node) {
        element.appendChild(node);
    };
    var videoItem = {
        added: function(result) {
            var node = result.data;
            if (result.isLocal) {
                setMain(node);
            }else{
                var jNode = node.attributes;
                videoBox.appendChild(node);
            }
        },
        removed: function(result) {
            // var videoElId = result.data;
            // $('div').remove('#' + videoElId);
        },
        joined: function(result){
            var userId = result.userId;
        }
    };
    // 注册视频节点监听
    RongCallLib.videoWatch(function(result) {
        videoItem[result.type](result);
    });
    
}
// 注册命令监听
export function commandWatch(callback) {
    RongCallLib.commandWatch(function(command) {
        callback && callback(command);
    });
}

var CallType = RongIMLib.VoIPMediaType;

 export function callVideo(tid, inId, callback) {
    var mediaType = CallType.MEDIA_VEDIO;
    call(tid, inId, mediaType, callback);
}

function callAudio() {
    var mediaType = CallType.MEDIA_AUDIO;
    call(mediaType);  
}

function call(tid, inId, mediaType, callback){
     var params = {
        conversationType: conversationType,
        targetId: tid,
        inviteUserIds: inId,
        mediaType: mediaType,
        profile: '720P'
    };
    RongCallLib.call(params, function(error) {
        if (error.info) {
            callback && callback(error);
        }
    });
}

export function hungup(targetId, callback) {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
    };
    RongCallLib.hungup(params, function(error, summary) {
        callback && callback(summary);
    });
}
function acceptAudio() {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
        mediaType: CallType.MEDIA_AUDIO
    };
    RongCallLib.accept(params, (error, res) => {
        console.log(error);
    });
}

export function acceptVideo(targetId) {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
        mediaType: CallType.MEDIA_VEDIO,
        profile: '720P'
    };
    RongCallLib.accept(params);
}

// 拒绝通话
export function reject(targetId) {
    var params = {
        conversationType: conversationType,
        targetId: targetId,
    };
    RongCallLib.reject(params);
}

function mute() {
    RongCallLib.mute();
}

function unmute() {
    RongCallLib.unmute();
}

function videoToAudio() {
    RongCallLib.videoToAudio();
}

function audioToVideo() {
    RongCallLib.audioToVideo();
}