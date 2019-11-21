<myComment></myComment>
<template>
  <div id="intoSecond">
    <mt-header fiexd title="医生助理">
      <mt-button slot="left" icon="back" @click="goBack"></mt-button>
      <!-- <mt-button slot="right">
        <div class="icon-doubt" @click.self="showHelp"></div>
      </mt-button> -->
    </mt-header>
    <div style="height:100%" class="inquiry-page" id="inquiry-page">
      <me-chat name="医生助理" message="你好，我是您的导诊助理，我将根据您的病情描述为您安排合适的医生。请问您要咨询什么问题？" actor='doctor'>
      </me-chat>
      <template v-if="chatArrays.length>0">
        <me-chat v-for="(object) in chatArrays" :message='object.message'
                :actor='object.actor' :key='object.id'
                :avatar='object.avatar'
        >
        </me-chat>
      </template>
      <me-chat name="医生助理" message="请选择就诊人信息" actor='doctor' v-if="hasDescipt && !hasRecentMember">
        <router-link :to="selectType">
          <div class="small-tab">
            <span class="mes">点击选择</span>
            <span class="cicle-turn-icon"></span>
          </div>
        </router-link>
      </me-chat>
      <me-chat v-if="hasChoose" message="" actor="user" :avatar='this.user.photopath'>
        <div class="box-patientInfo-new" style="width: 210px" v-if="paramerter">
          <!-- <div class="leftImage"><img src="./imgs/icon-info.png" alt=""></div> -->
          <div class="right-box">
            <div class="member-info">
              <span>{{paramerter.name}}</span> <span>{{ Number(paramerter.gender) === 1 ? '男' : '女'}}</span>
              <span>{{paramerter.age}}岁</span>
            </div>
            <!-- <div class="b-head">
              <span>{{paramerter.description}}</span>
            </div> -->
            <div class="change-member" @click="changeMember">
              <span class="mes">更换就诊人</span>
              <span class="cicle-turn-icon"></span>
            </div>
          </div>
        </div>
      </me-chat>
      <me-chat name="医生助理" v-if="hasChoose && hasDescribe" message="正根据您的症状为您推荐医生，请稍后..." actor='doctor'>
      </me-chat>
      <!-- <me-chat name="医生助理" v-if="hasChoose && hasDescribe" :message="doctorMsg" actor='doctor'>
        <router-link :to="{path:'/doctorDetail',query:{doctorid:consults.doctorid}}">
          <div class="small-tab">
            <span class="mes">查看医生介绍</span>
            <span class="cicle-turn-icon"></span>
          </div>
        </router-link>
      </me-chat> -->
      <!-- <me-chat name="医生助理" v-if="hasChoose && hasDescribe" message="医生正在问候其他患者，您可先进入候诊室接待。" actor='doctor'>
        <div class="small-tab" @click="intoInquiry">
          <span class="mes">进入问诊</span>
          <span class="cicle-turn-icon"></span>
        </div>
      </me-chat> -->
      <div class="doctor-list" v-show="hasChoose && hasDescribe && consultsArray.length > 0">
        <div class="doctor-item" @click="consultDoctor(recentDoctor)">
          <img class="icon" src="./imgs/pla_iconfont_freett@2x.png" alt="">
          <div class="doctor-message">
            <img v-if="recentDoctor.avatar" class="doctor-avatar" :src="recentDoctor.avatar" />
            <img v-else class="doctor-avatar" src="./imgs/icon_doctor@2x.png" />
            <div class="doctor-detail">
              <p class="title"><span>{{ recentDoctor.real_name }}</span> {{ recentDoctor.title_name }}</p>
              <p class="desc">{{ recentDoctor.hosname }} | {{ recentDoctor.depart_name }}</p>
            </div>
          </div>
          <div class="to-consult"><span>去咨询</span></div>
          <div class="doctor-footer">
            <span>服务{{ recentDoctor.consultnum }}人</span>
            <span>{{ recentDoctor.commentsnum }}条评论</span>
          </div>
        </div>
      </div>
      <div class="change-doctor" v-show="hasChoose && hasDescribe && consultsArray.length > 1"><span @click="changeDoctor">换一个医生试试 <img class="icon" src="./imgs/icon_go.png" alt=""></span></div>
      <!-- <me-chat name="医生助理" v-if="hasChoose && hasDescribe" :message="`为您推荐了${consultsArray.length}位医生，请选择您所需的医生进行咨询`" actor='doctor'>
      </me-chat> -->
    </div>
    <footer class="bottom-input" id="foot" :class="{ios:this.isIOS}">
      <input type="text" @keyup.enter="submitDescribe(inputValue)" @focus.prevent="minScreen" @blur="maxScreen" v-model="inputValue"
             placeholder="这里输入文字。"><!-- @focus.prevent="scrollIntoView"  -->
      <div class="box-icon-send"><span class="icon-send" @click="submitDescribe(inputValue)"></span></div>
    </footer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import page  from './modules/page';
