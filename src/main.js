// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import 'mint-ui/lib/style.css';
import App from './App';
import mint from 'mint-ui';
import router from './router';
import store from './store';
import VueScroller from 'vue-scroller';

Vue.config.productionTip = false;

Vue.use(mint);
Vue.use(VueScroller);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
