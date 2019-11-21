<template>
  <div class="page">
    <div class="login-form" :style="{top: flag ? '-210px' : ''}">
      <div class="cancel">
        <a @click="returnBack()">
          <!-- <img src="./imgs/clean.png" /> -->
        </a>
      </div>
      <div class="logo">
        <img src="./imgs/logo_yzy.png" />
      </div>
      <!-- <div class="row-wrapper">
        <div class="countrySelect" @click="selectCountry">
          <div>国家/地区</div>
          <div class="country">{{area.country}} <i class="el-icon-delete"></i></div>
        </div>
      </div> -->
   <!--   <div class="row-wrapper">
        &lt;!&ndash; <label for="username">用户名</label> &ndash;&gt;
        <input type="text" class="username" placeholder="用户名" name="username" v-model="username">
      </div>-->
      <div class="row-wrapper phone">
        <div class="box">
          <!-- <div class="areaNum">+{{area.code}} <i class="quit"></i></div> -->
          <input type="text" class="username" name="username" v-model="username" placeholder="请输入手机号">
        </div>
      </div>
      <div class="row-wrapper">
        <!-- <label for="password">密码</label> -->
        <!-- <input type="password" class="password" placeholder="密码" v-model="password">
        <img src="./imgs/look.png" alt="" class="look"> -->
        <input type="text" class="password" v-model="password" placeholder="请输入密码" v-if="offOn">
        <input type="password" class="password" v-model="password" placeholder="请输入密码" v-else>
        <img src="./imgs/icon_zy.png" alt="" class="look" @click="on()" v-if="offOn">
        <img src="./imgs/icon_by.png" alt="" class="look" @click="on()" v-else>
      </div>
      <div class="registe-link_">
        <!-- <router-link to="/registe" class="txt">没有账号？去注册</router-link> -->
        <!-- <i class="line">|</i> -->
        <!-- <router-link to="/findPassword" class="txt">忘记密码？</router-link> -->
        <span class="txt" @click="()=>{this.$router.replace({path: '/findPassword'})}">忘记密码？</span>
      </div>
      <div class="row-wrapper">
        <!-- <button type="button" class="submit" @click.stop="login()">登 录</button> -->
        <div type="button" class="submit" @click.stop="login()">登 录</div>
      </div>
      <div class="registe-link">
        <!-- <router-link to="/registe" class="txt">没有账号？去注册</router-link> -->
        <span class="txt" @click="()=>{this.$router.replace({path: '/registe'})}">没有账号？去注册</span>
        <!-- <i class="line">|</i>
        <router-link to="/findPassword" class="txt">忘记密码</router-link> -->
      </div>
    </div>
  </div>
