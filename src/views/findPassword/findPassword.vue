<template>
  <div class="page">
    <div class="registe-form" :style="{top: flag ? '-210px' : ''}">
      <div class="cancel">
        <a @click="returnBack()">
          <!-- <img src="./imgs/clean.png"/> -->
        </a>
      </div>
      <div class="logo">
        <img src="./imgs/logo_yzy.png"/>
      </div>
      <!-- <div class="row-wrapper">
        <div class="countrySelect" @click="selectCountry">
          <div>国家/地区</div>
          <div class="country">{{area.country}} <i class="el-icon-delete"></i></div>
        </div>
      </div> -->
      <div class="row-wrapper phone" >
        <div class="box">
          <!-- <div class="areaNum" >+{{86}} <i class="quit"></i></div> -->
          <input type="text" class="username" name="username" v-model="mobile" placeholder="请输入手机号">
        </div>
      </div>
      <div class="row-wrapper verifycode">
        <input type="text" class="verifycode" v-model="verifycode" placeholder="请输入验证码">
        <!-- <span class="sendcode" @click="getVerifyCode(mobile)" v-show="VerificationCode" id="TencentCaptcha"
         >{{sendcode_msg}}</span> -->
        <slipping-code :mobile="mobile" :code="area.code" :valid="'2'"></slipping-code>
      </div>
      <div class="row-wrapper">
        <input type="text" class="password" v-model="newPassword" placeholder="请输入新密码" v-if="offOn">
        <input type="password" class="password" v-model="newPassword" placeholder="请输入新密码" v-else>
        <img src="./imgs/icon_zy.png" alt="" class="look" @click="on()" v-if="offOn">
        <img src="./imgs/icon_by.png" alt="" class="look" @click="on()" v-else>
      </div>
      <!-- <div class="agreement"> -->
        <!--点击切换是否接受用户协议-->
        <!-- <img src="./imgs/iconlh_wxz.png" alt="" @click="changTabs()" v-if="isShow">
        <img src="./imgs/iconlh_xz.png" alt="" @click="changTabs()" v-else>
        <span class="accept">我同意<i style="color: #d74949" @click="accept()">《用户协议》</i>中的条款</span>
      </div> -->
      <div class="row-wrapper register-wrapper">
        <!-- <button type="button" class="submit" :class="{bgColor:bgColor}" @click.stop="findPassword()">完 成</button> -->
        <div type="button" class="submit" :class="{bgColor:bgColor}" @click.stop="findPassword()">完 成</div>
      </div>
      <!-- <div class="registe-link">
        <router-link to="/login" class="txt">使用密码登录</router-link>
      </div> -->
    </div>
    <div class="mask" v-show="showMask">
      <div class="imgCode-form">
        <div class="imgCode-form-row">
          <label for="imgcode">图片验证码</label>
          <input type="text" class="input-imgCode" name="imgcode" v-model="imgcode">
          <img :src="codeImgUrl" alt="" class="img-imgCode" @click.stop="refreshImg()">
        </div>
        <div class="imgCode-form-row button-wrapper">
          <button class="cancel-send" @click.stop="cancel()">取消</button>
          <button class="confirm-send" @click.stop="send()">发送</button>
        </div>
      </div>
    </div>
    <!--用户协议组件-->
    <!-- <div class="userpro-wrapper" v-show="user">
      <user-protocol @handle='accept'></user-protocol>
    </div> -->
  </div>