import { Header, MessageBox, Toast }  from 'mint-ui';
// import { getConsultInfo } from '@/utils/auth';
import chat from  '@/components/chat/chat.vue';
import ajax from '@/utils/ajax';
import { getUserInfo, removeToken } from '@/utils/auth';
import inquiryEntrance  from '@/components/inquiryEntrance/index.vue';
const queryString = require('query-string');
import { getConsultType, getRongyunParam } from './inquiry';
import { addAskDoctorChats } from './history';
import { getQueryString } from '../../utils/index';
import { onReceived } from '@/api/rongyun';
import { goLogin } from '@/api/user';
export default {
  name: 'intoSecond',
  components: {
    'mt-header': Header,
    'me-chat': chat,
    'inquiryEntrance': inquiryEntrance
  },
  data: function () {
    return {
      hasDescipt: false,
      user: {},
      hasChoose: false,
      hasDescribe: false,
      patient: {},
      inputValue: '',
      chatArrays: [],
      consults: {},
      consultsArray: [], // 推荐的医生列表
      recentDoctor: [], // 当前显示的推荐医生
      recentIndex: 0, // 当前医生索引
      doctorMsg: '',
      consultType: 1,
      paramerter: {},
      hasRecentMember: false, // 是否最近就诊人
      recentMemberInfo: '', // 最近就诊人信息
      isChangeMember: false, // 更换就诊人
      hasReply: false, // 是否已回复
      isIOS: false,
      sending: false // 是否正在提交
    };
  },
  created() {
    this.$watch('paramerter', function (newValue, oldValue) {
    });
  },
  watch: {
    consults: function (value) {
      this.doctorMsg = '向您推荐了' + value.doctorname;
    },
    hasChoose: function () {
      if (this.paramerter) {
        this.hasChoose = true;
        this.maxScreen();
      }
    }
  },
  computed: {
    // 选择类型
    selectType: function () {
      // window.removeEventListener('popstate', function(e) {
      //   _this.goBack();
      // }, false);
      if (!this.hasChoose || this.hasRecentMember) {
        return '/inquiry/manageInquiryPeople?type=select&description=' + this.paramerter.description;
      } else {
        return '/inquiry/manageInquiryPeople?type=manage&description=' + this.paramerter.description;
      }
    },
    ...mapGetters([
      'consultVX',
      'chatMsg',
    ]),
    ...mapActions([
      'setConsult',
      'appendMsg'
    ])
  },
  methods: {
    //移除默认事件
    preventDefault: function (event) {
      event.preventDefault();
    },
    // 适应屏幕
    // 收缩屏幕
    minScreen: function () {
      if (page.isIOS()) {
        let pageEle = document.getElementById('inquiry-page');
        let HeightResult = page.getIOSHeightHasKeyboard(112) + 105;
        let footer = document.getElementsByTagName('footer')[0];
        setTimeout(() => {
          let innerHeight = window.innerHeight;
          HeightResult = HeightResult > (innerHeight - footer.clientHeight) ? (innerHeight - footer.clientHeight) : HeightResult;
          pageEle.style.height = HeightResult + 'px'; // 滚动区域变短
          this.scrollToBottom();
          // this.sendChat({message:document.body.scrollHeight});
          document.body.scrollTop = 0;
          let doctorRecommendEle = document.getElementById('intoSecond');
          doctorRecommendEle.addEventListener('touchmove', this.preventDefault, false);
        }, 300);
      }
    },
    // 放大屏幕
    maxScreen: function () {
      if (page.isIOS()) {
        setTimeout(() => {
          page.selfAdaptionScreen();
          let doctorRecommendEle = document.getElementById('intoSecond');
          doctorRecommendEle.removeEventListener('touchmove', this.preventDefault, false);
        }, 100);
      }
    },
    scrollToBottom: function () {
      setTimeout(() => {
        let page = document.getElementById('inquiry-page');
        page.scrollTop = page.scrollHeight - page.clientHeight;
      }, 100);
    },
    // 进入候诊
    intoInquiry: function (groupid) {
      // 发送自定义消息
      // 定义消息类型
      let messageName = 'UnknownMessage'; // 消息名称。
      let objectName = 'app:patientMessage'; // 消息内置名称，请按照此格式命名。
      let mesasgeTag = new RongIMLib.MessageTag(true, true);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      let prototypes = ['content']; // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
      // 发送自定义消息
      let conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
      let targetId = groupid; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
      let _gender = Number(this.paramerter.gender) === 1 ? '男' : '女';
      let _title = this.paramerter.name + '  ' + _gender + '  ' + this.paramerter.age + '岁';
      let data = { title: _title, diease: this.paramerter.description };
      data = JSON.stringify(data);
      let msg = new RongIMClient.RegisterMessage.UnknownMessage({ content: data });
      RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
        onSuccess: function (message) {
          console.info('发送成功!');
        },
        onError: function (errorCode) {
          console.info('发送失败!');
        }
      });
      window.location.href = '/inquiry/doing';
      // this.$router.push({
      //   path: '/inquiry/doing'
      // });
    },
    // 发送描述
    submitDescribe(con) {
      // 1.验证病情描述信息
      if (con.length < 2) {
        Toast('回复至少两个字');
        return false;
      }
      // let reg = /^[\u2E80-\u9FFF]+$/;//Unicode编码中的汉字范围
      // 2.存储病情描述信息:avatar='this.user.photopath'
      // this.chatArrays.push({ message: con, actor: 'user', avatar: this.user.photopath });
      this.paramerter.description = con;
      // 3.验证通过之后,关闭输入框,显示选择选择就诊人窗口.
      this.hasDescipt = true;
      if (this.hasRecentMember) {
        // this.hasChoose = true;
        this.hasReply = true;
        this.manageInquiryPersonMsg();
      }
      console.log(this.paramerter);
      document.getElementById('foot').style.display = 'none';
    },
    sendChat: function (data) {
      this.$store.dispatch('appendMsg', data);
      this.scrollToBottom();
      addAskDoctorChats(this.consults.groupid, data);
    },
    // 获得用户信息
    getUserMsg: function () {
      this.user = getUserInfo();
    },
    // 管理就诊人信息
    manageInquiryPersonMsg: function () {
      // 1.如果带了参数merberId,说明就诊人已经被选择。
      // if (this.hasRecentMember && !this.hasReply) {
      //   return false;
      // }
      // if (!this.hasRecentMember) {
      //   this.paramerter = queryString.parse(location.search);
      // } else if (this.hasRecentMember && this.isChangeMember) {
      //   this.paramerter = queryString.parse(location.search);
      // }
      let _this = this;
      let searchMember = queryString.parse(location.search);
      if (searchMember.memberid) {
        _this.paramerter = searchMember;
      }
      if (searchMember.description || _this.hasReply) {
        if (_this.paramerter.memberid) {
          _this.hasChoose = true;
          _this.patient = _this.paramerter;
        }
        let paramerter = _this.paramerter;
        if (paramerter && paramerter.memberid && paramerter.memberid != '') {
          _this.chatArrays.push({ message: _this.paramerter.description, actor: 'user', avatar: _this.user.photopath });
          document.getElementById('foot').style.display = 'none';
          let consultType = getConsultType();
          // 获取推荐在线医生列表 (旧版接口地址 api/user/consulted)
          let url = '/api/user/getRecommendOnlineDoctors';
          ajax.get(url).then((res) => {
            if (res.status === 200 && res.data.code === 0) {
              _this.consultsArray = res.data.data;
              _this.recentDoctor = res.data.data[0];
              _this.hasDescribe = true;
              _this.showConsultDetail();
            }else {
              _this.$router.push('/login');
            }
          });
        }
      }
    },
    // 显示问诊详情到屏幕
    showConsultDetail: function () {
      this.hasDescribe = true;
      // 滚动到底部重新适应屏幕
      setTimeout(() => {
        page.selfAdaptionScreen();
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000);
      }, 100);
    },
    inputChange: function () {
      // 1.把输入的值push到数组中。
      this.$store.dispatch('appendMsgFirst', { message: this.inputValue, actor: 'user' });
      // 2.input中的值清空
      this.inputValue = '';
      // 3.关闭小键盘
      document.activeElement.blur();
      // 4.页面滚动到底部。
      setTimeout(() => {
        let page = document.getElementById('inquiry-page');
        page.scrollTop = page.scrollHeight - page.clientHeight;
      }, 100);
    },
    // 设置咨询历史记录
    setConsultHistory: function () {
      this.$store.dispatch('setConsult', this.consults);
    },
    // 获取页面咨询历史记录
    getPageHistory: function () {
      this.consults = this.consultVX;
    },
    showHelp: function () {
      MessageBox({
        title: '',
        message: '<div style="color: #000;text-align: left;line-height: 28px">1.医生给你咨询问诊目前为免费服务,系统根据您提交就诊信息进行匹配医生' +
        '<br>2.一个账号同一时间只能咨询一个医生,每次问诊时长为15分钟,问诊结束后需重新匹配医生</div>',
        showCancelButton: false,
        showConfirmButton: true,
      });
    },
    // 咨询医生
    consultDoctor(doctor) {
      let _this = this;
      if (_this.sending) {
        return false;
      }
      let url = '/api/user/consultDoctor';
      let consultSource = JSON.parse(sessionStorage.getItem('consultSource'));
      let storeId = sessionStorage.getItem('StoreId');
      let params = {
        doctorId: doctor.user_id, // 医生ID
        real_name: doctor.real_name, // 医生姓名
        avatar: doctor.avatar, // 医生头像
        memberID: _this.paramerter.memberid, // 就诊人ID
        description: _this.paramerter.description, // 病情描述
        Name: _this.paramerter.name, // 就诊人姓名
        Gender: _this.paramerter.gender, // 就诊人性别
        Age: _this.paramerter.age, // 就诊人年龄
        Mobile: _this.paramerter.mobile, // 就诊人手机号
        ConsultSource: consultSource, // ConsultSource状态码: 1药葫芦 2问诊室 3药柜 4药箱 5电商
      }
      if (storeId) {
        storeId = JSON.parse(storeId);
        params.storeid = storeId;
      }
      _this.sending = true;
      ajax.post(url, params).then(res => {
        _this.sending = false;
        if (res.status === 200 && res.data.code === 0) {
          // localStorage.removeItem('consultSource'); // 清除聊天来源
          let returnData = res.data.data;
          // 保存当前选择的医生信息
          let consultData = {
            realname: doctor.real_name, // 医生姓名
            groupid: returnData.groupid, // 群主id
            conversationType: 3, // 聊天类型 3 群聊
            doctorphotopath: doctor.avatar // 医生头像
          };
          sessionStorage.setItem('consultData', JSON.stringify(consultData));
          // 接口更改，手动添加数据 this.consult，兼容当前代码逻辑
          let consult = {
            commentsnum: doctor.commentsnum, // 评价次数
            consultid: returnData.consultid,
            consultnum: doctor.consultnum, // 服务次数
            consultstarttime: '',
            consultstatus: _this.$route.query.consultstatus,
            consulttype: _this.$route.query.consulttype,
            departname: doctor.depart_name, // 科室名称
            doctorid: doctor.user_id,
            doctorname: doctor.real_name,
            doctorphotopath: doctor.avatar,
            entrytime: null,
            expert: '',
            groupid: returnData.groupid,
            hostname: doctor.hosname, // 医院名称
            personalinfo: '',
            realname: doctor.real_name, // 医生名称
            talktoken: '',
            titlename: doctor.title_name, // 职称
            watingseconds: '',
            memberinfo: {
              age: _this.paramerter.age,
              createtime: '',
              description: _this.paramerter.description,
              gender: _this.paramerter.gender,
              memberid: _this.paramerter.memberid,
              mobile: _this.paramerter.mobile,
              name: _this.paramerter.name,
              updatetime: null,
              usertalktoken: ''
            }
          }
          _this.consults = consult;
          // 去问诊
          _this.intoInquiry(returnData.groupid);
        }
      })
    },
    scrollIntoView() {
      setTimeout(() => {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 200);
    },
    // 返回
    goBack() {
      let visitUrl = sessionStorage.getItem('visitUrl');
      if (visitUrl) {
        visitUrl = JSON.parse(visitUrl);
        visitUrl = decodeURIComponent(visitUrl);
        sessionStorage.removeItem('visitUrl');
        window.location.href = visitUrl;
      } else {
        this.$router.go(-1);
      }
    },
    // 切换医生
    changeDoctor() {
      let maxNum = this.consultsArray.length - 1;
      this.recentIndex = this.recentIndex < maxNum ? this.recentIndex + 1 : 0;
      this.recentDoctor = this.consultsArray[this.recentIndex];
    },
    // 更换就诊人
    changeMember() {
      this.isChangeMember = true;
      this.$router.push({
        path: '/inquiry/manageInquiryPeople?type=select&description=' + this.paramerter.description
      })
    }
  },
  mounted: function () {
    let recentMenber = sessionStorage.getItem('recentMemberInfo');
    if (recentMenber) {
      this.hasRecentMember = true;
      recentMenber = JSON.parse(recentMenber);
      recentMenber.memberid = recentMenber.member_id;
      this.recentMemberInfo = recentMenber;
      this.paramerter = recentMenber;
      console.log(this.paramerter);
      // sessionStorage.removeItem('recentMemberInfo');
    }
    page.selfAdaptionScreen();
    this.getUserMsg();
    this.consultType = getConsultType();
    this.manageInquiryPersonMsg();
    document.body.onresize = () => {
      page.selfAdaptionScreen();
      setTimeout(() => {
        this.scrollToBottom();
      });
    };
    if (page.isIOS()) {
      this.isIOS = true;
    }
    // 监听浏览器自带返回事件
    // let _this = this;
    // let state = {
    //     title: "title",
    //     url: "#"
    // };
    // window.history.pushState(state, "title", "#");
    // window.addEventListener('popstate', function(e) {
    //   _this.goBack();
    // }, false);
  }
};
</script>
<style lang="less" scoped>
  .box-patientInfo-new {
    // display: flex;
    img {
      width: 44px;
    }
    .right-box {
      // padding-left: 12px;
      font-size: 15px;
      text-align: center;
    }
    .b-head {
      padding: 0 0 5px 0;
    }
    .member-info {
      background: #d4eff2;
      padding: 10px 20px;
      box-shadow: 2px 2px 1px #91c3c5;
      display: inline-block;
      margin-bottom: 8px;
    }
    span {
      margin-right: 5px;
    }
  }
  .doctor-list {
    margin: 5px 47px 10px 62px;
    max-width: 230px;
    border-radius: 7px;
    overflow: hidden;
    background: #fff;
    .doctor-item {
      position: relative;
      border-top: solid 1px #eaeaea;
      padding-top: 10px;
      &:first-child {
        border-top: none;
      }
      .icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 25px;
      }
      .doctor-message {
        display: flex;
        padding: 0 5px;
      }
      .doctor-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 5px;
      }
      .doctor-detail {
        margin-left: 10px;
        flex: 1;
        p {
          font-size: 14px;
          &.title {
            font-size: 15px;
            margin: 5px 0 3px;
            span {
              font-size: 16px;
            }
          }
          &.desc {
            color: #979797;
          }
        }
      }
      .to-consult {
        text-align: center;
        span {
          padding: 0 10px;
          border: solid 1px #ff0000;
          border-radius: 5px;
          color: #d74949;
          display: inline-block;
          font-size: 12px;
          margin: 5px 0;
        }
      }
      .doctor-footer {
        display: flex;
        border-top: solid 1px #eaeaea;
        margin: 0 5px;
        span {
          position: relative;
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: #979797;
          margin: 3px 0;
          &:first-child {
            &:after {
              position: absolute;
              content: " ";
              width: 1px;
              height: 60%;
              top: 20%;
              right: 0;
              background: #eaeaea;
            }
          }
        }
      }
    }
  }
</style>

