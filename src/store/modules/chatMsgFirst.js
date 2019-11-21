// import { setToken, setRongcloudtoken } from '@/utils/auth';
const chatMsgFirst = {
  state: {
    messages: []
  },
  mutations: {
    APPEND_MSG_First: (state, msg) => {
      state.messages.push(msg);
    }
  },
  actions: {
    appendMsgFirst({ commit }, msg) {
      commit('APPEND_MSG', msg);
    }
  }
};
export default chatMsgFirst;