</template>
<script>
// import $ from '@/utils/ajax';
// import { setToken } from '@/utils/auth';
import ajax from '@/utils/ajax';
import { Toast } from 'mint-ui';
import { mapActions, mapGetters } from 'vuex';
import { Base64 } from '@/utils/base64';
import { setToken } from '@/utils/auth';
import { redirectAfterLogin } from '@/api/user';
// import wx from 'weixin-js-sdk';
export default {
  data() {
    return {
      returnUrl: '',
      username: '',
      password: '',
      flag: false,
      offOn: false,
      area: { country: '中国大陆', code: '86' }
    };
  },
  computed: {
    ...mapGetters([
      'phone',
    ])
  },
  // 进入登录页面都会保存来源页面的地址，这是为了分享后登录可以跳回来源页面
  // 如果不需要跳到来源页面下面进行过滤就行或者使用location.href跳到登录页面
  // 跳登录页时,不要使用location.href进行跳转,应该使用路由跳转(beforeRouteEnter监听不到location.href,会导致来源面的地址保存失败,登录后会跳到首页)
  beforeRouteEnter(to, from, next) {
    console.log(to, from);
    next(vm => {
      // 如果是从注册修改页面过来的不保存地址
      // 保存分享来源页面的地址
      if (from.path === '/registe' || from.path === '/findPassword' || from.path === '/login') {
        console.log('来自注册和修改密码页面，不保存returnUrl');
      } else {
        sessionStorage.setItem('returnUrl', from.path);
      }
      if (sessionStorage.getItem('returnUrl')) {
        // 保存登录待跳转的URL
        vm.returnUrl = sessionStorage.getItem('returnUrl');
        // 黑名单URL(key值替换value值)
        let BACKURL = {
          '/checkInquiry': ['/inquiry/doing', '/inquiry/intoSecond', '/inquiry/guideDefault'],
          '/prescription_order': ['/prescription_detail']
        };
        // eslint-disable-next-line guard-for-in
        for (let BACKURLkEY in BACKURL) {
          // if (hasOwnProperty(BACKURLkEY)) {
          for (let VAL of BACKURL[BACKURLkEY]) {
            if (vm.returnUrl.indexOf(VAL) > -1) {
              vm.returnUrl = vm.returnUrl.replace(VAL, BACKURLkEY);
              return;
            }
          }
          // }
        }
        // for (let valo of BACKURL.URL_ONE) {
        //   vm.returnUrl = vm.returnUrl.indexOf(valo) > -1 ? vm.returnUrl.replace(valo, '/checkInquiry') : vm.returnUrl;
        // }
        // for (let valt of BACKURL.URL_TWO) {
        //   vm.returnUrl = vm.returnUrl.indexOf(valt) > -1 ? vm.returnUrl.replace(valt, '/prescription/prescription_order') : vm.returnUrl;
        // }
      }
    });
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    selectCountry() {
      this.$router.push('selectCounty');
    },
    returnBack() {
      this.$router.go(-1);
    },
    login() {
      let _self = this;
      if (!_self.username) {
        Toast({
          message: '请填写手机号码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      if (!_self.password) {
        Toast({
          message: '请填写密码！',
          position: 'middle',
          duration: 1500
        });
        return;
      }
      let consultSource = sessionStorage.getItem('consultSource');
      let storageVisitUrl = sessionStorage.getItem('visitUrl');
      // 对密码进行base64加密
      let base = new Base64();
      let _password = base.encode(_self.password);
      // 将base64密码转为 des 加密形式
      ajax.get(`/api/system/dp/${_password}`).then(resp => {
        console.log(resp);
        if (resp.status === 200 && resp.data.code === 0) {
          let des_password = resp.data.data;
          let params = {
            Mobile: _self.username,
            Password: des_password
          };
          console.log(_self.$store);
          _self.$store.dispatch('UserLogin', { username: params.Mobile, password: params.Password }).then((res) => {
            if (res.data && res.data.code === 0) {
              // 登录成功清除returnUrl
              sessionStorage.removeItem('returnUrl');
              setToken(res.data.data.usertoken);
              console.log(res);
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
              // *************
              // *************
              // *************
              // *************
              // 根据returnUrl来跳页面
              redirectAfterLogin(res.data.data, _self.returnUrl);
            }
          });
        }
      });
    },
    on() {
      if (this.offOn === true) {
        this.offOn = false;
      } else {
        this.offOn = true;
      }
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
        document.querySelector('.page').scrollIntoView(true);
      }, 100);
    },
    sout() {
      console.log('收起键盘');
      // 键盘收起事件处理
      setTimeout(() => {
        document.querySelector('.page').scrollIntoView(true);
      }, 100);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.Android);
    window.removeEventListener('focusin', this.sin);
    window.removeEventListener('focusout', this.sout);
  },
  mounted() {
    // this.getIOSHeightHasKeyboard();
    // 安卓
    let _self = this;
    if (/Android/gi.test(navigator.userAgent)) {
      this.innerHeight = document.body.innerHeight;
      window.addEventListener('resize', _self.Android);
    } else if (/iphone/gi.test(navigator.userAgent)) {
      // ios
      window.addEventListener('focusin', _self.sin);
      window.addEventListener('focusout', _self.sout);
    }
    let area = localStorage.getItem('area');
    if (area) {
      this.area = JSON.parse(area);
    }
  },
};
</script>
<style lang="less" scoped>
@import '../../styles/mixin.less';
.page {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  position: relative;
}

.login-form {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 25px 0;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px;
  .cancel {
    height: 40px;
    width: 100%;
    display: flex;
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
    height: 63px;
    line-height: 60px;
    position: relative;
    .submit {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #d74949;
      color: #fff;
      font-size: 18px;
      border-radius: 6px;
      margin-top: 20px;
    }
    label {
      line-height: 30px;
      width: 60px;
      flex: 0 1 1;
    }
    input {
      height: 50px;
      color: #000;
      display: inline-block;
      flex: 1;
      background: #fff;
      border: none;
      border-radius: 2px;
      border-bottom: 1px solid #b9b9b9;
      font-size: 15px;
    }
     ::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #c6c6cc;
    }
    .look {
      width: 23px;
      height: 14px;
      position: absolute;
      right: 24px;
      bottom: 30px;
    }
    button {
      display: block;
      width: 100%;
      height: 40px;
      text-align: center;
      background-color: #d74949;
      color: #fff;
      font-size: 18px;
      border-radius: 6px;
      margin-top: 20px;
    }
  }
  .registe-link_ {
    display: flex;
    justify-content: flex-end;
    padding: 0px 15px;
    .txt {
      color: #d74949;
    }
  }
  .registe-link {
    text-align: center;
    margin-top: 30px;
    .txt {
      color: #d74949;
    }
    .line {
      color: @green-color;
      margin: 0 14px;
    }
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
    // .username {
    //   padding-left: 10px;
    // }
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
}

</style>
