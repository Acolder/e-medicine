<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    /* eslint-disable */
    document.title= '正在连接...';
    let url = 'https://es.echatsoft.com/visitor/pc/chat.html?companyId=463&echatTag=ezy-yaohulu';
    location.href = url;
  }
};
</script>

