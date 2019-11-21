<template>
    <div class="inquiry-entrance" @click="goInquiry">
        <img src="./img/icon-zxwz.png">
    </div>
</template>
<script>
import { intoInquiry } from '@/api/user';
export default {
  methods: {
    goInquiry() {
      intoInquiry();
    }
  }
};
</script>
<style lang="less" scoped>
    .inquiry-entrance{
        position: fixed;
        right: -5px;
        bottom: 50px;
        z-index: 3;
        img{
            width: 66px;
        }
    }
</style>
