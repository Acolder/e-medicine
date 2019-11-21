/**
 * Created by lven on 2018/6/12.
 */
import { getConsultInfo, getRongcloudtoken } from '@/utils/auth';
// 获取咨询类型
export function getConsultType() {
  let consult = getConsultInfo();
  let consultType;
  if (consult && consult.consultType === 0) {
    consultType = consult.consultType;
  } else {
    consultType = 1;
  }
  return consultType;
}
// 获取咨询类型
export function getRongyunParam() {
  // 正式坏境
  // let appKey = 'z3v5yqkbz1g30';
  // "Rong_Secret": "YuVFD0zQz1njKd"
  // 'rong_token': 'PYinuTaqZr3TwhoqNWnvWDnrVY5Z2p1KMgfWFYVZg6OGjT2AZYU0ViiB47q3gV0JHZXsLd9r/HoVVSIKmA+Hn+o1FYo2UzZ5VK16uQCthIMoT9cdlnNexQ=='
  // 测试坏境
  // let appKey = 'lmxuhwagli3md';
  // let token = '0OmR1B6ycYMBzDmb1h8CamggL3VocKlVR7/eZsJrgXqIP/3NIEA0qIuGoZyOF5c5/J0r0IryqzozgwMXB9BWH7nefrZOxfHqjSIUdVkyzs/lJfW8lIIhoA==';
  // 当前环境
  let appKey = process.env.RONGYUN_APPKEY;
  let token = getRongcloudtoken();
  return {
    appKey: appKey,
    token: token
  };
}

