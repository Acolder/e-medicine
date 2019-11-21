import wxjs from '@/utils/wxjsInterface';
export function goPay() {
  let url = `${process.env.WEB_HOST}/payment/index`;
  let link = wxjs.getOpenIdUrl(url);
  location.href = link;
}