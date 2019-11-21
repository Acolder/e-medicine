/**
 * Created by lven on 2018/6/27.
 */
// 思路:先存储,在获取,获取十条.
// 1.存储
export function addPharmacistChats(targetId, chat) {
  let pharmacistChats = JSON.parse(localStorage.getItem('pharmacistChats')) ||
    {};
  if (pharmacistChats[targetId]) {
    pharmacistChats[targetId].list.push(chat);
  } else {
    pharmacistChats[targetId] = { list: [] };
    pharmacistChats[targetId].list.push(chat);
  }
  localStorage.setItem('pharmacistChats', JSON.stringify(pharmacistChats));
}
// 2.获取
export function getPharmacistChats(targetId) {
  let chat = JSON.parse(localStorage.getItem('pharmacistChats')) || '';
  if (chat[targetId] && chat[targetId].list) {
    return chat[targetId].list.slice(-10);
  } else {
    return [];
  }
}
export function addAskDoctorChats(targetId, chat) {
  let pharmacistChats = JSON.parse(sessionStorage.getItem('askDoctor')) || {};
  if (pharmacistChats[targetId]) {
    pharmacistChats[targetId].list.push(chat);
  } else {
    pharmacistChats[targetId] = { list: [] };
    pharmacistChats[targetId].list.push(chat);
  }
  sessionStorage.setItem('askDoctor', JSON.stringify(pharmacistChats));
}
// 2.获取
export function getAskDoctorChats(targetId) {
  let chat = sessionStorage.getItem('askDoctor');
  if (chat) {
    chat = JSON.parse(chat);
    if (chat[targetId] && chat[targetId].list) {
      return chat[targetId].list.slice(-10);
    }
  }
  return [];
}
