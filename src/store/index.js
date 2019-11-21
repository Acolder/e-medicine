import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import user from './modules/user';
import chatMsg from './modules/chatMsg';
import unReadMsg from './modules/unreadMsg';
import shareUrl from './modules/share';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    chatMsg,
    unReadMsg,
    shareUrl
  },
  getters
});

export default store;
