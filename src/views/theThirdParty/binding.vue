<template>
  <div class="page">
    <div class="registe-form">
      <div class="cancel">
        <a @click="returnBack()">
          <img src="./imgs/clean.png"/>
        </a>
      </div>
      <div class="logo">
        <img src="./imgs/register.png"/>
      </div>
      <div class="row-wrapper">
        <div class="countrySelect" @click="selectCountry">
          <div>国家/地区</div>
          <div class="country">{{area.country}} <i class="el-icon-delete"></i></div>
        </div>
      </div>
      <div class="row-wrapper phone">
        <div class="box">
          <div class="areaNum">+{{area.code}} <i class="quit"></i></div>
          <input type="text" class="username" name="username" v-model="mobile" placeholder="请输入手机号" @blur="queryRegistration">
        </div>
      </div>
      <div class="row-wrapper verifycode">
        <input type="text" class="verifycode" v-model="verifycode" placeholder="请输入验证码">
        <span class="sendcode" @click="getVerifyCode()" v-show="VerificationCode" id="TencentCaptcha"
         >{{sendcode_msg}}</span>
      </div>
      <div class="row-wrapper" v-if="!isIegister">
        <input type="text" class="password" v-model="password" placeholder="请输入密码" v-if="offOn">
        <input type="password" class="password" v-model="password" placeholder="请输入密码" v-else>
        <img src="./imgs/passwordOn.png" alt="" class="look" @click="on()" v-if="offOn">
        <img src="./imgs/passwordOff.png" alt="" class="look" @click="on()" v-else>
      </div>
      <div class="agreement">
        <!--点击切换是否接受用户协议-->
        <img src="./imgs/icon-p-swmr@2x@2x.png" alt="" @click="changTabs()" v-if="isShow">
        <img src="./imgs/icon-dx@2x.png" alt="" @click="changTabs()" v-else>
        <span class="accept" @click="accept()">我接受《用户协议》中的条款</span>
      </div>
      <div class="row-wrapper register-wrapper">
        <button type="button" class="submit" :class="{bgColor:bgColor}" @click.stop="registe()">绑 定</button>
      </div>
    </div>
    <!-- 验证码弹窗 -->
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
    <div class="userpro-wrapper" v-show="user">
      <user-protocol @handle='accept'></user-protocol>
    </div>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import { Toast } from 'mint-ui';
