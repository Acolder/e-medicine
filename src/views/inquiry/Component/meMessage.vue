<template>
  <div class="chat-box " v-bind:class="[header.direction]">
    <!-- 头像-->
    <div class="head-portrait" v-if="visible">
      <img :src="header.portrait" alt="">
      <div class="name" v-if="header.name"> {{header.name}}</div>
    </div>
    <!--内容-->
    <div class="speech" v-if="visible">
      <div class="angel"></div>
      <div class="info">
        <!--如果文本文件-->
        <div class="message" v-html="content" v-if="message.content.messageName === 'TextMessage'"></div>
        <!--如果是图文文件-->
        <div v-if="message.content.messageName === 'ImageMessage'" @click="clickImage(message.content.imageUri)">
          <div class="mes-img"><img :src='message.content.imageUri' alt=""></div>
        </div>
        <!--如果是音频文件-->
        <div v-if="message.content.messageName === 'VoiceMessage'"
             @click="playVoice(message.content.content, message.content.duration)">
          <div class="voiceBox">
            <div class="icon-voiceMsg"></div>
            <div class="duration" :style="{width:20+3*message.content.duration+'px'}">{{message.content.duration}} S
            </div>
          </div>
        </div>
        <!--如果是处方详情文件-->
        <div
          v-if="message.content.messageName ==='UnknownMessage'&&message.content.message.objectName==='app:dialecticalPresc'"
          @click="checkOrderDetail(message.content.message.content.content)">
          <div class="class-box-graphicMes">
            <div class="b-mes">{{reportDetail.description}}</div>
            <div class="b-icon">
              <div class="icon-confirmed" :class="{active:reportDetail.status===1}"></div>
            </div>
          </div>
          <div class="small-tab"><span class="mes">点击查看</span><span class="cicle-turn-icon"></span></div>
        </div>
        <slot></slot>
      </div>
    </div>
    <!--如果类别是结束问诊-->
    <div v-if="message.content.messageName ==='UnknownMessage'&&message.content.message.objectName==='app:endConsult'"
         class="tip-endConsult">
      本次问诊结束,如有问题请再次咨询.
    </div>
  </div>
</template>
<script>
export default {
  name: 'chat',
  props: {
    message: {
      type: Object
    },
  },
  computed: {
    header: function () {
      let header = {
        id: '',
        name: '',
        portrait: ''
      };
      if (this.message.patientInfo) {
        header = this.message.patientInfo;
        header.role = 'patient';
        header.direction = 'right-chat';
      }
      else if (this.message.doctorInfo) {
        header = this.message.doctorInfo;
        header.role = 'doctor';
        header.direction = 'left-chat';
      }
      // else if (this.message.content.user) {
      //   // header = this.message.content.user;
      //   header.role = 'doctor';
      //   header.direction = 'left-chat';
      // } else if (this.message.content.messageName === 'UnknownMessage' &&
      //   this.message.content.message.objectName === 'app:dialecticalPresc') {
      //   // header = this.message.content.message.content.user;
      //   header.role = 'doctor';
      //   header.direction = 'left-chat';
      // }
      return header;
    },
    content: function () {
      let result = '';
      if (this.message.content.content) {
        let mes = window.RongIMLib.RongIMEmoji.emojiToSymbol(this.message.content.content);
        result = window.RongIMLib.RongIMEmoji.symbolToHTML(mes);
      }
      return result;
    },
    reportDetail: function () {
      let reportDetail = JSON.parse(this.message.content.message.content.content);
      return reportDetail;
    },
    visible: function () {
      if (this.message.content.messageName === 'UnknownMessage') {
        if (this.message.content.message.objectName === 'app:dialecticalPresc') {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }
  },
  methods: {
    // 点击图片
    clickImage(url) {
      this.$emit('on-chat', { type: 'clickImage', url: url });
    },
    checkOrderDetail(obj) {
      let param = {};
      param = JSON.parse(obj);
      this.$emit('on-chat', { type: 'checkOrderDetail', orderId: param.orderId });
    },
    playVoice(base64, duration) {
      this.$emit('on-chat', { type: 'playVoice', base64: base64, duration: duration });
    },
  }
};
</script>
<style lang="less" scoped>
  @import "../../../styles/mixin";
  @left-padding: 10px 10px 10px 10px;
  @right-padding: 10px 10px 10px 10px;
  @page-color: #EFEFF4;
  @chat-bg: #B7E6E7;
  .chat-box {
    font-size: 15px;
    margin-bottom: 10px;
    .head-portrait {
      text-align: center;
      width: 50px;
      flex-shrink: 0;
      img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
      }
      .name {
        display: block;
        line-height: 14px;
        color: #0B8185;
        font-size: 12px;
        word-break: break-all;
      }
    }
    .speech {
      margin: 5px 12px 0;
      position: relative;
      .info {
        max-width: 230px;
        position: relative;
        padding: @left-padding;
        background-color: #FFF;
        border-radius: 7px;
      }
      .angel {
        width: 20px;
        height: 20px;
        background-color: #FFF;
        border-radius: 20px;
        position: absolute;
        transform: rotate(7deg);
        &:before {
          display: table;
          content: " ";
          width: 15px;
          border-radius: 15px;
          height: 15px;
          background-color: #EFEFF4;
          position: absolute;
          left: -2px;
          top: -3px;
        }
      }
    }
    &.left-chat {
      display: flex;
      .speech {
        .info {
          margin-right: 35px;
        }
        .angel {
          left: -10px;
        }
      }
    }
    &.right-chat {
      display: flex;
      justify-content: flex-end;
      .head-portrait {
        order: 2;
      }
      .speech {
        order: 1;
        margin-left: 10px;
        .info {
          background-color: @chat-bg;
          margin-left: 35px;
          padding: @right-padding;
        }
        .angel {
          right: -10px;
          transform: rotate(52deg);
          background-color: @chat-bg;
        }
      }
    }
  }
  .right-chat .angel {
    right: -9px
  }
  .hasImage .info {
    width: auto !important;
    padding: 0 0 !important;
    background-color: @page-color !important;;
    img {
      border-radius: .5rem;
    }
  }
  // 白色聊天框
  .whiteChat-Box {
    .speech {
      .angel {
        background-color: #FFF !important;
      }
      .info {
        background-color: #FFF !important;
      }
    }
  }
  // 医生结束问诊
  .tip-endConsult {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
    width: 100%;
  }
  .mes-img {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .voiceBox {
    display: flex;
  }
  // 音频,声音
  .icon-voiceMsg {
    .icon-construction('../imgs/rc_voice_icon_left.png', 20px);
  }
  .duration {
    text-align: right;
    color: #0CCDD4;
  }
  // 在线处方
  .class-box-graphicMes {
    display: flex;
    justify-content: flex-end;
    .b-icon:first-child {
      margin-right: 5px;
    }
    .b-mes:first-child {
      margin-right: 5px;
    }
  }
  .icon-confirmed {
    .icon-construction("../imgs/iconfont_confirmed.png", 45px);
    margin: 5px 0 5px 0;
  }
  .icon-confirmed.active {
    .icon-construction("../imgs/iconfont_confirmedok.png", 45px);
    margin: 5px 0 5px 0;
  }
  .small-tab {
    justify-content: center;
    text-align: center;
  }
</style>

