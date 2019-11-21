<template>
  <div id="meChatList">
    <me-chat v-if="messageList.length !==0 " v-for="(object) in messageList" :key='object.id'
             v-bind="{'message':object}" @on-chat="handleChatEvent">
    </me-chat>
  </div>
</template>
<script>
import meMessage from './meMessage.vue';
import { ryOnReceived, ryInit, ryGetHistoryMessage, rySentMessage } from '@/api/rongyun.js';
import { getRongyunParam } from '@/views/inquiry/inquiry';
import { getUserInfo } from '@/utils/auth.js';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'meChatList',
  components: {
    'me-chat': meMessage,
  },
  data: function () {
    return {
      messageList: [],
      // 历史消息,已读
      historyMesList: [],
      // 本地消息
      localMesList: [],
      runTimeMessage: {},
      doctorInfo: {},
      patientInfo: {},
      targetID: '',
      conversationType: '',
      consultData: {}
    };
  },
  computed: {
    ...mapGetters([
      'chatMsg',
    ]),
    ...mapActions([
      'appendMsg'
    ])
  },
  mounted: function () {
    console.info('run mounted...');
    // 测试数据:由曾测医生提供
    /*  this.targetID = '5bf51e25f865d476ce9463c0';
     this.conversationType = 3; */
    this.consultData = JSON.parse(sessionStorage.getItem('consultData'));
    this.targetID = this.consultData.groupid;
    this.conversationType = this.consultData.conversationType;
    // 判定是否登录
    if (!getRongyunParam().token) {
      this.$router.push('/login');
    }
    this.getPatientInfo();
    this.linkRongyun();
  },
  created: function () {
    console.info('run created...');
    // document.title = '聊天消息列表';
  },
  methods: {
    linkRongyun() {
      ryInit(this.ryOnReceived, this.ryOnSuccessConnectFn);
    },
    ryOnReceived(message) {
      ryOnReceived.call(this, message);
    },
    ryOnSuccessConnectFn() {
      this.getHistoryMesList();
    },
    getHistoryMesList() {
      // 需要先链接融云
      console.info('run getHistoryMesList()');
      ryGetHistoryMessage(this.conversationType, this.targetID, null, 20, (list) => {
        this.historyMesList = list;
        // 存储到this.messageList
        let historyMesListRS = this.historyMesList.map(item => {
          if (item.senderUserId === this.patientInfo.userid) {
            item.patientInfo = {
              'id': this.patientInfo.userid,
              'name': this.patientInfo.nickname,
              'portrait': this.patientInfo.photopath,
            };
          }
          else {
            item.doctorInfo = {
              'name': this.consultData.realname,
              'portrait': this.consultData.avatar,
            };
          }
          return item;
        });
        // 如果是结束问诊
        this.messageList = historyMesListRS;
        this.scrollToBottom();
      });
    },
    getLocalMesList() {
      // 本地消息列表
    },
    getDoctorInfo() {
      // ...
    },
    getPatientInfo() {
      this.patientInfo = getUserInfo();
    },
    handleChatEvent(event) {
      if (event.type === 'clickImage') {
        this.$emit('on-chat', event);
        // this.clickImage(event.url);
      }
      if (event.type === 'checkOrderDetail') {
        this.saveOrderSource(event.orderId);
      }
      if (event.type === 'playVoice') {
        this.$emit('on-chat', event);
        // this.playVoice(event.base64, event.duration);
      }
    },
    // 保存订单来源
    saveOrderSource: function (orderId) {
      let orderSource = { source: 'onlineInquiryDoctor', orderId: orderId };
      localStorage.setItem('Order-Source', JSON.stringify(orderSource));
      this.orderId = orderId;
      window.location.href = '/prescription/index?order_id=' + orderId;
    },
    sentMessage: function (message) {
      let _this = this;
      rySentMessage.call(this, message, this.targetID, function () {
        _this.addMessageList(message);
        _this.scrollToBottom();
      });
    },
    addMessageList: function (mes) {
      let message = {
        content: mes,
        patientInfo: {
          direction: 'right-chat',
          id: this.patientInfo.userid,
          name: this.patientInfo.nickname,
          portrait: this.patientInfo.photopath,
          role: 'patient'
        }
      };
      this.messageList.push(message);
    },
    scrollToBottom: function () {
      setTimeout(() => {
        let page = document.getElementById('meChatList');
        page.scrollTop = page.scrollHeight - page.clientHeight;
      }, 100);
    },
  }
};
</script>
<style lang="less" scoped>
  @import "../../../styles/mixin";
  @font-size: 16px;
  @font-size-biger: 18px;
  @bg-yellow: #F4DDAA;
  @font-yellow: #D4893A;
  @font-bulue-light: @green-color;
  #meChatList {
    background: #EFEFF4;
    height: 100%;
    padding: 10px 10px 0 10px;
    overflow: scroll;
  }
  #doing {
    background-color: #EFEFF4;
    .isHide {
      display: none !important;
    }
    #foot {
      display: none;
    }
    #foot.flex {
      display: flex !important;
    }
    #foot.hide {
      display: none !important;
    }
  }
  // 倒计时外置
  #doing #page {
    padding-top: 44px;
  }
  #box-wrapper {
    padding-top: 60px;
  }
  // 放大后的图片
  .bigImage {
    display: none;
    position: fixed;
    top: 0;
    bottom: 0;
    img {
      width: 100%;
    }
    &.show {
      display: block;
      width: 100%;
      background-color: black;
    }
  }
</style>
