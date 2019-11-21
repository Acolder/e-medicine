<template>
  <div class="sendcode" @click="getVerifyCode()">
    {{sendcode_msg}}
  </div>
</template>
<script>
import axois from '@/utils/ajax';
import { Toast } from 'mint-ui';
// /* eslint-disable */
// import TencentCaptcha from '../../../static/js/TCaptcha.js';
// let TencentCaptcha = require('@static/js/TCaptcha.js');

export default {
  name: 'slippingCode',
  data() {
    return {
      sendcode_msg: '获取验证码'
    };
  },
  props: {
    mobile: {
      type: String
    },
    code: {
      type: String
    },
    valid: {
      type: String,
      // 0:只发送验证码 1:注册 2:忘记密码 3:验证手机号有没有注册
      default: '0',
    },
  },
  methods: {
    getVerifyCode() {
      let phone = '^(1[3-9])\\d{9}$';
      let reg = new RegExp(phone);
      console.log(this.mobile, this.code);
      if (!this.mobile || !reg.test(this.mobile)) {
        Toast({
          message: '请填写有效手机号码！',
          position: 'middle',
          duration: 500
        });
      } else {
        if (this.sendcode_msg !== '获取验证码') {
          return;
        }
        let _this = this;
        let captcha1 = new window.TencentCaptcha('2073880298', function (res) {
          if (res.ret === 0) {
            let param = {
              Code: _this.code,
              Mobile: _this.mobile,
              aid: res.appid,
              AppSecretKey: '0DZzwEgNdCLnfltCsKZ_DfA**',
              Ticket: res.ticket,
              Randstr: res.randstr,
              Valid: _this.valid,
            };
            axois.post('/api/system/v3/sendVerifyCode', param).then((respose) => {
              if (respose.data.code === 0) {
                let duration = 60;
                _this.sendcode_msg = duration + 's';
                let timer = setInterval(() => {
                  duration--;
                  _this.sendcode_msg = duration + 's';
                  if (duration === 0) {
                    _this.sendcode_msg = '获取验证码';
                    clearInterval(timer);
                  }
                }, 1000);
              } else {
                Toast({
                  message: respose.data.message,
                  position: 'middle',
                  duration: 500
                });
              }
              console.info('发送验证码', respose);
            });
          }
        });
        captcha1.show();
      }
    },
  }
};
</script>
<style>
  .sendcode {
    position: absolute;
    right: 10%;
    top: -5px;
    font-size: 16px;
    color: #0CCDD4;
    cursor: pointer;
  }
</style>
