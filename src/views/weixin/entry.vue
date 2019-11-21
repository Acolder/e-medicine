<template>
  <div></div>
</template>
<script>
import wxjs from '@/utils/wxjsInterface';
import { getToken } from '@/utils/auth';
export default {
  data() {
    return {};
  },
  methods: {
    login() {
      let token = getToken();
      if (token) {
        this.$router.replace({
          path: '/'
        });
      } else {
        let url = `${process.env.WEB_HOST}/weixin/transfer`;
        let link = wxjs.getOpenIdUrl(url);
        sessionStorage.setItem('entry', 'weixin');
        location.href = link;
      }
    }
  },
  created() {
    this.login();
  }
};
</script>
