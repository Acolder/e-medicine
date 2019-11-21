<template>
  <div></div>
</template>
<script>
import wxjs from '@/utils/wxjsInterface';
export default {
  data() {
    return {};
  },
  created() {
    let url = `${process.env.WEB_HOST}/registe`;
    console.log(url);
    let link = wxjs.getOpenIdUrl(url);
    // sessionStorage.setItem('entry', 'weixin');
    location.replace(link);
  }
};
</script>
