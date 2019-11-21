<template>
  <div></div>
</template>
<script>
import wxjs from '@/utils/wxjsInterface';
import { weixinLogin } from '@/api/user.js';
import { getQueryString } from '@/utils/index';
import { MessageBox } from 'mint-ui';
import { redirectAfterLogin } from '@/api/user';
export default {
  data() {
    return {};
  },
  methods: {
    LoginAnRedirect() {
      let _self = this;
      let code = getQueryString('code');
      if (code) {
        wxjs.init(code).then(rs => {
          if (rs.wxconfig.openid) {
            sessionStorage.setItem('wxopenid', rs.wxconfig.openid);
          }
          let unionId = rs.wxconfig.unionid;
          if (unionId) {
            weixinLogin(unionId).then(res => {
              if (res.code === 0) {
                let data = res.data;
                let returnUrl = sessionStorage.getItem('returnUrl');
                sessionStorage.removeItem('returnUrl');
                redirectAfterLogin(data, returnUrl);
              } else {
                let msg = `${res.message} 是否使用账号密码登录？`;
                MessageBox.confirm(msg, '提示', {
                  cancelButtonText: '去绑定'
                }).then(() => {
                  _self.$router.push('/login');
                }).catch(() => {
                  sessionStorage.setItem('redirectUrl', '/weixin/entry');
                  _self.$router.push({
                    path: '/theThirdParty/binding',
                    query: {
                      openid: unionId
                    }
                  }
                  );
                });
              }
            });
          } else {
            MessageBox.confirm('微信unionId获取失败，是否重试？', '提示').then(() => {
              _self.$router.push('/weixin/entry');
            });
          }
        });
      } else {
        MessageBox.alert('获取用户Code失败', '提示');
      }
    },
  },
  created() {
    let entry = sessionStorage.getItem('entry');
    sessionStorage.removeItem('entry');
    if (entry === 'weixin') { // 微信登录入口
      this.LoginAnRedirect();
    } else { // 回退或其他情况
      this.$router.replace({
        path: '/weixin/hub'
      });
    }
  }
};
</script>

