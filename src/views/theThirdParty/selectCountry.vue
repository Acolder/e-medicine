<template>
  <div id="selectCountry">
    <mt-header title="地区选择">
      <mt-button slot="left" icon="back" @click="$router.go(-1);"></mt-button>
    </mt-header>
    <div class="chatList" id="page" v-if="countryList.length!==0">
      <div class="item" v-for="(object) in countryList" :key='object.id'
           @click="handleClick(object)">
        <div>{{object.country}}</div>
        <div>{{object.code}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import ajax from '@/utils/ajax';
import { Header }  from 'mint-ui';
export default {
  name: 'selectCountry',
  components: {
    'mt-header': Header,
  },
  data() {
    return {
      countryList: []
    };
  },
  methods: {
    handleClick(objec) {
      localStorage.setItem('area', JSON.stringify(objec));
      this.$router.back(-1);
    },
    getCountryList() {
      ajax.get('/api/system/getMobileCountryCode').then((respose) => {
        if (respose.data.code === 0) {
          this.countryList = respose.data.data;
          console.info('国际手机区号', respose);
        }
      });
    }
  },
  mounted: function () {
    this.getCountryList();
  }
};
</script>
<style scoped>
  #page {
    /* padding: 0 15px; */
    padding-top: 44px;
    background: #f5f5f5;
  }
  .item {
    display: flex;
    line-height: 50px;
    border-bottom: 1px solid #B9B9B9;
    justify-content: space-between;
    color: #B9B9B9;
    padding: 0 15px;
    background: #fff;
  }
  .item:nth-child(4) {
    margin-bottom: 15px;
    border-bottom: none;
  }
</style>
