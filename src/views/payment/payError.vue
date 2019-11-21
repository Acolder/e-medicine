<template>
  <div>
    <mt-header fixed title="支付失败">
      <!-- <mt-button icon="back" slot="left" onclick="history.go(-1)"></mt-button> -->
    </mt-header>
    <div class="page">
      <div class="payErrorIcon">
        <!-- <img src="./imgs/icon_cg.png" alt=""> -->
        <i class="mint-toast-icon mintui mintui-field-error pay-error-icon"></i>
      </div>
      <div class="payTxt">支付失败，请重新支付</div>
      <div class="payBtn" @click="goPay">继续支付</div>
      <div class="payBtn" @click="goIndex">返回首页</div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import ajax from '@/utils/ajax';
// import doctorAjax from '@/utils/doctorAjax';
export default {
  data: function () {
    return {
      openId: this.$route.query.openId,
      bgColor: true,
      // 支付订单信息
      weixinPayMsg: {
        orderId: '', // 订单号
        orderPrice: '', // 付款金额
        Category: '', // 商品：product 处方：prescription, 脉诊仪:jinmu
        StoreName: '', // 药店名称 已兼容旧版本
      },
    };
  },
  methods: {
    // 继续支付
    goPay() {
      console.log('继续支付');
      if (this.bgColor === false) {
        return false;
      }
      this.bgColor = false;
      let data = {
        PayType: 2, // 支付类型
        OrderId: this.weixinPayMsg.orderId, // 订单号
        PayFee: this.weixinPayMsg.orderPrice, // 付款金额
        OpenId: this.openId, // 公众号、小程序必传oo8No013EgwlLLMCt_G4bGwhbXjo
        Category: this.weixinPayMsg.Category, // 商品：product 处方：prescription, 脉诊仪:jinmu
        StoreName: this.weixinPayMsg.StoreName, // 药店名称 已兼容旧版本
      };
      // 在微信内置浏览器中直接调用微信内支付
      console.log('微信内支付参数', data);
      ajax.post('/api/pay/wxpay', data).then(res => {
        console.log('微信内提交支付返回结果', res);
        if (res.status === 200 && res.data.code === 0) {
          this.weixinPay(res.data.data);
        }
      });
    },
    // 微信内请求支付
    weixinPay(resData) {
      let that = this;
      console.log('进行微信内支付');
      function onBridgeReady() {
        /* eslint-disable */
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            'appId': resData.appid, //公众号名称，由商户传入
            'timeStamp': resData.timestamp, //时间戳，自1970年以来的秒数
            'nonceStr': resData.nonce_str, //随机串
            'package': resData.package, //订单详情扩展字符串
            // 'signType': resData.signType, //微信签名方式
            'signType': 'MD5',
            'paySign': resData.sign, //微信签名
          },
          function (res) {
            console.log(res);
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.bgColor = true;
              Toast('付款成功');
              // sessionStorage.removeItem('weixinPayMsg');
              that.$router.push('/payment/paySuccess?orderId=' + that.weixinPayMsg.orderId);
            }
            else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
              that.bgColor = true;
              Toast('付款取消');
              // that.$router.push('/payment/payError?openId=' + this.openId);
            } else {
              that.bgColor = true;
              Toast('付款失败');
              // that.$router.push('/payment/payError?openId=' + this.openId);
            }
          }
        );
      }
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
    // 返回首页
    goIndex() {
      console.log('返回首页');
      this.$router.push('/');
    },
  },
  created() {
    // 取出提交支付的参数
    if (JSON.parse(sessionStorage.getItem('weixinPayMsg'))) {
      this.weixinPayMsg = JSON.parse(sessionStorage.getItem('weixinPayMsg'));
      console.log('取出提交支付的参数', this.weixinPayMsg);
    }
  },
};
</script>
<style lang="less" scoped>
.page{
  position: absolute;
  top: 44px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  background: #fff;
}
.payErrorIcon{
  padding-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  .pay-error-icon {
    height: 50px;
    font-size: 60px;
    color: #333;
  }
}
.payTxt{
  padding: 0 10px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.payBtn{
  margin: 10px 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
  background: rgb(12, 205, 211);
}
</style>