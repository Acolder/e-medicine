<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// import { FONTSIZE } from './flexible';
import { SHARE } from '@/utils/share.js';
export default {
  name: 'App',
  watch: {
    $route(newVal, oldVal) {
      // 监听路由的变化配置页面待分享的信息
      console.log(location.href);
      SHARE(location.href, '', newVal.meta.title, this);
    }
  }
};
</script>

<style>
@import './styles/reset.css';
@import './styles/basic.css';
@import 'mint-ui/lib/style.css';
</style>
<style lang="less">
  @import './styles/common.less';
  @max-width: 600px;
  #app {
    max-width: @max-width;
    margin: 0 auto;
    position: relative;
  }
  .mint-header {
    max-width: @max-width;
    margin: 0 auto;
  }
  .nav-bar {
    max-width: @max-width;
    margin:0 auto;
  }
  footer.bottom-input {
    max-width: @max-width;
  }
  .mint-msgbox {
    max-width: @max-width;
  }
</style>
