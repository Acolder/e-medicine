const getters = {
  phone: state => state.user.phone,
  chatMsg: state => state.chatMsg.messages,
  chatMsgFirst: state => state.chatMsg.chatMsgFirst,
  consultVX: state => state.chatMsg.consult,
  unReadMsg: state => state.unReadMsg.unReadMsg,
};
export default getters;
