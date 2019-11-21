<template>
  <div>
    <mt-header fixed title="新增地址">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="pageMain">
      <div class="item contacts">
        <div class="itemLeft">
          联系人
        </div>
        <div class="itemRight">
          <div class="name">
            <input type="text" v-model.trim="address.addressName" placeholder="姓名">
          </div>
          <div class="sex">
            <div class="btn" :class="{active:address.gender == '男'}" @click="sex('男')">先生</div>
            <div class="btn" :class="{active:address.gender == '女'}" @click="sex('女')">女士</div>
          </div>
        </div>
      </div>
      <div class="item telephone">
        <div class="itemLeft">
          电话
        </div>
        <div class="itemRight">
          <input type="text" placeholder="手机号码" v-model.trim="address.addressPhone" @blur="phoneNum()">
        </div>
      </div>
      <div class="item address" @click='selectAddress'>
        <div class="itemLeft">地址</div>
        <div class="itemRight description" :class="{huisi:long_address ==='请选择地址'}">{{long_address}}</div>
        <img class="addressIcon" src="./imgs/icon-r.png" alt="">
      </div>
      <!-- <div class="item houseNumber">
        <div class="itemLeft">
          门牌号
        </div>
        <div class="itemRight">
          <input type="text"  v-model.trim="address.addressDetail" placeholder="详细地址">
        </div>
      </div> -->
      <div class="item houseNumber">
        <div class="itemLeft">
          门牌号
        </div>
        <div class="itemRight">
          <textarea type="text"  v-model.trim="address.addressDetail" placeholder="详细地址"></textarea>
        </div>
      </div>
      <div class="preservation" :class="bgColor?'': 'huisi'" @click="preservation">保存</div>
      <address-picker :addressShow="addressShow" @ok="ok" @cancel="addressShow=false"></address-picker>
    </div>
  </div>
