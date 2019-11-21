// 保存分享的地址(防止登录后跳到主页)
const shareUrl = {
  state: {
    URL: ''
  },
  mutations: {
    SET_SHAREURL: (state, msg) => {
      state.URL = msg;
    },
    GET_SHAREURL: (state, msg) => {
      return state.URL;
    }
  },
  actions: {
    SETURL({ commit }, msg) {
      commit('SET_SHAREURL', msg);
    }
  }
};
export default shareUrl;
