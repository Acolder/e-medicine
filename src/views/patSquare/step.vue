<template>
  <div>
    <mt-header fixed title="在线抓药流程">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="page">
      <div class="list">
        <img src="./imgs/icon_sccf.png" alt="">
        <div class="listTxt">
          <div class="txtTop">上传处方</div>
          <div class="txtBot">上传处方图片,支持手写、机打处方</div>
        </div>
      </div>
      <div class="line">
        <p></p>
      </div>
      <div class="list">
        <img src="./imgs/icon_ysshcf.png" alt="">
        <div class="listTxt">
          <div class="txtTop">医师审核处方</div>
          <div class="txtBot">医师24小时内进行计价、审核</div>
        </div>
      </div>
      <div class="line">
        <p></p>
      </div>
      <div class="list">
        <img src="./imgs/icon_qrcfxx.png" alt="">
        <div class="listTxt">
          <div class="txtTop">确认处方信息</div>
          <div class="txtBot">确认处方信息后支付服务费</div>
        </div>
      </div>
      <div class="line">
        <p></p>
      </div>
      <div class="list">
        <img src="./imgs/icon_zffwf.png" alt="">
        <div class="listTxt">
          <div class="txtTop">支付服务费</div>
          <div class="txtBot">服务费包含药材费用及物流费用</div>
        </div>
      </div>
      <div class="line">
        <p></p>
      </div>
      <div class="list">
        <img src="./imgs/icon_wlps.png" alt="">
        <div class="listTxt">
          <div class="txtTop">等待物流配送上门</div>
          <div class="txtBot">一般情况下，将在支付服务费后的次日发货</div>
        </div>
      </div>
      <div class="patSquare" @click="patSquare()">去抓药</div>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
    };
  },
  methods: {
    // 拍方抓药
    patSquare() {
      this.$router.push('/patSquare/index');
      /* eslint-disable */
    },
  },
  // created() {
  // },
};
</script>
<style lang="less" scoped>
.page{
  position: absolute;
  top: 44px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: url(imgs/bg_gylc.jpg);
  background-size: 100% 100%;
  background-position-y: -60px;
  padding: 0 50px;
  padding-top: 25px;
}
.list{
  height: 80px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(136, 95, 83, 0.2);
  border-radius: 2px;
  display: flex;
  padding:0 15px;
  // align-items: center;
  padding-top: 13px;
  img{
    width: 45px;
    height: 45px;
  }
  .listTxt{
    flex: 1;
    padding-left: 15px;
    .txtTop{
      height: 15px;
      line-height: 15px;
      color: #a26654;
      font-size: 15px;
      margin-bottom: 10px;
    }
    .txtBot{
      height: 30px;
      line-height: 15px;
      font-size: 12px;
      color: #666666;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
.line{
  height: 25px;
  display: flex;
  justify-content: center;
  p{
    width: 1px;
    height: 25px;
    background-color: #b5654d;
  }
}
.patSquare{
  margin-top: 30px;
  margin-bottom: 20px;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  background-color: #d74949;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}
</style>