</template>
<script>
import { locate, getAddress } from '@/api/addressMgr';
import addressPicker from '../../components/addressPicker/address-picker.vue';
import { Toast } from 'mint-ui';
import { getUserInfo, goLogin } from '@/api/user';
// import BMap from 'BMap';
import java from '@/utils/javaApiRequest';
import { getToken } from '@/utils/auth';
export default {
  data: function () {
    return {
      isIncrease: this.$route.query.isIncrease ? this.$route.query.isIncrease : '0',
      addressShow: false,
      bgColor: true,
      address: {
        'addressName': '',
        // 'addressSex': 0,
        'addressPhone': '',
        'addressProvince': '省',
        'addressCity': '市',
        'addressDistrict': '区',
        'addressDetail': '',
        'addressNum': '',
        'totalAddress': '',
        'longitude': '0',
        'latitude': '0',
        'gender': '男',
        'userToken': ''
      },
    };
  },
  computed: {
    long_address() {
      if (this.address.addressProvince !== '省') {
        return this.address.addressProvince + ' ' + this.address.addressCity + ' ' + this.address.addressDistrict;
      } else {
        return '请选择地址';
      }
    },
    detailedAddress() {
      return this.address.addressProvince + ' ' + this.address.addressCity + ' ' + this.address.addressDistrict + ' ' + this.address.addressDetail;
    }
  },
  components: {
    'address-picker': addressPicker
  },
  methods: {
    // 性别
    sex(val) {
      this.address.gender = val;
    },
    // 输入手机号
    phoneNum() {
      if (this.address.addressPhone === '') {
        Toast({
          message: '请输入手机号',
          position: 'middle',
          duration: 1000
        });
      } else {
        return;
      }
    },
    // 选择地址
    selectAddress() {
      this.addressShow = true;
    },
    // 选择地址事件
    ok(address) {
      this.addressShow = false;
      console.log('选择地址事件address', address);
      this.address.addressProvince = address.province;
      this.address.addressCity = address.city;
      this.address.addressDistrict = address.town;
    },
    // 保存
    preservation() {
      this.address.totalAddress = this.detailedAddress;
      if (!this.verify()) {
        return;
      }
      sessionStorage.setItem('preservationAddress', JSON.stringify(this.address));
      if (this.isIncrease === '0') {
        this.$router.go(-1);
      } else {
        if (this.bgColor === false) {
          return false;
        }
        let url = '/mall/address/save';
        let userToken = getToken();
        this.address.userToken = userToken;
        this.bgColor = false;
        console.log('保存地址参数', this.address);
        java.post(url, this.address).then((res) => {
          console.log('保存地址结果', res);
          if (res.status === 200 && res.data.resultCode === '0') {
            Toast({
              message: res.data.msg,
              position: 'middle',
              duration: 1500
            });
            java.post('/mall/address/updateAddreesChecked', { 'userToken': getToken(), 'addressId': res.data.resultData.addressId, 'addressChecked': 1 }).then((a) => {
              console.log('设置为默认地址', a);
              if (a.data && a.data.resultCode === '0') {
                this.bgColor = true;
                this.$router.go(-1);
              } else if (String(res.data.resultCode) === '-2') {
                Toast('用户未登录，请重新登录');
                goLogin();
              }
            });
          } else if (String(res.data.resultCode) === '-2') {
            Toast('用户未登录，请重新登录');
            goLogin();
          }
        });
      }
    },
    verify() {
      let nameReg = /[^a-zA-Z0-9_\u4e00-\u9fa5]/g;
      if (!this.address.addressName) {
        Toast({
          message: '请填写收件人姓名！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (this.address.addressName.length > 200) {
        Toast({
          message: '姓名不能超过200个字！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (nameReg.test(this.address.addressName)) {
        Toast({
          message: '姓名不支持特殊符号！',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      let myreg = /^[1][0-9]{10}$/;
      if (!this.address.addressPhone) {
        Toast({
          message: '请填写手机号码！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (!myreg.test(this.address.addressPhone)) {
        Toast({
          message: '请填写有效的手机号码！',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      if (!this.long_address || this.long_address === '请选择地址') {
        Toast({
          message: '请选择省市区',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      if (!this.address.addressDetail) {
        Toast({
          message: '请填写详细地址！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (nameReg.test(this.address.addressDetail)) {
        Toast({
          message: '详细地址不支持特殊符号！',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      if (this.address.addressDetail && (this.address.addressDetail.length > 60 || this.address.addressDetail.length < 4)) {
        Toast({
          message: '详细地址必须在4至60个字之间',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      return true;
    },
    // 获取用户信息
    getInfo() {
      getUserInfo().then(res => {
        console.log('用户信息', res);
        if (res.status === 200 && res.data.code === 0) {
          this.address.addressPhone = res.data.data.mobile;
        }
      });
    },
    // 定位
    reLocate() {
      console.log('开始定位');
      locate().then((res) => {
        console.log(res);
        getAddress(res).then((a) => {
          console.log(a);
          this.address.addressProvince = a.province;
          this.address.addressCity = a.city;
          this.address.addressDistrict = a.district;
          this.address.addressDetail = a.street + a.streetNumber;
        });
      });
    },
  },
  created() {
    window.scrollTo(0, 0);
    this.reLocate();
    this.getInfo();
    // if (JSON.parse(sessionStorage.getItem('preservationAddress'))) {
    //   let temData = JSON.parse(sessionStorage.getItem('preservationAddress'));
    //   this.address.addressName = temData.addressName;
    //   this.address.addressPhone = temData.addressPhone;
    //   this.address.addressProvince = temData.addressProvince;
    //   this.address.addressCity = temData.addressCity;
    //   this.address.addressDistrict = temData.addressDistrict;
    //   this.address.addressDetail = temData.addressDetail;
    //   this.address.addressNum = temData.addressNum;
    // }
  },
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
input,textarea{
  font-size: 14px;
  border: none;
}
.item{
  display: flex;
  border-bottom:1px solid #e0e0e0;
  padding-left:10px;
  background: #ffffff;
  position: relative;
  .itemLeft{
    width: 100px;
    height: 44px;
    line-height: 44px;
    color: #000;
  }
  .itemRight{
    flex:1;
    height: 100%;
  }
}
.contacts{
  height: 88px;
  .name,.sex{
    height: 44px;
    padding-right: 10px;
  }
  .name{
    border-bottom:1px solid #e0e0e0;
    input{
      width: 100%;
      height: 100%;
    }
  }
  .sex{
    display: flex;
    align-items: center;
    .btn{
      width: 60px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      border-radius: 5px;
      border: 1px solid #ccc;
      color: #ccc;
      margin-right: 10px;
    }
    .btn.active{
      color: #ffffff;
      background: #787878;
      border: none;
    }
  }
}
.telephone{
  height: 44px;
  input{
    width: 100%;
    height: 100%;
  }
}
.description{
  line-height: 44px;
}
.description.huisi{
  color: #ccc;
}
.addressIcon{
  position: absolute;
  width: 8px;
  height: 15px;
  right: 10px;
  top: 10px;
}
.houseNumber{
  height: 60px;
  textarea{
    width: 100%;
    height: 100%;
    border: none;
    line-height: 30px;
  }
}
.preservation{
  margin: 25px 10px;
  background: #d84a49;
  color: #ffffff;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
}
.submit_btn.huisi{
  background: #ccc;
}
</style>