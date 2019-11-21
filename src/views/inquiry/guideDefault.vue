<template>
  <div id="guideDefault">
    <!-- <mt-header title="导诊接待" id="head">
      <router-link to="/" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
    </mt-header> -->
    <mt-header title="导诊接待" id="head">
      <mt-button slot="left" icon="back" @click="goBack"></mt-button>
    </mt-header>
    <div class="inquiry-page" id="inquiry-page" style="height: 500px;overflow: scroll">
      <me-chat v-for="(object) in chatArrays" :name='object.name' :message='object.message'
               :actor='object.actor' :key='object.id'>
      </me-chat>
      <div v-if="hasChecked">
        <me-chat name="医生助理" message="就诊信息已提交，这是您的就诊信息：" actor="doctor" :avatar='this.user.photopath'>
          <div class="box-patientInfo">
            <div class="b-head">
              <span>{{patient.name}}</span> <span>{{patient.gender === 1 ? '男' : '女'}}</span>
              <span>{{patient.age}}岁</span>
              <br>
              <span>{{patient.description}}</span>
            </div>
            <!-- <router-link to="/inquiry/manageInquiryPeople">
              <div class="b-bottom">
                <span class="btn-blue">管理</span>
              </div>
            </router-link> -->
          </div>
        </me-chat>
        <me-chat name="医生助理" message="正根据您的症状为您推荐医生，请稍后..." actor='doctor'>
        </me-chat>
        <!-- <me-chat name="医生助理" v-if="hasChecked" :message="doctorMsg" actor='doctor'>
          <router-link :to="{path:'/doctorDetail',query:{doctorid:consult.doctorid}}">
            <div class="small-tab">
              <span class="mes">查看医生介绍</span>
              <span class="cicle-turn-icon"></span>
            </div>
          </router-link>
        </me-chat>
        <me-chat name="医生助理" v-if="hasChecked" message="医生正在问候其他患者，您可先进入候诊室接待。" actor='doctor'>
          <div class="small-tab" @click="AskDoctor">
            <span class="mes">进入候诊</span>
            <span class="cicle-turn-icon"></span>
          </div>
        </me-chat> -->
      </div>
      <div class="doctor-list" v-show="hasChecked && consultsArray.length > 0">
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
      <div class="change-doctor" v-show="hasChecked && consultsArray.length > 1"><span @click="changeDoctor">换一个医生试试 <img class="icon" src="./imgs/icon_go.png" alt=""></span></div>
      <!-- <me-chat name="医生助理" v-if="hasChecked" :message="`为您推荐了${consultsArray.length}位医生，请选择您所需的医生进行咨询`" actor='doctor'>
      </me-chat> -->
    </div>
    <div class="box-sexSelect" :class="{'hide':!chooseGander}">
      <div class="type selected" @click="checkGender(1)">男</div>
      <div class="type" @click="checkGender(0)">女</div>
    </div>
    <footer class="bottom-input" id="foot" :class="{hide:this.hasChecked,ios:this.isIOS}">
      <input type="text" id="inputText" @keyup.enter="submit" @focus.prevent="minScreen" @blur="maxScreen" v-model="inputValue"
             placeholder="这里输入文字。"><!-- @focus.prevent="scrollIntoView" -->
      <!--发送文本-->
      <div class="box-icon-send">
        <span class="icon-send" :class="{active: writing}" @click="submit"></span>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { Header, Toast }  from 'mint-ui';
