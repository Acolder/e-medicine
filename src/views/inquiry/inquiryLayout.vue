<template>
  <div id="inquiryLayout">
    <router-view :userId="userId" :hasConnect="hasConnect"></router-view>
  </div>
</template>
<script>
import { Header, Button, Tabbar, TabItem, Field }  from 'mint-ui';
import { getUserInfo } from '@/api/user';
import { connectRongIM, messageListener, connectionStatusListener } from '@/api/connectRongIM';
import { mapActions } from 'vuex';
export default {
  data() {
    return {
      instance: null,
      userId: '',
      hasConnect: false,
    };
  },
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-tabbar': Tabbar,
    'mt-tab-item': TabItem,
    'mt-field': Field
  },
  computed: {
    ...mapActions([
      'addUnreadMsg'
    ])
  },
  methods: {
    // 链接融云
    connectIM() {
      getUserInfo().then(res => {
        console.log(res);
        if (res.status === 200) {
          let resData = res.data;
          if (resData.code === 0) {
            connectRongIM(resData.data.rongcloudtoken, instance => {
              this.instance = instance;
            });
            this.messageListeners();
            connectionStatusListener(instance => {
              this.instance = instance;
              this.hasConnect = true;
            }); // 链接状态监听器
            this.userId = resData.data.userid;
          }
          else if (resData.code === -2) {
            this.$router.push({
              path: '/login'
            });
          }
        }
      });
    },
    // 消息监听
    messageListeners() {
      let _this = this;
      messageListener(message => {
        _this.$store.dispatch('addUnreadMsg', message);
      });
    }
  },
  mounted() {
    this.connectIM();
  }
};
</script>
<style lang="less">
  @import "../../styles/mixin";
  @page-back-color: #EFEFF4;
  @title-size: 17px;
  @light-blue-color: #8CD2FE;
  @back-color: #F4FBFF;
  @color: #10A4F2;
  @border-c: #BDE4FB;
  @bg-light-blue: #C9E8F8; // 信息框背景图
  @bd-grey: #98B3C2; // 边框灰色
  @font-black: #333; // 边框灰色
  @btn-blue: @green-color;
  #inquiryLayout {
    .inquiry-page {
      background-color: #EFEFF4;
      padding: 60px 12px 5px;
      overflow: scroll;
    }
    .chat-page {
      overflow-x: hidden;
      overflow-y: auto;
      width: 100%;
      height: 100%;
      .read-more {
        text-align: center;
        color: #85d9d3;
        &.on {
          span {
            &:hover {
              cursor: pointer;
              text-decoration: underline;
            }
          }
        }
        span {
          padding: 10px 0;
          display: inline-block;
          margin-left: 5px;
        }
        img {
          vertical-align: middle;
          margin-top: -3px;
        }
      }
    }
    .bottom-input {
      position: fixed;
      width: 100%;
      background-color: #FFF;
      padding: 10px 20px 20px;
      bottom: 0;
      text-align: center;
      display: flex;
      input {
        width: 100%;
        height: 35px;
        background-color: #FFF;
        border-radius: 3px;
        border: 1px solid #D9D9D9;
        font-size: 16px;
        padding: 0 5px;
      }
      .box-icon-down {
        flex-basis: 30px;
        padding: 5px 0 0px 15px;
      }
      .box-icon-send {
        flex-basis: 30px;
        padding: 5px 0 0px 15px;
      }
      &.hide{
        display: none;
      }
    }
    .recent-doctor-tips {
      position: absolute;
      bottom: 61px;
      left: 0;
      width: 100%;
      text-align: center;
      padding: 5px 0;
      background: #f2e5cb;
      color: #d48d49;
    }
    // 病人信息框
    .box-patientInfo {
      text-align: center;
      padding: 15px 0 10px 0;
      .b-head {
        width: 80%;
        display: inline-block;
        border: 1px solid @border-c;
        background-color: @back-color;
        border-radius: 5px;
        text-align: center;
        color: @color;
        padding: 5px 0;
        span + span {
          margin-left: 10px;
        }
      }
      .b-bottom {
        display: flex;
        justify-content: flex-end;
        padding: 15px 10px 0 0;
        span {
          margin-left: 20px;
        }
      }
    }
    .right-chat .box-patientInfo {
      .b-head {
        border: 1px solid @bd-grey;
        background-color: @bg-light-blue;
        color: @font-black;
      }
    }
    // 按钮
    @font-size: 16px;
    @bg-color: #FDA304;
    @padding: 2px 12px;
    @radius: 18px;
    @c: #FFF;
    @bg-color-blue: @green-color;
    .btn-yellow {
      .btn-construct-linear-gradual(@font-size, @bg-color, @padding, @radius, @c)
    }
    .btn-blue {
      .btn-construct-linear-gradual(@font-size, @bg-color-blue, @padding, @radius, @c)
    }
    // end 病人信息
    // 额外连接框
    .small-tab {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      color: #d74949;
      font-size: 14px;
      padding: 5px 0 0 0;
      .mes {
        line-height: 14px;
      }
    }
    // 跳转按钮
    .cicle-turn-icon {
      display: block;
      .cicle-turn-icon-small-right(#d74949);
      margin: 0 6px;
    }
    .change-member {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #28acb0;
      font-size: 14px;
      padding: 5px 0 0 0;
      .mes {
        line-height: 14px;
      }
      .cicle-turn-icon {
        display: block;
        .cicle-turn-icon-small-right(#28acb0;);
        margin: 0 6px;
      }
    }
    // 右侧按钮
    @font-size: 16px;
    @font-size-biger: 18px;
    @bg-yellow: #F4DDAA;
    @font-yellow: #D4893A;
    @font-bulue-light: @green-color;
    .btn-right {
      .btn();
      color: @font-bulue-light;
      font-size: @font-size;
    }
    .box-timeDown {
      margin: 0px 10px 20px 10px;
      font-size: @font-size;
      color: @font-yellow;
      background-color: @bg-yellow;
      text-align: center;
      padding: 6px 0;
      border-radius: 0.3em;
      .mes-1 {
      }
      .mes-2 {
        margin: 0 0 0 15px;
      }
    }
    .mes-img {
      max-width: 230px;
    }
    .icon-doubt {
      .icon-construction("./imgs/icon_help.png", 20px);
    }
    .icon-add {
      .icon-construction("./imgs/icon_add.png", 20px);
    }
    // bottom feature pane
    @color-grey2: #E1E1E2;
    @bg-grey2: #FDFDFE;
    .bottom-input.box {
      flex-wrap: wrap;
      padding: 6px 0 20px 0;
      background-color: @bg-grey2;
      font-size: 14px;
      z-index: 10000;
      .box-input {
        width: 100%;
        padding: 0 15px;
        display: flex;
      }
      .box-btns {
        display: flex;
        // justify-content: space-between;
        width: 100%;
        padding: 10px 30px 0px 30px;
        border-top: 1px solid #D9D9D9;
        color: @color-grey2;
        .item-btn {
          margin-right: 20px;
        }
      }
    }
    .icon-voice {
      .icon-construction('./imgs/icon_voice.png', 50px);
    }
    .icon-photo {
      .icon-construction('./imgs/icon_photo.png', 50px);
    }
    .icon-shooting {
      .icon-construction('./imgs/icon_shooting.png', 50px);
    }
    .icon-call {
      .icon-construction('./imgs/icon_call.png', 50px);
    }
    .icon-down {
      .icon-construction('./imgs/icon_down.png', 25px);
    }
    // 确认提交
    .box-btn {
      padding: 0 10px;
      .btn-full.static {
        position: static;
        margin-top: 120px;
        margin: 10px;
        font-size: 18px;
        color: #FFF;
        border-radius: .2em;
        padding: 15px 0;
        background-color: #CCC;
        text-align: center;
      }
    }
    .box-btn.active .btn-full.static {
      background-color: #d74949;
    }
  }
  // 消息类型-图片
  .chat-box.hasImage {
    .mes-img {
      border-radius: 10px;
    }
    img {
      width: 100px;
      border-radius: 5px;
    }
  }
  .icon-confirmed {
    .icon-construction("./imgs/iconfont_confirmed.png", 45px);
    margin: 5px 0 5px 0;
  }
  .icon-confirmed.active {
    .icon-construction("./imgs/iconfont_confirmedok.png", 45px);
    margin: 5px 0 5px 0;
  }
  .icon-confirm-failure {
    .icon-construction("./imgs/icon_pla_bingli.png", 45px);
    margin: 5px 0 5px 0;
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
  // 问诊评价
  .evaluate-box {
    padding: 0 13px;
    overflow: hidden;
    .icon {
      margin-right: 12px;
    }
    .txt-box {
      position: relative;
      label {
        display: block;
        height: 20px;
        line-height: 20px;
      }
    }
    .evaluate {
      width: 40px;
    }
    .txt1 {
      color: #000;
      margin-bottom: 5px;
      display: block;
    }
    .txt2 {
      width: 135px;
      color: #8a8a8a;
      font-size: 14px;
    }
  }
  // 医生结束问诊
  .tip-endConsult {
    text-align: center;
    padding: 20px;
    font-size: 12px;
    color: #666;
    width: 100%;
  }
  // 问诊单
  .doctor-inquiry {
    .title {
      text-align: right;
      border-bottom: solid 1px #ccc;
      padding: 0 10px 5px;
    }
    .desc {
      display: flex;
      padding: 5px 10px 0;
      .text {
        flex: 1;
        font-size: 14px;
      }
      .icon {
        width: 50px;
        height: 50px;
        margin-left: 10px;
      }
    }
  }
  // 发送问诊单
  .read-inquiry {
    .desc {
      font-size: 12px;
      color: #d74949;
      margin-top: 5px;
    }
  }
  // 问诊人信息
  .patient-message {
    display: flex;
    .icon {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
    .detail {
      flex: 1;
      p {
        margin: 3px 0;
      }
    }
  }
  // 处方审核失败消息
  .order-false {
    .order-img {
      width: 100%;
      height: 140px;
      overflow: hidden;
      border: solid 1px #53dde0;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: auto;
        min-height: 100%;
      }
    }
    p {
      color: #28acb0;
      font-size: 14px;
    }
  }
  .small-tab {
    justify-content: flex-start;
  }
  // 用户发出来的药品信息
  @font-size: 15px;
  @font-size-biger: 18px;
  @bd-grey: #CCC;
  @font-blue-light: @green-color;
  @html-color: #EFEFF4;
  .User-drugsCommend-container {
    background: #FFF;
    font-size: @font-size*0.9;
    .top {
      display: flex;
      .box-left {
        width: 20%;
        .icon-39 {
          .icon-construction("", 45px);
          border: 1px solid darken(@html-color, 10%);
          border-radius: .1em;
        }
        margin-right: 7%;
      }
      .box-right {
        width: 75%;
        position: relative;
        .introduce {
        }
        .title {
          margin-top: 2px;
          width: 90%;
        }
        .price {
          margin-top: 3px;
          color: @font-blue-light;
          font-size: @font-size;
        }
      }
    }
  }
  // 发送图标
  .icon-send {
    .icon-construction('./imgs/send.png', 25px);
  }
  .icon-send.active {
    .icon-construction('./imgs/send_active.png', 25px);
  }
  .voiceBox {
    display: flex;
  }
  // 音频,声音
  .icon-voiceMsg {
    .icon-construction('./imgs/rc_voice_icon_left.png', 20px);
  }
  .duration {
    text-align: right;
    color: @font-blue-light;
  }
  // 放大后的图片
  .bigImage {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 99999;
    max-width: 600px;
    justify-content: center;
    align-items: center;
    img{
      max-width: 100%;
      max-height: 100%;
    }
    &.show{
      display: flex;
      width: 100%;
      padding: 5px;
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
  #inquiryLayout .bottom-input.ios {
    position: relative;
  }
  #inquiry-page{
    -webkit-overflow-scrolling: touch;/* 解决ios滑动不流畅问题 */
  }
  .change-doctor {
    color: #a46f55;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
    cursor: pointer;
    .icon {
      width: 18px;
      vertical-align: middle;
      margin-top: -2px;
    }
  }
</style>