// 组件用户协议
import UserProtocol from './UserProtocol.vue';
export default {
  data() {
    return {
      isIegister: true, // 是否注册
      loginType: 'weixin',
      redirectUrl: '',
      openId: this.$route.query.openid ? this.$route.query.openid : '',
      mobile: '', // 手机号
      password: '', // 密码
      verifycode: '', // 手机验证码
      sendcode_msg: '发送验证码', // 发送验证码
      codeImgUrl: '', // 验证码图片
      showMask: false, // 验证码弹窗
      imgcode: '', // 验证码
      isShow: true, // 是否接受用户协议
      offOn: false, // 是否显示密码
      VerificationCode: true, //
      bgColor: true,
      user: false, // 用户协议
      area: { country: '中国大陆', code: '86' } // 国家地区
    };
  },
  components: {
    // 组件用户协议
    'user-protocol': UserProtocol,
  },
  methods: {
    // 返回
    returnBack() {
      this.$router.back(-1);
    },
    // 选择国家地区
    selectCountry() {
      this.$router.push('/theThirdParty/selectCounty');
    },
    // 获取图片验证码
    getVerifyCode() {
      let phone = '^(1[3-9])\\d{9}$';
      let reg = new RegExp(phone);
      if (!this.mobile || !reg.test(this.mobile)) {
        Toast({
          message: '请填写有效手机号码！',
          position: 'middle',
          duration: 500
        });
      } else {
        if (this.sendcode_msg === '发送验证码' || this.sendcode_msg === '重新发送') {
          ajax.get('/api/system/getImageVerify/' + this.mobile).then((res) => {
            console.log(res);
            if (res.data && res.data.code === 0) {
              Toast({
                message: res.data.message,
                position: 'middle',
                duration: 500
              });
              this.codeImgUrl = 'data:image/png;base64,' + res.data.data;
              this.showMask = true;
            } else {
              Toast({
                message: res.data.message,
                position: 'middle',
                duration: 500
              });
            }
          });
        }
        return;
      }
    },
    // 获取图片验证码取消
    cancel() {
      this.showMask = false;
      this.imgcode = '';
    },
    // 发送手机验证码
    send() {
      if (this.imgcode) {
        // 0:只发送验证码 1:注册 2:忘记密码 3:验证手机号有没有注册
        ajax.get('/api/system/SendVerifyCode/' + this.mobile + '\/0\/' + this.imgcode).then((res) => {
          console.log('发送验证码', res);
          if (!res.data) {
            Toast({
              message: '发送失败！',
              position: 'middle',
              duration: 500
            });
            return;
          }
          if (res.data.code === 0) {
            this.showMask = false;
            let duration = 120;
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
              duration: 500
            });
            if (res.data.message.indexOf('已注册') !== -1) {
              this.showMask = false;
            }
            this.refreshImg();
          }
        }).catch(() => {
          Toast({
            message: '发送失败！',
            position: 'middle',
            duration: 500
          });
        });
      }
    },
    // 查询是否注册
    queryRegistration() {
      let phone = '^(1[3-9])\\d{9}$';
      let reg = new RegExp(phone);
      if (!this.mobile || !reg.test(this.mobile)) {
        this.isIegister = false;
        return;
      }
      let obj = {
        Code: this.area.code,
        Mobile: this.mobile,
      };
      console.log('查询是否注册参数', obj);
      ajax.post('/api/v2/user/isregister', obj).then((res) => {
        console.log('查询是否注册结果', res);
        if (res.data && res.data.code === 0) {
          if (res.data.data === 1) {
            this.isIegister = true;
          } else {
            this.isIegister = false;
          }
        }
      });
    },
    // 接受协议点击事件
    changTabs() {
      this.bgColor = !this.bgColor;
      this.VerificationCode = !this.VerificationCode;
      if (this.isShow === true) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    // 是否显示密码
    on() {
      if (this.offOn === true) {
        this.offOn = false;
      } else {
        this.offOn = true;
      }
    },
    // 用户协议组件显示
    accept() {
      this.user = !this.user;
    },
    // 刷新验证码
    refreshImg() {
      ajax.get('/api/system/getImageVerify/' + this.mobile).then((res) => {
        if (res.data && res.data.code === 0) {
          this.codeImgUrl = 'data:image/png;base64,' + res.data.data;
        }
      });
    },
    // 绑定
    registe() {
      let _self = this;
      if (!this.bgColor) {
        return;
      }
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
      if (!this.verifycode) {
        Toast({
          message: '请填写手机验证码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      if (!this.isIegister) {
        if (!this.password) {
          Toast({
            message: '请填写密码！',
            position: 'middle',
            duration: 1500
          });
          return;
        }
        let mima = /^(\w){6,20}$/;
        if (!mima.exec(this.password)) {
          Toast({
            message: '密码只能输入6-20个字母、数字、下划线!',
            position: 'middle',
            duration: 1500
          });
          return;
        }
      }
      let obj = {
        LoginType: this.loginType,
        OpenId: this.openId,
        Code: this.area.code,
        mobile: this.mobile,
        password: this.password,
        verifyCode: this.verifycode
      };
      ajax.post('/api/user/externalLoginBind', obj).then((res) => {
        if (res.data && res.data.code === 0) {
          if (_self.redirectUrl) {
            if (_self.redirectUrl.indexOf('http') >= 0) {
              location.href = _self.redirectUrl;
            } else {
              // 这里不要用push,防止登录成功后，页面点返回再跳回到登录页。
              _self.$router.replace({
                path: _self.redirectUrl
              });
            }
          } else {
            _self.$router.replace({
              path: '/theThirdParty/complete'
            });
          }
        }
      });
    }
  },
  created() {
    // 取出国家地区
    let area = localStorage.getItem('area');
    if (area) {
      this.area = JSON.parse(area);
    }
    // 返回的地址
    if (sessionStorage.getItem('redirectUrl')) {
      this.redirectUrl = sessionStorage.getItem('redirectUrl');
      sessionStorage.removeItem('redirectUrl');
    }
  }
};
</script>
<style lang="less" scoped>
  @import '../../styles/mixin.less';
  @left-space: 80px;
  @color: #000;
  .page {
    width: 100%;
    height: 100%;
    background-color: #FFF;
    position: relative;
    .userpro-wrapper {
      position: relative;
      height: 100%;
      text-align: center;
    }
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
              background-color: @green-color;
              color: #FFF;
              border-radius: 3px;
            }
            .cancel-send {
              margin: 15px 0 0 0;
              display: inline-block;
              width: 80px;
              height: 24px;
              background-color: #E3E3E3;
              color: @green-color;
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
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
      .logo {
        text-align: center;
        margin: 35px 0 72px;
        img {
          width: 85px;
          height: 85px;
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
            top: -5px;
            font-size: 12px;
            color: @green-color;
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
        }
      }
      .registe-link {
        text-align: center;
        .txt {
          color: @green-color;
        }
      }
    }
  }
  .page .registe-form .register-wrapper .bgColor {
    background-color: @green-color;
  }
  /*地区选择升级*/
  .row-wrapper.phone {
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
    .quit {
      display: inline-block;
      position: relative;
      width: 1px;
      height: 10px;
      right: -2px;
      /* top: 50%; */
      background-color: #B9B9B9;
    }
    .username {
      padding-left: 10px;
      border-bottom: 1px solid transparent !important;
    }
  }
  .countrySelect {
    width: 100%;
    display: flex;
    font-size: 16px;
    justify-content: space-around;
    div {
      flex: 1;
    }
    .country {
      text-align: right;
      margin-right: 30px;
      position: relative;
      .el-icon-delete {
        transform: rotate(-45deg);
        position: absolute;
        right: -20px;
        top: 50%;
        margin-top: -6px;
        display: block;
        width: 12px;
        height: 12px;
        border-right: 1px solid #CCC;
        border-bottom: 1px solid #CCC;
      }
    }
  }
</style>
