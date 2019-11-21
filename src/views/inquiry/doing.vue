<template>
  <div id="doing">
    <div class="consult-header mint-header">
      <div class="mint-header-button is-left">
        <mt-button slot="left" icon="back" @click="endConsult" v-if="hasBack"></mt-button>
      </div>
      <!-- <h1 class="mint-header-title">{{ title }}<span v-show="onlineStatus !== 0">离线</span></h1> -->
      <h1 class="mint-header-title">{{ title }}</h1>
      <div class="mint-header-button is-right"></div>
    </div>
    <div class="inquiry-page chat-page" id="inquiry-page" :style="{ '-webkit-overflow-scrolling': scrollMode }" @click="checkFooterShow">
      <template v-if="chatMsg.length !== 0">
        <div class="read-more" :class="{'on':hasMore}" v-show="isPC"><img src="./imgs/more-message.png" /><span @click="getMoreHistoryMsg(true)">{{ readMoreText }}</span></div>
        <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" :auto-fill="false" :topPullText="topText" ref="loadmore">
          <me-chat v-for="(object) in chatMsg" :key='object.id' v-bind="object" @on-chat="handleChatEvent">
          </me-chat>
        </mt-loadmore>
      </template>
    </div>
    <footer class="bottom-input box" id="foot" :class="{flex:isReceiveMsg,hide:this.imageShow,ios:this.isIOS}">
      <div class="recent-doctor-tips" v-show="isShowRecentDoctorTips">已为您匹配到{{ title }}医生</div>
      <div class="box-input">
        <input type="text" id="inputField" @keyup.enter.self="submit" @focus.prevent="minScreen" @blur="maxScreen" v-model="inputValue" placeholder="这里输入文字。"><!-- @focus.prevent="scrollIntoView" @blur="maxScreen" -->
        <div class="box-icon-down">
          <span class="icon-down" @click="clickDown"></span>
        </div>
        <div class="box-icon-send">
          <span class="icon-send" :class="{active: writing}" @click="submit"></span>
        </div>
      </div>
      <div class="box-btns" v-show="!isHidefootBottm">
        <div class="item-btn">
          <!-- <div class="icon-photo"></div> -->
          <upload-img :fileName="'image'" @uploadSuccess="sendImageMessage"></upload-img>
          <div>照片</div>
        </div>
      </div>
    </footer>
    <div :class="{show:this.imageShow}" class="bigImage" @click="hideImage">
      <img data-v-58d64c12="" data-v-a7bf04c8="" :src=imageURL alt="" style="">
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import { mapGetters, mapActions } from 'vuex';
import { Header, MessageBox, Toast, Loadmore } from 'mint-ui';
import chat from '@/components/chat/chat.vue';
import { getUserInfo, removeToken } from '@/utils/auth';
import page from './modules/page';
import ajax from '@/utils/ajax';
import wxjs from '@/utils/wxjsInterface';
import { getQueryString, getRequestObj } from '@/utils/index';
const queryString = require('query-string');
// import inquiryEntrance from '@/components/inquiryEntrance/index.vue';
import { getConsultType, getRongyunParam } from './inquiry';
import { addAskDoctorChats, getAskDoctorChats } from './history';
import { setOrderSource } from '@/utils/auth';
import { onReceived } from '@/api/rongyun';
import uploadImg from '@/components/upload/chatUploadImg';
export default {
  name: 'doing',
  components: {
    'mt-header': Header,
    'me-chat': chat,
    // 'inquiryEntrance': inquiryEntrance,
    'upload-img': uploadImg,
    'mt-loadmore': Loadmore
  },
  data: function () {
    return {
      hasBack: true,
      consultInfo: {},
      inputValue: '',
      writing: false,
      value: 'helloword',
      btnClass: 'btn-right',
      hasImage: true,
      consults: {},
      // userId: '',
      openId: null,
      talkToken: null,
      title: '',
      isHidefootBottm: true,
      isReceiveMsg: true,  //false:候诊
      consultType: '', // 咨询类型
      // 微信js sdk 实例对象
      wx: null,
      // 请求返回的微信config对象
      wxResponseConfig: {},
      imgUrls: [],
      // 大图显示地址
      imageURL: '',
      imageShow: false,
      isIOS: false,
      isPC: false,
      timerId: '',
      onlineStatus: 0, // 医生是否在线   0：online 在线、1：offline 离线、2：logout 登出
      readMoreText: '查看更多消息',
      hasMore: true, // 是否还有历史消息
      isLoading: false, // 是否正在加载
      scrollTop: 0,
      isShowRecentDoctorTips: true, // 当前医生提示
      // 上拉下拉数据参数
      allLoaded: false, // 是否全部加载完
      scrollMode: 'auto', // 滑动方式
      showNomore: false,
      topText: '下拉加载更多'
    };
  },
  computed: {
    ...mapGetters([
      'chatMsg',
      'unReadMsg'
    ]),
    ...mapActions([
      'appendMsg'
    ])
  },
  props: {
    userId: {
      type: String,
    },
    hasConnect: {
      type: Boolean,
      default: false
    }
  },
  // beforeCreate() {
  //   Indicator.open();
  // },
  mounted: function () {
    let _this = this;
    this.getUserMsg();
    page.selfAdaptionScreen();
    this.consultType = getConsultType();
    this.getconsult();
    // this.entryGroupAutoSendMessage();
    this.getMessage(); // 获取消息
    // 1.输入自适应屏幕
    document.body.onresize = () => {
      page.selfAdaptionScreen();
      setTimeout(() => {
        _this.scrollToBottom();
      });
    };
    if (page.isIOS()) {
      this.isIOS = true;
    }
    if (page.isPC()) {
      this.isPC = true;
    }
    this.$nextTick(() => {
      setTimeout(() => {
        _this.isShowRecentDoctorTips = false;
      }, 3000);
    });
    // 监听浏览器自带返回事件
    // let _this = this;
    // let state = {
    //     title: "title",
    //     url: "#"
    // };
    // window.history.pushState(state, "title", "#");
    // window.addEventListener('popstate', function(e) {
    //   _this.endConsult();
    // }, false);
  },
  created: function () {
    document.body.onresize = () => {
      page.selfAdaptionScreen();
      setTimeout(() => {
        this.scrollToBottom();
      });
    };
    let hasBack = this.$route.query.hasback;
    if (hasBack === 'no-back') {
      this.hasBack = false;
    }
  },
  methods: {
    handleChatEvent: function (event) {
      if (event.type === 'clickImage') {
        this.clickImage(event.url)
      }
      if (event.type === 'checkOrderDetail') {
        this.saveOrderSource(event.orderId)
      }
      if (event.type === 'playVoice') {
        this.playVoice(event.base64, event.duration)
      }
      // 填写问诊单
      if (event.type === 'editInquiryOrder') {
        this.intoInquiryOrder(event.inquiryId, event.inquiryTitle);
      }
      // 审核失败问诊单
      if (event.type === 'readPrescriptionImg') {
        this.imageURL = event.img;
        this.imageShow = true;
      }
    },
    //移除默认事件
    preventDefault: function (event) {
      event.preventDefault();
    },
    // 适应屏幕
    // 收缩屏幕
    minScreen: function () {
      if (page.isIOS()) {
        let pageEle = document.getElementById('inquiry-page');
        let HeightResult = page.getIOSHeightHasKeyboard(112)+112;
        let footer = document.getElementsByTagName('footer')[0];
        setTimeout(() => {
          let innerHeight = window.innerHeight;
          HeightResult = HeightResult > (innerHeight - footer.clientHeight) ? (innerHeight - footer.clientHeight) : HeightResult;
          pageEle.style.height = HeightResult + 'px'; // 滚动区域变短
          this.scrollToBottom();
          document.body.scrollTop = 0;
          let doctorRecommendEle = document.getElementById('doing');
          doctorRecommendEle.addEventListener('touchmove', this.preventDefault, false);
        }, 300);
      }
    },
    // 放大屏幕
    maxScreen: function () {
      if (page.isIOS()) {
        setTimeout(() => {
          page.selfAdaptionScreen(-10);
          let doctorRecommendEle = document.getElementById('doing');
          doctorRecommendEle.removeEventListener('touchmove', this.preventDefault, false);
        }, 100);
      }
    },
    // 点击图片放大
    clickImage: function (url) {
      this.imageURL = url;
      if (this.imageShow === false) {
        this.imageShow = true;
      }
    },
    hideImage: function () {
      this.imageShow = false;
    },
    // 发送消息
    sendChat: function (data) {
      this.$store.dispatch('appendMsg', data);
      this.scrollToBottom();
    },
    // 插入历史消息
    insertChat: function (data) {
      let pageHeight = document.getElementById('inquiry-page').scrollHeight;
      this.$store.dispatch('insertMsg', data);
      this.scrollToBottom(pageHeight);
    },
    // 获取历史记录
    getHistory: function () {
      let chat = getAskDoctorChats(this.consults.groupid);
      this.$store.dispatch('getMsg', chat);
      ryGetHistoryMessage(this.consults.conversationType, this.consults.targetId, null, 20, (list, hasMsg, instance) => {
        console.info('list', JSON.stringify(list));
      }
      );
    },
    // 获得用户信息
    getUserMsg: function () {
      this.user = getUserInfo();
    },
    // 保存订单来源
    saveOrderSource: function (orderId) {
      let orderSource = { source: 'onlineInquiryDoctor', orderId: orderId };
      localStorage.setItem('Order-Source', JSON.stringify(orderSource));
      this.orderId = orderId;
      // window.location.href = '/prescription/prescription_detail?order_id=' + orderId;
      this.$router.push({
        path: '/prescription/prescription_detail',
        query: { order_id: orderId }
      });
    },
    // 订单支付成功,发送订单确认文件
    sendOrderPayedSuccess: function () {
      var messageName = "UnknownMessage"; // 消息名称。
      var objectName = "app:dialecticalPresc"; // 消息内置名称，请按照此格式命名。
      var mesasgeTag = new RongIMLib.MessageTag(true, true);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      var prototypes = ["content"]; // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
      var conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
      var targetId = this.consults.groupid; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
      let description = '你已确认了' + this.consults.doctorname + '开出的调理处方';
      let content = { orderId: this.orderId, description: description, status: 1 };
      var msg = new RongIMClient.RegisterMessage.UnknownMessage({
        content: content, doctor: {
          id: this.consults.doctorid,
          name: this.consults.realname,
          portrait: this.consults.doctorphotopath,
        }
      });
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
          console.info('订单已确认!');
        },
        onError: function (errorCode) {
        }
      });
      let data = {
        actor: 'user',
        type: 'app:dialecticalPresc',
        description: content.description,
        orderId: content.orderId,
        status: 1,
        avatar: this.user.photopath
      };
      this.sendChat(data);
      this.scrollToBottom();
    },
    // 结束咨询
    endConsult: function () {
      this.$router.go(-1);
    },
    // 折叠工具栏
    clickDown: function () {
      if (this.isHidefootBottm) {
        this.isHidefootBottm = false;
      } else {
        this.isHidefootBottm = true;
      }
      setTimeout(() => {
        page.selfAdaptionScreen();
        setTimeout(() => {
          this.scrollToBottom();
        });
      }, 50);
    },
    // 滚动到底部
    scrollToBottom: function (height) {
      height = height || false;
      let page = document.getElementById('inquiry-page');
      if (height) {
        setTimeout(() => {
          page.scrollTop = page.scrollHeight - height;
        }, 100);
      } else {
        setTimeout(() => {
          page.scrollTop = page.scrollHeight - page.clientHeight;
        }, 100);
      }
    },
    // 输入文字
    submit: function () {
      // 0.判断是否为空白字符串
      document.getElementById('inputField').blur();
      if (!this.inputValue || /^\s*$/.test(this.inputValue)) {
        return;
      }
      // 1.把输入的值push到数组中。,向融云发送消息
      this.rongyunSentMsg(this.inputValue, this.consults.groupid);
      // 2.input中的值清空
      this.inputValue = '';
      // 3.关闭小键盘
      document.activeElement.blur();
      // 4.页面滚动到底部。
      this.scrollToBottom();
    },
    // 获得咨询信息
    getconsult: function () {
      this.consults = JSON.parse(sessionStorage.getItem('consultData'));
      // 微信公众号咨询
      this.openId = sessionStorage.getItem('wxUnionId');
      if (this.openId) {
        this.talkToken = this.consults.memberinfo.usertalktoken;
        return false;
      }
      //药葫芦咨询
      //判断是否有就诊人
      let url = 'api/v2/user/isExistsMember';
      ajax.get(url).then((res) => {
        if (res.data.code === 0 && res.status === 200) {
          console.info(res.data.data);
          // 1.没有咨询中，候诊中的订单，且没有就诊人,即(第一次进入)
          if (!res.data.data.isexistsmember) {
            // 第一次进入页面
            window.location.href = '/inquiry/guideDefault';
          } else {
            console.log(this.consults);
            setTimeout(() => {
              //this.rongyunSentMsg({ content: '医生你好！' }, this.consults.groupid);
              // 是否从支付订单成功返回过来
              let parameter = queryString.parse(location.search);
              if (parameter && parameter.orderId) {
                // 检测是否已显示过订单确认。
                let object = chatMsg.pop();
                if (parameter.orderId === object.orderId && object.actor === 'user') {
                  this.orderId = parameter.orderId;
                  this.sendOrderPayedSuccess();
                }
              }
            }, 1000);
            console.info('IsExistsMerber&&consultStatus:', res.data.data);
            // this.getConsultInfo(this.consults.consultid);
          }
        } else {
          this.$router.push('/login');
        }
      });
    },
    // send MSG
    rongyunSentMsg: function (contents, targetId) {
      let _this = this;
      let converType = RongIMLib.ConversationType.GROUP;
      let msg = new RongIMLib.TextMessage({ content: contents });
      RongIMClient.getInstance().sendMessage(converType, targetId, msg, {
        onSuccess: function (message) {
          // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
          console.log('Send successfully');
          let data = { message: contents, actor: 'user', avatar: _this.user.photopath };
          _this.sendChat(data);
        },
        onError: function (errorCode, message) {
          var info = '';
          switch (errorCode) {
            case RongIMLib.ErrorCode.TIMEOUT:
              info = '超时';
              break;
            case RongIMLib.ErrorCode.UNKNOWN:
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
          }
          console.log('发送失败: ' + info + errorCode);
          Toast('发送失败:' + info);
        }
      });
    },
    // 初次获取消息
    getMessage() {
      // 先清空已展示消息
      this.$store.dispatch('clearMsg', []);
      if (!this.hasConnect) {
        setTimeout(() => {
          this.getMessage();
        }, 500);
        return false;
      }
      this.getHistoryMsg(false);
    },
    // 获取历史消息
    getHistoryMsg(isReadMore) {
      let _this = this;
      let targetId = this.consults.groupid;
      let timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0 ,timestrap = 0;
      if (!isReadMore) {
        timestrap = 0;
      }
      let count = 20;
      RongIMClient.getInstance().getHistoryMessages(3, targetId, timestrap, count, {
        onSuccess: function (list, hasMsg) {
          console.log(list);
          console.log(hasMsg);
          console.log(_this.userId);
          if (isReadMore) {
            _this.$refs.loadmore.onTopLoaded();
            let messageArray = list.reverse();
            messageArray.forEach((res, i) => {
              onReceived(res, _this, true);
            });
          } else {
            list.forEach((res, i) => {
              onReceived(res, _this);
            });
          }
          _this.isLoading = false;
          if (!hasMsg) {
            _this.hasMore = false;
            _this.readMoreText = '没有更多了';
            _this.topText = '已加载全部';
          }
        },
        onError: function (error) {
          // APP未开启消息漫游或处理异常
          console.log(error);
        }
      });
    },
    // 消息监听
    messageListener(msg) {
      onReceived(msg, this);
    },
    initVoice: function () {
      // let RongIMVoice = RongIMLib.RongIMVoice;
      // RongIMVoice.init();
    },
    // 播放语音
    playVoice: function (voiceData, duration) {
      this.play(voiceData);
      console.info('开始播放啦in vue!')
    },
    play: function (voice) {
      if (voice) {
        let RongIMVoice = RongIMLib.RongIMVoice;
        RongIMVoice.init();
        let duration = voice.length / 1024;    // 音频持续大概时间(秒)
        RongIMVoice.preLoaded(voice, function () {
          MessageBox("提示", "暂不支持语音播放!");
          RongIMVoice.play(voice, duration);
        });
      } else {
        console.error('请传入 amr 格式的 base64 音频文件');
      }
    },
    //  3.上传图片 生成缩略图 生成base64
    sendImageMessage (baseData, file) {
      console.log(baseData.url);
      const _self = this;
      // TODO 发送图片到对话框 chatInterface.sendMsg(model.url, true, photourl, 2, true);
      let param = {
        actor: 'user',
        avatar: _self.user.photopath,
        type: 'image',
        class: 'hasImage',
        url: baseData.url
      };
      _self.sendChat(param);
      setTimeout(() => {
        _self.scrollToBottom();
      }, 1000);
      new Promise((resolve, rejects) => {
        if (baseData.attachment && baseData.attachment !== '' && baseData.physicalPath && baseData.physicalPath !== '') {
          // 生成缩略图
          let purl = `/api/system/uploadthumbnail?name=${baseData.attachment}&path=${baseData.physicalPath}`;
          ajax.post(purl).then(res => {
            if (res.status === 200) {
              let data1 = res.data.data;
              if (!!data1 === false) {
                return;
              }
              let thumbnail_data = JSON.parse(data1);
              // thumbnail_data.url 压缩后的图片
              // get base64
              ajax.get(`/api/system/getBase64ByImgUrl`, {
                params: {
                  url: thumbnail_data.url
                }
              }).then(resp => {
                console.log(resp);
                if (resp.status === 200) {
                  let data2 = resp.data;
                  if (data2.code === 0) {
                    let base64Str = data2.data;
                    resolve(base64Str);
                  }
                }
              });
            }
          });
        } else {
          // 用canvas生成base64图片
          // // 设置图片跨域访问
          // img.setAttribute('crossOrigin', 'anonymous');
          let img = new Image();
          let reader = new FileReader();
          reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function () {
              // 不要超出最大宽度
              let w = Math.min(300, img.width);
              // 高度按比例计算
              let h = img.height * (w / img.width);
              let canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d');
              // 设置 canvas 的宽度和高度
              canvas.width = w;
              canvas.height = h;
              ctx.drawImage(img, 0, 0, w, h);
              let base64 = canvas.toDataURL('image/jpeg');
              base64 = base64.replace(/^data:image\/(png|jpeg);base64,/, '');
              resolve(base64);
            }
          };
          reader.readAsDataURL(file);
        }
      }).then(base64Str => {
        // console.log(base64Str);
        // data.data  大图base64
        // TODO 发送图片给对方 rongIM.sendImg(thumbnail_data.url, data.data);
        //传送到融云
        /*
          图片转为可以使用 HTML5 的 FileReader 或者 canvas 也可以上传到后台进行转换。
          注意事项：
          1、缩略图必须是 base64 码的 jpg 图。
          2、不带前缀。
          3、大小不得超过 100kb。
          */
        let imageUri = baseData.url; // 上传到自己服务器的 URL。
        let msg = new RongIMLib.ImageMessage({ content: base64Str, imageUri: imageUri });
        let conversationtype = RongIMLib.ConversationType.GROUP; // 单聊,其他会话选择相应的消息类型即可。
        let targetId = _self.consults.groupid; // 目标 Id
        RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
          onSuccess: function (message) {
            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
            console.log("Send successfully");
          },
          onError: function (errorCode, message) {
            let info = '';
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
                info = 'x';
                break;
            }
            Toast('发送失败:' + info);
          }
        });
      });
    },
    // 2.判断是否微信
    iswx: function () {
      let ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf('micromessenger') > 0) { // 微信
        return true;
      }
      else {
        return false;
      }
    },
    // 1.初始化微信
    // initwx: function () {
    //   let _self = this;
    //   let code = getQueryString('code');
    //   wxjs.init(code).then((res) => {
    //     console.log('init wx');
    //     _self.wx = res.wx;
    //     _self.wxResponseConfig = res.wxconfig;
    //     // Toast('wx初始化成功！');
    //   });
    // },
    // 获取医生是否在线
    // entryGroupAutoSendMessage() {
    //   let _this = this;
    //   let groupId = this.consults.groupid;
    //   ajax.get(`/api/user/entryGroupAutoSendMessage/${groupId}`).then(res => {
    //     if (res.status === 200 && res.data.code === 0) {
    //       _this.onlineStatus = Number(res.data.data.online_status);
    //     }
    //   });
    // },
    // 关闭检查底部工具栏
    checkFooterShow() {
      if (!this.isHidefootBottm) {
        this.isHidefootBottm = true;
        setTimeout(() => {
          page.selfAdaptionScreen();
          // setTimeout(() => {
          //   this.scrollToBottom();
          // });
        }, 50);
      }
    },
    // 问诊单
    intoInquiryOrder(id, title) {
      this.$router.push({
        path: '/inquirySheet',
        query: { inquiryId: id, inquiryTitle: title }
      });
    },
    // 下拉刷新
    loadTop: function() {
      console.log('加载中');
      this.getMoreHistoryMsg(true);
    },
    // 获取更多历史消息
    getMoreHistoryMsg() {
      let _this = this;
      if (_this.isLoading) {
        return false;
      }
      if (_this.hasMore) {
        _this.isLoading = true;
        _this.getHistoryMsg(true);
      } else {
        _this.$refs.loadmore.onTopLoaded();
      }
    },
    scrollIntoView() {
      setTimeout(() => {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 200);
    }
  },
  watch: {
    inputValue: function (value) {
      if (!value || /^\s*$/.test(value)) {
        this.writing = false;
      } else {
        this.writing = true;
      }
    },
    'consults.realname': function (value) {
      this.title = value;
    },
    unReadMsg: function(newVal, oldVal) {
      this.messageListener(newVal);
    }
  },
  beforeRouteLeave(to, from, next) {
    let pageEle = document.getElementById('inquiry-page');
    let scrollTop = pageEle.scrollTop;
    sessionStorage.setItem('chatScrollTop', scrollTop);
    next();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let scrollTop = sessionStorage.getItem('chatScrollTop');
      if (scrollTop) {
        scrollTop = JSON.parse(scrollTop);
        sessionStorage.removeItem('chatScrollTop');
      } else {
        scrollTop = 0;
      }
      document.getElementById('inquiry-page').scrollTop = scrollTop;
    });
  }
};
</script>
<style lang="less" scoped>
  @import "../../styles/mixin";
  @font-size: 16px;
  @font-size-biger: 18px;
  @bg-yellow: #F4DDAA;
  @font-yellow: #D4893A;
  @font-bulue-light: @green-color;
  .consult-header {
    .mint-header-title {
      span {
        font-size: 14px;
        background: #ff4d57;
        color: #f8dcd5;
        padding: 2px 8px;
        border-radius: 10px;
        display: inline-block;
        margin-left: 10px;
        vertical-align: middle;
      }
    }
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
  // #doing #page {
  //   padding-top: 44px;
  // }
  #box-wrapper {
    padding-top: 60px;
  }
</style>