import  page from './modules/page';
import chat from  '@/components/chat/chat.vue';
import ajax from '@/utils/ajax';
import { getUserInfo, removeToken } from '@/utils/auth';
import { intoInquiry } from '@/api/user';
import { getQueryString } from '@/utils/index'; // getRequestObj
import { getRongyunParam } from './inquiry'; // getConsultType
import inquiryEntrance  from '@/components/inquiryEntrance/index.vue';
import { goLogin } from '@/api/user';
// 初始化page.高度。
export default {
  name: 'guideDefault',
  computed: {
    ...mapGetters([
      'chatMsgFirst',
      'consultVX'
    ]),
    ...mapActions([
      'appendMsgFirst',
      'setConsult'
    ])
  },
  components: {
    'mt-header': Header,
    'me-chat': chat,
    'inquiryEntrance': inquiryEntrance
  },
  data: function () {
    return {
      writing: false,
      chooseGander: false,
      doctorMsg: '',
      hasChecked: false,
      patient: {},
      inputValue: '',
      mark: 2,
      user: {},
      chatArraysDefault: [
        {
          name: '医生助理',
          message: '您好，请简单描述需要咨询医生的问题',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '请提供就诊人姓名',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '请提供就诊人性别：男/女',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '请提供就诊人年龄',
          actor: 'doctor'
        }
      ],
      chatArrays: [
        {
          name: '医生助理',
          message: '您好，请简单描述需要咨询医生的问题',
          actor: 'doctor'
        }
      ],
      chatArraysVerify: [
        {
          name: '医生助理',
          message: '问题描述请输入中文',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '姓名请输入中文',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '性别请输入男或女',
          actor: 'doctor'
        },
        {
          name: '医生助理',
          message: '年龄格式不对',
          actor: 'doctor'
        },
      ],
      consult: {},
      consultsArray: [], // 推荐的医生列表
      recentDoctor: [], // 当前显示的推荐医生
      recentIndex: 0, // 当前医生索引
      isIOS: false,
      sending: false // 是否正在提交
    };
  },
  watch: {
    // 监听输入情况。
    chatArrays: function () {
      // 如果,没有被选择,则监听.
      if (this.chatMsgFirst.length < 7) {
        // 1.如果已经输入咨询信息。也就是说长度为mark
        if (this.chatArrays.length === this.mark) {
          // 验证咨询细信细是否正确
          // let reg = /[\u2E80-\u9FFF]+/g; // Unicode编码中的汉字范围
          let mes = this.chatArrays[this.mark - 1].message;
          this.chatArrays.push(this.chatArraysDefault[1]);
          this.patient.description = mes;
        }
        // 2.如果输入了姓名---chatArrays长度为mark+2
        if (this.chatArrays.length === this.mark + 2) {
          // 验证姓名是否为汉字
          // let reg = /^[\u2E80-\u9FFF]+$/g; // Unicode编码中的汉字范围
          let name = this.chatArrays[this.mark + 1].message;
          this.patient.name = name;
          this.chooseGander = true;
          this.chatArrays.push(this.chatArraysDefault[2]);
        }
        // 3.如果输入了性别---chatArrays长度为mark+4
        if (this.chatArrays.length === this.mark + 4) {
          // 验证姓名是否为男或者女
          let reg = /^[男|女]+$/g; // Unicode编码中的汉字范围
          let gender = this.chatArrays[this.mark + 3].message;
          if (reg.test(gender)) {
            this.patient.gender = gender === '男' ? 1 : 0;
            this.chatArrays.push(this.chatArraysDefault[3]);
            this.chooseGander = false;
          } else {
            this.chatArrays.push(this.chatArraysVerify[2]);
            this.mark = this.mark + 2;
          }
        }
        // 4.如果输入了年龄---chatArrays长度为mark+6
        if (this.chatArrays.length === this.mark + 6) {
          // 验证年龄是否为数字
          let reg = /^[0-9]{1,3}$/g; // Unicode编码中的汉字范围
          let age = this.chatArrays[this.mark + 5].message;
          if (reg.test(this.chatArrays[this.mark + 5].message)) {
            this.patient.age = age;
            if (this.chatMsgFirst.length === 0) {
              this.submitConsultPersonMes();
            }
          } else {
            this.chatArrays.push(this.chatArraysVerify[3]);
            this.mark = this.mark + 2;
          }
        }
      }
    },
    consult: function (value) {
      this.doctorMsg = '向您推荐了' + value.doctorname;
    },
    inputValue: function (value) {
      if (!value || /^\s*$/.test(value)) {
        this.writing = false;
      } else {
        this.writing = true;
      }
    }
  },
  methods: {
    preventDefault: function (event) {
      event.preventDefault();
    },
    // 适应屏幕
    // 收缩屏幕
    minScreen: function () {
      if (page.isIOS()) {
        let pageEle = document.getElementById('inquiry-page');
        let HeightResult = page.getIOSHeightHasKeyboard(112) + 112;
        let footer = document.getElementsByTagName('footer')[0];
        setTimeout(() => {
          let innerHeight = window.innerHeight;
          HeightResult = HeightResult > (innerHeight - footer.clientHeight) ? (innerHeight - footer.clientHeight) : HeightResult;
          pageEle.style.height = HeightResult + 'px'; // 滚动区域变短
          this.scrollToBottom();
          document.body.scrollTop = 0;
          let doctorRecommendEle = document.getElementById('guideDefault');
          doctorRecommendEle.addEventListener('touchmove', this.preventDefault, false);
        }, 300);
      }
    },
    // 放大屏幕
    maxScreen: function () {
      if (page.isIOS()) {
        setTimeout(() => {
          page.selfAdaptionScreen();
          let doctorRecommendEle = document.getElementById('guideDefault');
          doctorRecommendEle.removeEventListener('touchmove', this.preventDefault, false);
        }, 100);
      }
    },
    // 进入候诊
    AskDoctor: function (groupid) {
      // let type = getQueryString('consultType');
      // 定义消息类型
      let messageName = 'UnknownMessage'; // 消息名称。
      let objectName = 'app:patientMessage'; // 消息内置名称，请按照此格式命名。
      let mesasgeTag = new RongIMLib.MessageTag(true, true);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
      let prototypes = ['content']; // 消息类中的属性名。
      RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
      // 发送自定义消息
      let conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
      let targetId = groupid; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
      let _gender = Number(this.patient.gender) === 1 ? '男' : '女';
      let _title = this.patient.name + '  ' + _gender + '  ' + this.patient.age + '岁';
      let data = { title: _title, diease: this.patient.description };
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
    },
    getUserMsg: function () {
      this.user = getUserInfo();
    },
    submit: function () {
      // 0.判断是否为空白字符串
      if (!this.inputValue || /^\s*$/.test(this.inputValue)) {
        return;
      }
      document.getElementById('inputText').blur();
      // 1.把输入的值push到数组中。
      this.chatArrays.push({ message: this.inputValue, actor: 'user' });
      // 2.input中的值清空
      this.inputValue = '';
      // 3.关闭小键盘
      // document.activeElement.blur();
      // 4.页面滚动到底部。
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    },
    // 添加就诊人，分配医生
    submitConsultPersonMes: function () {
      let url = `/api/user/EditUserMember`;
      ajax.post(url, this.patient).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.patient = res.data.data;
          this.getConsultMsg();
        }
      });
    },
    scrollToBottom: function () {
      let page = document.getElementById('inquiry-page');
      page.scrollTop = page.scrollHeight - page.clientHeight;
    },
    // 获取推荐在线医生列表
    getConsultMsg: function () {
      let url = '/api/user/getRecommendOnlineDoctors';
      ajax.get(url).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          this.consultsArray = res.data.data;
          this.recentDoctor = res.data.data[0];
          this.hasChecked = true;
          setTimeout(() => {
            page.selfAdaptionScreen();
            this.scrollToBottom();
          }, 50);
        } else {
          console.error(res.data.message);
        }
      });
    },
    // 获取聊天记录
    getChatHistory: function () {
      if (this.chatMsgFirst.length > 0) {
        this.consult = this.consultVX;
        this.chatArrays = this.chatMsgFirst;
        this.hasChecked = true;
        setTimeout(() => {
          page.selfAdaptionScreen();
          this.scrollToBottom();
        }, 50);
      }
    },
    setMsgHistory: function () {
      this.$store.dispatch('setMsgFirst', this.chatArrays);
    },
    setConsultHistory: function () {
      this.$store.dispatch('setConsult', this.consult);
    },
    // 获取性别
    checkGender: function (gender) {
      if (gender === 1) {
        this.chatArrays.push({
          message: '男',
          actor: 'user'
        });
      } else {
        this.chatArrays.push({
          message: '女',
          actor: 'user'
        });
      }
    },
    // 显示帮助
    showHelp: function () {
      MessageBox({
        title:'',
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
        memberID: _this.patient.memberid, // 就诊人ID
        description: _this.patient.description, // 病情描述
        Name: _this.patient.name, // 就诊人姓名
        Gender: _this.patient.gender, // 就诊人性别
        Age: _this.patient.age, // 就诊人年龄
        Mobile: _this.patient.mobile, // 就诊人手机号
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
            consultstatus: _this.patient.consultstatus,
            consulttype: _this.patient.consulttype,
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
              age: _this.patient.age,
              createtime: '',
              description: _this.patient.description,
              gender: _this.patient.gender,
              memberid: _this.patient.memberid,
              mobile: _this.patient.mobile,
              name: _this.patient.name,
              updatetime: null,
              usertalktoken: ''
            }
          }
          _this.consults = consult;
          this.setMsgHistory();
          this.setConsultHistory();
          // 去问诊
          _this.AskDoctor(returnData.groupid);
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
    // 检查是否已有就诊人
    checkHasMember() {
      let consultType = getQueryString('consultType');
      let url = 'api/v2/user/isExistsMember';
      ajax.get(url).then((res) => {
        if (res.status === 200 && res.data.code === 0) {
          // 有就诊人
          if (res.data.data.isexistsmember) {
            if (res.data.data.memberinfo && JSON.stringify(res.data.data.memberinfo) !== '{}') {
              let recentMemberInfo = JSON.stringify(res.data.data.memberinfo);
              sessionStorage.setItem('recentMemberInfo', recentMemberInfo);
            }
            window.location.href = `/inquiry/intoSecond?consultType=${consultType}`;
          }
        } else if (res.data.code === -2) {
          // window.location.href = '/login';
             this.$router.replace({
                path: '/login',
              });
          }
      });
    }
  },
  mounted: function () {
    this.checkHasMember();
    this.getUserMsg();
    this.getChatHistory();
    page.selfAdaptionScreen();
    // 当输入时,自适应屏幕
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
  @import "../../styles/mixin";
  @bg-blue: #1398EB;
  .box-sexSelect {
    .type {
      .btn-construct-linear-gradual(16px, @bg-blue, 4px 20px, 1rem, #FFF);
      margin-right: 20px;
    }
    position: fixed;
    bottom: 80px;
    display: flex;
    justify-content: center;
    left: 0;
    right: 0;
  }
  .hide {
    display: none !important;
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
          border: solid 1px #0ccdd3;
          border-radius: 5px;
          color: #0ccdd3;
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

