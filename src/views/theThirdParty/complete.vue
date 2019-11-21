<template>
  <div>
    <mt-header fixed title="绑定完成">
    </mt-header>
    <div class="page">
      <div class="payIcon">
        <i class="mint-toast-icon mintui mintui-field-success pay-success-icon"></i>
      </div>
      <div class="completeTxt">
        <span>恭喜您绑定完成！</span><router-link to="/weixin/entry"><a>>>微信登录</a></router-link>
      </div>
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
.payIcon{
  padding-top: 165px;
  display: flex;
  justify-content: center;
  align-items: center;
  .pay-success-icon {
    height: 90px;
    font-size: 90px;
    color: #0CCDD3;
  }
}
.completeTxt{
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  text-align: center;
  a {
    color: #0CCDD3;
  }
}
</style>