</template>
<style lang="less" scoped>
  @import '../../styles/mixin.less';
  @left-space: 80px;
  @color: #000;
  .page {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    position: relative;
    // .userpro-wrapper {
    //   position: relative;
    //   height: 100%;
    //   text-align: center;
    // }
    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.5);
      .imgCode-form {
        padding: 20px 0;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 280px;
        background-color: #F8F8F8;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        .imgCode-form-row {
          display: flex;
          padding: 0 15px;
          input {
            flex: 1;
            padding: 0 5px;
            height: 30px;
            width: 100px;
            outline: none;
            -webkit-appearance: none;
            -webkit-appearance: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            display: inline-block;
            vertical-align: middle;
            border: 1px solid #E0E0E0;
            border-right: 0;
            border-radius: 0;
          }
          label {
            flex: 0 0 1;
            display: inline-block;
            vertical-align: middle;
            line-height: 30px;
            width: 80px;
            font-size: 12px;
          }
          img {
            flex: 0 0 1;
            display: inline-block;
            vertical-align: middle;
            width: 60px;
            height: 30px;
            border: 1px solid #E0E0E0;
            background: #FFF;
            outline: none;
            border-left: 0;
          }
          &.button-wrapper {
            justify-content: flex-end;
            .confirm-send {
              margin: 15px 0 0 15px;
              display: inline-block;
              width: 80px;
              height: 24px;
              background-color: #d74949;
              color: #FFF;
              border-radius: 3px;
            }
            .cancel-send {
              margin: 15px 0 0 0;
              display: inline-block;
              width: 80px;
              height: 24px;
              background-color: #3e1414;;
              color: #fff;
              border-radius: 3px;
            }
          }
        }
      }
    }
    .registe-form {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 25px 0;
      background-color: #FFF;
      border-radius: 5px;
      box-shadow: 1px;
      .agreement {
        text-align: left;
        height: 30px;
        line-height: 30px;
        position: relative;
        .btnAction {
          position: absolute;
          top: 5px;
          left: 21px;
          display: inline-block;
          width: 20px;
          height: 20px;
        }
        img {
          width: 20px;
          height: 20px;
          margin: 0 0 0 20px;
          position: absolute;
          top: 5px;
          left: 0;
        }
        span {
          color: @color;
          font-size: 12px;
          position: absolute;
          left: 46px;
        }
      }
      .cancel {
        height: 40px;
        width: 100%;
        a {
          padding-left: 16px;
          &::after {
              content: '';
              display:inline-block;
              width: 16px;
              height: 16px;
              border-top: 1px solid #000;
              border-left: 1px solid #000;
              transform: rotateZ(-45deg);
            }
          // img {
          //   width: 16px;
          //   height: 16px;
          // }
        }
      }
      .logo {
        text-align: center;
        margin: 35px 0 72px;
        // margin: 9.33333334vw 0 19.2vw;
        img {
          width: 215px;
          height: 81px;
        }
      }
      .row-wrapper {
        padding: 0 5%;
        display: flex;
        height: 60px;
        line-height: 60px;
        position: relative;
        &.verifycode {
          position: relative;
          .sendcode {
            position: absolute;
            right: 10%;
            top: -11px;
            font-size: 12px;
            color: #d74949;
          }
        }
        .look {
          width: 23px;
          height: 14px;
          position: absolute;
          right: 25px;
          bottom: 31px;
        }
        input {
          height: 50px;
          color: #000;
          display: inline-block;
          flex: 1;
          border: none;
          -webkit-appearance: none;
          -webkit-appearance: none;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          background: none;
          border-radius: 2px;
          border-bottom: 1px solid #B9B9B9;
          font-size: 15px;
        }
        ::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          color: #BEBEC4;
        }
        button {
          display: block;
          width: 100%;
          height: 40px;
          text-align: center;
          background-color: @green-color;
          color: #FFF;
          font-size: 18px;
          border-radius: 6px;
        }
      }
      .register-wrapper {
        margin-top: 14px;
        .submit {
          background: #C2C2C2;
          display: block;
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: @green-color;
          color: #FFF;
          font-size: 18px;
          border-radius: 6px;
        }
      }
      .registe-link {
        text-align: center;
        .txt {
          color: #d74949;
        }
      }
    }
  }
  .page .registe-form .register-wrapper .bgColor {
    background-color: #d74949;
  }
  /*地区选择升级*/
  .row-wrapper.phone{
    .box {
      display: flex;
      width: 100%;
      height: 50px;
      line-height: 52px;
      border-bottom: 1px solid #B9B9B9;
    }
    .areaNum {
      font-size: 15px;
      line-height: 50px;
      height: 50px;
    }
    .quit{
      display: inline-block;
      position: relative;
      width: 1px;
      height: 10px;
      right: -2px;
      /* top: 50%; */
      background-color: #B9B9B9;
    }
    .username{
      border-bottom: 1px solid transparent!important;
    }
  }
  .countrySelect{
    width: 100%;
    display: flex;
    font-size: 16px;
    justify-content: space-around;
    div {
      flex: 1;
    }
    .country{
      text-align: right;
      margin-right: 30px;
      position: relative;
      .el-icon-delete{
        transform:rotate(-45deg);
        position: absolute;
        right: -20px;
        top:50%;
        margin-top: -6px;
        display: block;
        width: 12px;
        height: 12px;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
      }
    }
  }
