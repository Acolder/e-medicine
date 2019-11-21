<template>
  <div>
    <mt-header fixed :title="title">
      <mt-button icon="back" slot="left" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="page">
      <div>
        <div class="payErrorIcon">
          <i class="mint-toast-icon mintui mintui-field-success pay-success-icon"></i>
        </div>
        <div class="payTxt">支付完成</div>
        <div class="payBtn" @click="goIndex">返回首页</div>
        <div class="payBtn" @click="seeOrder">查看订单</div>
      </div>
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
      title: '支付完成',
      orderId: this.$route.query.orderId,
      orderInfo: {},
    };
  },
  methods: {
    // 查询订单状态
    getOrderState() {
      // let _this = this;
      ajax.get('/api/pay/GetOrderStatus/' + this.orderId).then(res => {
        console.log('订单状态', res);
        if (res.status === 200 && res.data.code === 0) {
          this.orderState = res.data.data;
          if (res.data.data === 1) {
            let orderSource = localStorage.getItem('Order-Source');
            if (orderSource) {
              orderSource = JSON.parse(orderSource);
              localStorage.removeItem('Order-Source');
              // alert('存储2:' + orderSource.orderId);
              // alert('跳转2:' + _this.orderId);
              // 从在线问诊跳转过来，需发送自定义消息
              let consults = JSON.parse(sessionStorage.getItem('consultData'));
              // 定义消息类型
              let messageName = 'UnknownMessage'; // 消息名称。
              let objectName = 'app:dialecticalPresc'; // 消息内置名称，请按照此格式命名。
              let mesasgeTag = new RongIMLib.MessageTag(true, true);// 消息是否保存是否计数，true true 保存且计数，false false 不保存不计数。
              let prototypes = ['content']; // 消息类中的属性名。
              RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
              // 发送自定义消息
              let conversationType = RongIMLib.ConversationType.GROUP; //单聊,其他会话选择相应的消息类型即可。
              let targetId = consults.groupid; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id。
              let description = '你已确认了' + consults.realname + '开出的调理处方';
              let data = { orderId: orderSource.orderId, description: description, status: 1 };
              data = JSON.stringify(data);
              alert('发送融云消息');
              let msg = new RongIMClient.RegisterMessage.UnknownMessage({ content: data });
              alert('消息发送');
              RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess: function (message) {
                  console.info('订单已确认!');
                  alert('自定义消息发送成功!');
                },
                onError: function (errorCode) {
                  console.log('发送自定义消息失败');
                  alert('自定义消息发送失败!');
                }
              });
            }
            sessionStorage.removeItem('weixinPayMsg');
            Toast('订单付款成功');
          }
        }
      });
    },
    // 返回首页
    goIndex() {
      console.log('返回首页');
      this.$router.push('/');
    },
    // 查看订单
    seeOrder() {
      console.log('查看订单');
      this.$router.push('/prescription/prescription_detail?order_id=' + this.orderId);
    },
  },
  created() {
    this.getOrderState();
  }
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
  .pay-success-icon {
    height: 50px;
    font-size: 60px;
    color: #0CCDD3;
  }
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