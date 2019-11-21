<template>
  <div></div>
</template>
<script>
import { getQueryString } from '@/utils/index';
import { setToken, getToken, setRongcloudtoken, getRongcloudtoken } from '@/utils/auth';
import { goLogin, intoInquiry } from '@/api/user';
import { mapActions } from 'vuex';
export default {
  name: 'index',
  data() {
    return {};
  },
  mounted() {
    this.getParams();
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ]),
    getParams() {
      let consultSource = getQueryString('consultSource'); // 聊天来源: 1药葫芦 2问诊室 3药柜 4药箱 5电商
      let userToken = getQueryString('userToken'); // 用户token
      let rongyunToken = getQueryString('rongyunToken'); // 融云token
      let visitUrl = getQueryString('visitUrl'); // 回退url
      if (visitUrl && visitUrl.length > 0) {
        sessionStorage.setItem('visitUrl', JSON.stringify(visitUrl));
      } else {
        // let storageVisitUrl = sessionStorage.getItem('visitUrl');
        // if (storageVisitUrl) {
        //   sessionStorage.removeItem('visitUrl');
        // }
      }
      if (consultSource) {
        sessionStorage.setItem('consultSource', JSON.stringify(consultSource));
      } else if (!consultSource && !JSON.parse(sessionStorage.getItem('consultSource'))) {
        sessionStorage.setItem('consultSource', JSON.stringify(1));
      }
      // alert(userToken);
      // alert(rongyunToken);
      if (userToken) {
        setToken(userToken);
      } else if (!userToken && !getToken()) {
        goLogin();
        return false;
      }
      if (rongyunToken) {
        setRongcloudtoken(decodeURIComponent(rongyunToken));
      } else if (!rongyunToken && !getRongcloudtoken()) {
        goLogin();
        return false;
      }
      this.getUserInfo().then(res => {
        console.log('获取用户信息成功');
      });
      // 进入问诊
      intoInquiry(2);
    }
  }
};
</script>
<style lang="less" scoped>
</style>

