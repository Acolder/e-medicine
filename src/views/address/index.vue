<template>
  <div>
    <mt-header fixed title="收货地址">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="pageMain">
      <div v-if="addressList.length>0">
        <div v-for="item in addressList" :key="item.index" class="listAddress" @click.stop="setDefault(item)">
          <div class="name-phone">
            <span class="name">{{item.addressName}}</span>
            <span class="phone">{{item.addressPhone}}</span>
          </div>
          <div class="addressTxt">
            收货地址：{{item.addressProvince+item.addressCity+item.addressDistrict+item.addressDetail+item.addressNum}}
          </div>
        </div>
        <div class="add_new_addr" @click="newAddress">
          使用新地址
        </div>
      </div>
      <div v-else class="empty_content">
        <img src="./imgs/icon_pla_queshengadd@2x.png" alt="">
        <h2 class="empty_desc">暂无收货地址~</h2>
        <div class="add_new_addr" @click="newAddress">
          使用新地址
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { goLogin } from '@/api/user';
import { Toast } from 'mint-ui';
import java from '@/utils/javaApiRequest';
import { getToken } from '@/utils/auth';
// import { goLogin } from '@/api/user';
// import { MessageBox } from 'mint-ui';
export default {
  data() {
    return {
      addressList: []
    };
  },
  methods: {
    // 获取收货地址列表
    getAddress() {
      console.log(getToken());
      java.post('/mall/address/queryAddress', { userToken: getToken() }).then((res) => {
        console.log('获取收货地址列表', res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.addressList = res.data.resultData;
        } else if (String(res.data.resultCode) === '-2') {
          // MessageBox.confirm('您未登录,是否前往登录?').then(action => {
          //   goLogin();
          // });
          Toast('用户未登录，请重新登录');
          goLogin();
        }
      });
    },
    // 使用新地址
    newAddress() {
      this.$router.push('/address/increaseAddress?isIncrease=1');
    },
    // 使用该收货地址
    setDefault(item) {
      console.log('使用该收货地址', item);
      sessionStorage.setItem('preservationAddress', JSON.stringify(item));
      if (item.addressId) {
        java.post('/mall/address/updateAddreesChecked', { 'userToken': getToken(), 'addressId': item.addressId, 'addressChecked': 1 }).then((res) => {
        // java.post('/mall/address/delAddress', { 'userToken': getToken(), 'addressId': item.addressId }).then((res) => {
          console.log('设置为默认地址', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            this.getAddress();
            this.$router.go(-1);
          } else if (String(res.data.resultCode) === '-2') {
            Toast('用户未登录，请重新登录');
            goLogin();
          }
        });
      } else {
        this.$router.go(-1);
      }
    },
  },
  created() {
    window.scrollTo(0, 0);
    this.getAddress();
  }
};
</script>
<style lang="less" scoped>
.pageMain{
  position: absolute;
  top: 44px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  background: #f5f5f5;
  font-size: 14px;
}
.listAddress{
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  .name-phone{
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
  }
  .addressTxt{
    padding: 0 10px;
    line-height: 30px;
  }
}
.add_new_addr {
  margin: 25px 10px;
  background: #d84a49;
  color: #ffffff;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
}
.empty_content {
  padding-top: 100px;
  img {
    width: 125px;
    height: 125px;
    display: block;
    margin: 0 auto;
    margin-bottom: 25px;
  }
  .empty_desc {
    font-size: 13px;
    color: #8e8e8e;
    margin-bottom: 25px;
    text-align: center;
  }
}
</style>
