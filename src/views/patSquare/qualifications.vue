<template>
  <div>
    <mt-header fixed title="相关资质">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="page">
      <img v-if="type == 1" src="./imgs/picture_wlyy@2x.png" alt="">
      <img v-if="type == 2" src="./imgs/picture_zhyf@2x.png" alt="">
      <img v-if="type == 3" src="./imgs/picture_zhyy@2x.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      type: this.$route.query.type
    };
  },
};
</script>
<style lang="less" scoped>
.page{
  position: absolute;
  top: 44px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background: #f5f5f5;
  img{
    width: 100%;
  }
}
</style>