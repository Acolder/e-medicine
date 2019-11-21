const unReadMsg = {
  state: {
    unReadMsg: null
  },
  mutations: {
    ADD_UNREADMSG: (state, unReadMsg) => {
      state.unReadMsg = unReadMsg;
    }
  },
  actions: {
    addUnreadMsg({ commit }, unReadMsg) {
      commit('ADD_UNREADMSG', unReadMsg);
    }
  }
};

export default unReadMsg;