</style>
<script>
import axois from '@/utils/ajax';
import { setToken } from '@/utils/auth';
import { Toast } from 'mint-ui';
import { Base64 } from '@/utils/base64';
import { mapActions } from 'vuex';
// 组件用户协议
// import UserProtocol from './UserProtocol.vue';
import slippingCode from './../registe/slippingCode.vue';
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      mobile: '',
      newPassword: '',
      verifycode: '',
      sendcode_msg: '获取验证码',
      codeImgUrl: '',
      showMask: false,
      imgcode: '',
      isShow: false,
      offOn: false,
      VerificationCode: true,
      bgColor: true,
      user: false,
      flag: false,
      area: { country: '中国大陆', code: '86' }
      // area: { }
    };
  },
  components: {
  //   // 组件用户协议
  //   'user-protocol': UserProtocol,
    'slipping-code': slippingCode
  },
  methods: {
    // selectCountry() {
    //   this.$router.push('selectCounty');
    // },
    returnBack() {
      // this.axoisrouter.push('/home/index');
      // this.$router.replace(-1);
      this.$router.replace({
        path: '/login',
        // query: { returnURL: this.$route.query.returnURL }
      });
    },
    send() {
      // 0:只发送验证码 1:注册 2:忘记密码 3:验证手机号有没有注册
      if (this.imgcode) {
        axois.get('/api/system/SendVerifyCode/' + this.mobile + '\/2\/' + this.imgcode).then((res) => {
          if (!res.data) {
            Toast({
              message: '发送失败！',
              position: 'middle',
              duration: 1500
            });
            return;
          }
          if (res.data.code === 0) {
            this.showMask = false;
            let duration = 60;
            this.sendcode_msg = duration + 's';
            let timer = setInterval(() => {
              duration--;
              this.sendcode_msg = duration + 's';
              if (duration === 0) {
                this.sendcode_msg = '重新发送';
                clearInterval(timer);
              }
            }, 1000);
          } else {
            Toast({
              message: res.data.message,
              position: 'middle',
              duration: 1500
            });
            this.refreshImg();
          }
        }).catch(() => {
          Toast({
            message: '发送失败！',
            position: 'middle',
            duration: 1500
          });
        });
      }
    },
    // 接受协议点击事件
    // changTabs() {
    //   this.bgColor = !this.bgColor;
    //   // this.VerificationCode = !this.VerificationCode;
    //   if (this.isShow === true) {
    //     this.isShow = false;
    //   } else {
    //     this.isShow = true;
    //   }
    // },
    getVerifyCode() {
      if (this.sendcode_msg === '获取验证码' || this.sendcode_msg === '重新发送') {
        let phone = '^(1[3-9])\\d{9}$';
        let reg = new RegExp(phone);
        if (!this.mobile || !reg.test(this.mobile)) {
          Toast({
            message: '请填写有效手机号码！',
            position: 'middle',
            duration: 1500
          });
          return;
        }
        this.showMask = !this.showMask;
        this.refreshImg();
      }
    },
    on() {
      if (this.offOn === true) {
        this.offOn = false;
      } else {
        this.offOn = true;
      }
    },
    accept() {
      this.user = !this.user;
    },
    cancel() {
      this.showMask = false;
      this.imgcode = '';
    },
    ...mapActions([
      'getUserInfo'
    ]),
    refreshImg() {
      axois.get('/api/system/getImageVerify/' + this.mobile).then((res) => {
        if (res.data && res.data.code === 0) {
          this.codeImgUrl = 'data:image/png;base64,' + res.data.data;
        }
      });
    },
    findPassword() {
      let phone = '^(1[3-9])\\d{9}$';
      let reg = new RegExp(phone);
      let _self = this;
      if (!this.mobile || !reg.test(this.mobile)) {
        Toast({
          message: '请填写有效手机号码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      if (!this.newPassword) {
        Toast({
          message: '请填写密码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      if (!this.verifycode) {
        Toast({
          message: '请填写手机验证码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      let obj = {
        Mobile: this.mobile,
        NewPassword: this.newPassword,
        VerifyCode: this.verifycode
      };
      let openid = this.$route.query.openid ? this.$route.query.openid : '';
      if (openid) {
        obj.spread_openid = openid;
      }
      axois.post('/api/user/forgetpassword', obj).then((res) => {
        if (res.data && res.data.code === 0) {
          // 修改密码成功,自动登陆
          console.log('密码修改成功!开始自动登陆!');
          Toast({
            message: '密码修改成功!自动登陆中',
            position: 'middle',
            duration: 1500
          });
          setToken(res.data.data.usertoken);
          // 密码修改成功开始登陆
          let consultSource = sessionStorage.getItem('consultSource');
          let storageVisitUrl = sessionStorage.getItem('visitUrl');
          // 对密码进行base64加密
          let base = new Base64();
          let _password = base.encode(_self.newPassword);
          // 将base64密码转为 des 加密形式
          axois.get(`/api/system/dp/${_password}`).then(resp => {
            console.log(resp);
            if (resp.status === 200 && resp.data.code === 0) {
              console.log(resp);
              let des_password = resp.data.data;
              let params = {
                Mobile: _self.mobile,
                Password: des_password
              };
              console.log(params);
              _self.$store.dispatch('UserLogin', { username: params.Mobile, password: params.Password }).then((res) => {
                if (res.data && res.data.code === 0) {
                  // 登录成功清除returnUrl
                  sessionStorage.removeItem('returnUrl');
                  // eslint-disable-next-line max-nested-callbacks
                  _self.getUserInfo().then(() => {
                    // 保存登录人的手机号码 用来查询脉诊仪借还的列表数据
                    sessionStorage.setItem('MyEquipmentMobile', _self.phone);
                    // 如果有会话来源，将来源存储
                    if (consultSource) {
                      consultSource = JSON.parse(consultSource);
                      sessionStorage.setItem('consultSource', JSON.stringify(consultSource));
                    }
                    // 如果有回退地址，将地址存储
                    if (storageVisitUrl) {
                      storageVisitUrl = JSON.parse(storageVisitUrl);
                      sessionStorage.setItem('visitUrl', JSON.stringify(storageVisitUrl));
                    }
                  });
                  // 登录成功跳首页
                  this.$router.replace({
                    path: '/?source=10056&userid=' + res.data.data.userid + '&userToken=' + res.data.data.usertoken
                  });
                }
              });
            }
          });
        } else {
          Toast({
            message: res.data.message,
            position: 'middle',
            duration: 1500
          });
        }
      });
    },
    Android() {
      const newInnerHeight = window.innerHeight;
      if (this.innerHeight > newInnerHeight) {
        console.log('唤起键盘');
        // 键盘弹出事件处理
        setTimeout(() => {
          this.flag = true;
        }, 100);
      } else {
        console.log('收起键盘');
        // 键盘收起事件处理
        setTimeout(() => {
          this.flag = false;
        }, 100);
      }
    },
    sin() {
      console.log('唤起键盘');
      // 键盘弹出事件处理
      setTimeout(() => {
        this.flag = true;
      }, 100);
    },
    sout() {
      console.log('收起键盘');
      // 键盘收起事件处理
      setTimeout(() => {
        this.flag = false;
      }, 100);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.Android);
    // window.removeEventListener('focusin', this.sin);
    // window.removeEventListener('focusout', this.sout);
  },
  mounted() {
    // 安卓
    let _self = this;
    if (/Android/gi.test(navigator.userAgent)) {
      this.innerHeight = window.innerHeight;
      window.addEventListener('resize', _self.Android);
    } else if (/iphone/gi.test(navigator.userAgent)) {
      // ios
      // window.addEventListener('focusin', _self.sin);
      // window.addEventListener('focusout', _self.sout);
    }
    let area = localStorage.getItem('area');
    this.area = JSON.parse(area) || this.area;
  }
};
</script>
