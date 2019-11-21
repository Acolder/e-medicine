<template>
  <div class="chat-box " v-bind:class="[direction]">
    <!-- 头像-->
    <div class="head-portrait" v-if="type!=='app:endConsult'">
      <img :src="imgUrl" alt="">
      <div class="name" v-if="name"> {{name}}</div>
    </div>
    <!--内容-->
    <div class="speech" v-if="type!=='app:endConsult'">
      <div class="angel"></div>
      <div class="info">
        <div class="message" v-html="message"></div>
        <!--如果是图文文件-->
        <div v-if="type === 'image'" @click="clickImage(url)">
          <div class="mes-img"><img :src='url' alt=""></div>
        </div>
        <!--如果是音频文件-->
        <div v-if="duration" @click="playVoice(base64, duration)">
          <div class="voiceBox">
            <div class="icon-voiceMsg"></div>
            <div class="duration" :style="{width:20+3*duration+'px'}">{{duration}} S</div>
          </div>
        </div>
        <!--如果是处方详情文件-->
        <div v-if="type ==='app:dialecticalPresc'" @click="checkOrderDetail(orderId)">
          <div class="class-box-graphicMes">
            <div class="b-mes">{{description}}</div>
            <div class="b-icon">
              <div class="icon-confirmed" :class="{active:status===1}"></div>
            </div>
          </div>
          <div class="small-tab"><span class="mes">点击查看</span><span class="cicle-turn-icon"></span></div>
        </div>
        <slot></slot>
      </div>
    </div>
    <!--如果类别是结束问诊-->
    <div v-if="type ==='app:endConsult'" class="tip-endConsult">
      本次问诊结束,如有问题请再次咨询.
    </div>
  </div>
</template>
<script>
export default {
  name: 'chat',
  props: {
    avatar: {
      type: String
    },
    name: {
      type: String
    },
    message: {
      type: String
    },
    actor: {
      type: String
    },
    url: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    orderId: {
      type: String,
    },
    base64: {
      type: String,
    },
    duration: {
      type: Number,
    },
  },
  computed: {
    imgUrl: function () {
      // return './static/icon_doctor@2x.png'
      if (this.avatar && this.avatar.length > 0) {
        return this.avatar;
      }
      else if (this.actor === 'user') {
        return '/static/home/icon_user@2x.png';
      }
      else {
        return '/static/home/icon_doctor@2x.png?12';
      }
    },
    direction: function () {
      let dire = this.actor === 'doctor' ? 'left-chat' : 'right-chat';
      if (this.type === 'app:endConsult') {
        dire = '';
      }
      return dire;
    }
  },
  methods: {
    // 点击图片
    clickImage(url) {
      this.$emit('on-chat', { type: 'clickImage', url: url });
    },
    checkOrderDetail(orderId) {
      this.$emit('on-chat', { type: 'checkOrderDetail', orderId: orderId });
    },
    playVoice(base64, duration) {
      this.$emit('on-chat', { type: 'playVoice', base64: base64, duration: duration });
    },
  }
};
</script>
<style lang="less" scoped>
  @import "../../../styles/mixin";
  @left-padding: 10px 20px 10px 10px;
  @right-padding: 10px 10px 10px 10px;
  @page-color: #EFEFF4;
  @chat-bg: #B7E6E7;
  .chat-box {
    font-size: 15px;
    display: flex;
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
</style>

