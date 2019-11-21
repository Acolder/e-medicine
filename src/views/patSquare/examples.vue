<template>
  <div>
    <mt-header fixed title="处方示例">
      <a slot="left" @click="$router.go(-1)">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="examples">
      <div class="tips">
        <img src="./imgs/icon_tz.png" alt="" class="tipsImg">
        <p>请尽量保证上传的处方文字清晰可见，并保证红框内的信息完整不缺失</p>
      </div>
      <div class="tilTxt">手写的处方</div>
      <img src="./imgs/picture_sxcf.png" alt="">
      <div class="line10"></div>
      <div class="tilTxt">机打的处方</div>
      <img src="./imgs/xh_cfsl_zy.png" alt="">
      <div class="line10"></div>
      <img src="./imgs/xh_cfsl_xy.png" alt="">
      <div class="line10"></div>
      <img src="./imgs/xh_cfsl_gf.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.examples{
  position: absolute;
  top: 44px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  background: #fff;
  font-size: 14px;
  .tips{
    width: 100%;
    height: 46px;
    background-color: #b5654d;
    text-align: center;
    position: relative;
    img{
      width: 12px;
      height: 14px;
      position: absolute;
      top: 7.5px;
      left: 12vw;
      color: #fff;
    }
    p{
      width: 240px;
      text-align: left;
      color: #fff;
      font-size: 12px;
      position: absolute;
      left: 18vw;
      top: 7px;
      line-height: 16px;
    }
  }
}
.tilTxt{
  height: 38px;
  line-height: 38px;
  text-align: center;
  background-color: #f5f5f5;
  color: #d74948;
  font-size: 15px;
}
.line10{
  height: 10px;
  background-color: #eaeaea;
}
img{
  width: 100%;
  height: 100%;
}
</style>
