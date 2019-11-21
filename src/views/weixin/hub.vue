<template>
  <div class="btn-wrapper">
     <mt-button type="default" :plain="true" @click.native="home">进入首页</mt-button>
     <mt-button type="primary" :plain="true" @click.native="weixinLogin">微信登录</mt-button>
     <mt-button type="danger" :plain="true" @click.native="accountLogin">账号登录</mt-button>
  </div>
</template>
<script>
import wxjs from '@/utils/wxjsInterface';
export default {
  data() {
    return {};
  },
  methods: {
    home() {
      this.$router.push({
        path: '/',
      });
    },
    weixinLogin() {
      let url = `${process.env.WEB_HOST}/weixin/transfer`;
      let link = wxjs.getOpenIdUrl(url);
      sessionStorage.setItem('entry', 'weixin');
      location.href = link;
    },
    accountLogin() {
      this.$router.push({
        path: '/login',
      });
    }
  },
};
</script>
<style lang="less" scoped>
.btn-wrapper {
  height: 200px;
  width: 100%;
  position: absolute;
  top: 50%;
  margin-top: -100px;
  text-align: center;
  button {
    width: 80%;
    margin-top:20px;
  }
}
</style>
