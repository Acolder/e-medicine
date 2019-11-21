// import { setToken, setRongcloudtoken } from '@/utils/auth';
const charMsg = {
  state: {
    messages: [],
    chatMsgFirst: [],
    consult: {}
  },
  mutations: {
    APPEND_MSG: (state, msg) => {
      state.messages.push(msg);
    },
    GET_MSG: (state, msg) => {
      state.messages = msg;
    },
    CLEAR_MSG: (state, msg) => {
      state.messages = [];
    },
    APPEND_MSG_First: (state, msg) => {
      state.chatMsgFirst.push(msg);
    },
    SET_MSG_First: (state, msg) => {
      state.chatMsgFirst = msg;
    },
    SET_Consult: (state, msg) => {
      state.consult = msg;
    },
    INSERT_MSG: (state, msg) => {
      state.messages.unshift(msg);
    }
  },
  actions: {
    appendMsg({ commit }, msg) {
      commit('APPEND_MSG', msg);
    },
    getMsg({ commit }, msg) {
      commit('GET_MSG', msg);
    },
    clearMsg({ commit }, msg) {
      commit('CLEAR_MSG', msg);
    },
    // 第一次进入页面
    appendMsgFirst({ commit }, msg) {
      commit('APPEND_MSG_First', msg);
    },
    // 设置第一次进入页面聊天信息
    setMsgFirst({ commit }, msg) {
      commit('SET_MSG_First', msg);
    },
    // 第一次进入页面,病人信息
    setConsult({ commit }, msg) {
      commit('SET_Consult', msg);
    },
    // 插入历史消息
    insertMsg({ commit }, msg) {
      commit('INSERT_MSG', msg);
    }
  }
};
export default charMsg;
