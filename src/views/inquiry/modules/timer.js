/**
 * Created by lven on 2018/5/23.
 */
// 计时器:1.增长性计时 2.倒计时
let Timer = {
  time: {
    S: 0,
    M: 0,
    H: 0
  },
  timeID: '',
  setTime: function (T) {
    this.time = T;
  },
  getTime: function () {
    return this.time;
  },
  // usag:{oldTime:'毫秒值'},function:毫秒值转换成时间格式
  subtractingTime: function (oldTime) {
    let second = Math.ceil((new Date().getTime() - oldTime) / 1000);
    return this.secondToTime(second);
  },
  // function:秒转换成时间格式。
  secondToTime: function (time) {
    let second = parseInt(time, 10);
    let H = parseInt(second / 3600, 10);
    let M = parseInt((second - H * 3600) / 60, 10);
    let S = second % 60;
    console.info('subtractingTime:', {
      S: S,
      H: H,
      M: M
    });
    return {
      S: S,
      H: H,
      M: M
    };
  },
  run: function () {
    this.countUp(this.time);
  },
  countDown: function () {
    clearTimeout(this.timeID);
    this.timeID = setTimeout(() => {
      let T = this.time;
      T.M = T.S === 0 ? T.M - 1 : T.M;
      T.S = T.S !== 0 ? T.S - 1 : 59;
      this.setTime(T);
      this.print();
      this.countDown();
    }, 1000);
  },
  countUp: function () {
    clearTimeout(this.timeID);
    this.timeID = setTimeout(() => {
      let T = this.time;
      T.M = T.S === 59 ? T.M + 1 : T.M;
      T.S = T.S < 59 ? T.S + 1 : 0;
      this.setTime(T);
      this.print();
      this.countUp();
    }, 1000);
  },
  getModifyTime: function () {
    let TS = {
      hour: this.time.H < 10 ? '0' + this.time.H : this.time.H,
      minute: this.time.M < 10 ? '0' + this.time.M : this.time.M,
      second: this.time.S < 10 ? '0' + this.time.S : this.time.S
    };
    if (this.time.H === 0) {
      console.info(TS.minute + ':' + TS.second);
      return TS.minute + ':' + TS.second;
    } else {
      return TS.hour + ':' + TS.minute + ':' + TS.second;
    }
  },
  print: function () {
    // console.info(this.getModifyTime());
  }
};
// let time = {
//   S: 0,
//   M: 15,
//   H: 0
// };
// Timer.setTime(time);
// Timer.run();
export default Timer;

