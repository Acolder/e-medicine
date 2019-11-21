<template>
  <div class="buyingMedicine" style="">
    <mt-header fixed title="在线抓药">
      <mt-button icon="back" slot="left" @click="back()"></mt-button>
      <mt-button slot="right">
        <div class="myList" @click="prescriptionOrder">抓药服务单</div>
      </mt-button>
    </mt-header>
    <div class="pageMain">
      <!-- tab -->
      <div class="tabs">
        <mt-navbar v-model="prescriptionInfo.prescr_type">
          <mt-tab-item id="0">中药处方</mt-tab-item>
          <mt-tab-item id="2">膏方</mt-tab-item>
        </mt-navbar>
      </div>
      <div class="line"></div>
      <!-- 上传 -->
      <div class="uploadBox">
        <div class="imgBox">
          <uploadImg :imgUrl="prescriptionInfo.imageUrl" :fileName="'Image'" :isMaxIMg="'1'" @uploadSuccess="addImgUrl" @removeImg="removeImgUrl"></uploadImg>
        </div>
        <div class="txtbox">
          药师将在24小时内进行审方、计价,并通过消息通知您支付服务费
        </div>
      </div>
      <div class="line"></div>
      <div class="listItem">
        <div class="itemLeft">
          <span>剂数</span>
          <img src="./imgs/xh_icon_cfsl.png" class="questioMnark" alt="" @click="dose">
        </div>
        <div class="itemRight dose">
          <img src="./imgs/iconxh_minus.png" alt="" @click="reduce()">
          <span class="number">{{prescriptionInfo.suffering_num}}</span>
          <img src="./imgs/iconxh_add.png" alt="" @click="add()">
        </div>
      </div>
      <div class="listItem">
        <div class="itemLeft">
          <span>患者手机号</span>
        </div>
        <div class="itemRight telephone">
          <input type="text" placeholder="请输入联系方式" v-model="prescriptionInfo.phone" @focus="phoneFocus" @blur="phoneBlur()">
        </div>
      </div>
      <div class="listItem">
        <div class="itemLeft">
          <span>是否怀孕</span>
        </div>
        <div class="itemRight">
          <div class="pregnant">
            <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_pregnant == 1" @click="toOther(1)">
            <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toOther(1)">
            <span>是</span>
          </div>
          <div class="pregnant">
            <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_pregnant == 0" @click="toOther(0)">
            <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toOther(0)">
            <span>否</span>
          </div>
        </div>
      </div>
      <div class="listItem" v-if="prescriptionInfo.prescr_type == 0">
        <div class="itemLeft">
          <span>是否代煎</span>
          <!-- <img src="./imgs/xh_icon_cfsl.png" class="questioMnark" alt="" @click="decoct"> -->
        </div>
        <div class="itemRight">
          <div class="decoctingMedicine">
            <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_suffering == 1" @click="otherTHREE(1)">
            <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="otherTHREE(1)">
            <span>是</span>
          </div>
          <div class="decoctingMedicine">
            <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_suffering == 0" @click="otherTHREE(0)">
            <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="otherTHREE(0)">
            <span>否</span>
          </div>
        </div>
      </div>
      <div v-if="prescriptionInfo.prescr_type == 2">
        <div class="listItem">
            <div class="itemLeft">
            <span>盛装方式</span>
          </div>
          <div class="itemRight">
            <div class="pregnant">
              <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_bottled == 1" @click="toCostumes(1)">
              <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toCostumes(1)">
              <span>瓶装</span>
            </div>
            <div class="pregnant">
              <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.is_bottled == 0" @click="toCostumes(0)">
              <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toCostumes(0)">
              <span>袋装</span>
            </div>
          </div>
        </div>
        <div class="listItem">
            <div class="itemLeft">
            <span>口感</span>
          </div>
          <div class="itemRight">
            <div class="pregnant">
              <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.taste_type == 1" @click="toTexture(1)">
              <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toTexture(1)">
              <span>正常</span>
            </div>
            <div class="pregnant">
              <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.taste_type == 2" @click="toTexture(2)">
              <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toTexture(2)">
              <span>微甜</span>
            </div>
            <div class="pregnant">
              <img src="./imgs/iconxh_gy_elect.png" alt="" v-if="prescriptionInfo.taste_type == 3" @click="toTexture(3)">
              <img src="./imgs/iconxh_gy_nomal.png" alt="" v-else @click="toTexture(3)">
              <span>偏甜</span>
            </div>
          </div>
        </div>
      </div>
      <div class="remark">
        <p>备注<span>(选填)</span></p>
        <textarea v-model.trim="prescriptionInfo.remark" placeholder="" @focus="remarkFocus" @blur.prevent="remarkBlur()">></textarea>
      </div>
      <div class="line"></div>
      <div class="address no-address" v-if="!preservationAddress.addressName">
        <div class="no-addressL">
          <div class="">收货人</div>
          <div class="">收货地址</div>
        </div>
        <div class="no-addressR" @click="goAddress">
          请输入收货信息
          <img class="addressIcon" src="./imgs/icon-r.png" alt="" @click="goAddress">
        </div>
      </div>
      <div class="address" v-else>
        <div class="address-top">
          <div class="addressTil">收货人</div>
          <div class="info">
            <div class="name" style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
              {{preservationAddress.addressName}}
            </div>
            <div class="phone" style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;">
              {{preservationAddress.addressPhone}}
            </div>
          </div>
        </div>
        <div class="address-bottom">
          <div class="addressTilNo">收货地址</div>
          <div class="dizhi" @click="goAddress" style="overflow : hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">
            {{preservationAddress.addressProvince+preservationAddress.addressCity+preservationAddress.addressDistrict+preservationAddress.addressDetail+preservationAddress.addressNum}}
          </div>
          <img class="addressIcon" src="./imgs/icon-r.png" alt="" @click="goAddress">
        </div>
      </div>
      <div class="telBox">
        <a href="tel:4000-333-888" class="tel">
          服务热线:4000-333-888
        </a>
      </div>
      <div class="line70"></div>
    </div>
    <div class="iconKF" @click.stop="customerService()"></div>
    <div class="submit_btn" :class="bgColor?'': 'huisi'" @click="submit()">提交</div>
    <mt-popup v-model="popupVisible" popup-transition="popup-fade">
      若不代煎，则为您直接配送中药饮片；若代煎，则为您煎煮后包装成小袋，代煎服务费约为2.5元/剂，不同类方剂价格会有区别。
    </mt-popup>
    <mt-popup v-model="popupVisible2" popup-transition="popup-fade">
      若不代煎，没有限制。若是代煎中药汤剂，则3剂起订。若是代煎膏方，则2000克起订。若是丸剂-水丸（素丸）、水丸（包衣）、水蜜丸，则1000可起订。若是丸剂-浓缩丸，则3000克起订。
    </mt-popup>
  </div>
</template>
<script>
import { Button, Popup, Toast, Radio, MessageBox } from 'mint-ui';
import { intoInquiry, goLogin } from '@/api/user';
// import { setuserSource, setToken, setuserID, setRongcloudtoken, getRongcloudtoken, getuserSource, getToken, getuserID } from '@/utils/auth';
import { setuserSource, setToken, setuserID, setRongcloudtoken, getuserSource, getToken, getuserID } from '@/utils/auth';
import uploadImg from '@/components/upload/prescriptionUploadImg';
// import uploadImg from '@/components/upload/compressImg';
// import doctorAjax from '@/utils/doctorAjax';
import ajax from '@/utils/ajax';
// import { getQueryString } from '@/utils/index';
// import wxjs from '@/utils/wxjsInterface';
export default {
  data: function () {
    return {
      // source: this.$route.query.source ? this.$route.query.source : '10056', // 来源 药葫芦下单10056 电商平台下单10058
      // userid: this.$route.query.userid ? this.$route.query.userid : getuserID(), // 用户id
      // userToken: this.$route.query.userToken ? this.$route.query.userToken : getToken(), // 用户id
      StoreId: '',
      source: '', // 来源 药葫芦下单10056 电商平台下单10058
      userid: '', // 用户id
      userToken: '', // 用户token
      popupVisible: false,
      popupVisible2: false,
      preservationAddress: {
        'addressName': '',
        'addressSex': 0,
        'addressPhone': '',
        'addressProvince': '省',
        'addressCity': '市',
        'addressDistrict': '区',
        'addressDetail': '',
        'addressNum': '',
      },
      prescriptionInfo: {
        type: '0', // 药品类型 0：中药，1：西药
        prescr_type: '0', // 处方类型 0：中药，2：膏方
        imageUrl: '',
        suffering_num: 1, // 剂数
        phone: '', // 手机号
        is_pregnant: 0, // 怀孕
        is_suffering: 0, // 代煎
        is_bottled: 0, // 盛装方式 0 袋装 1 瓶装
        taste_type: 1, // 口感 1：正常，2：微甜，3：偏甜
        remark: '',
      },
      bgColor: true,
      payEnv: 'others', // 判断微信还是支付宝或者其他浏览器
      wxopenid: '',
    };
  },
  components: {
    'mt-button': Button,
    'mt-popup': Popup,
    'mt-Toast': Toast,
    'mt-radio': Radio,
    'uploadImg': uploadImg,
  },
  watch: {
    'prescriptionInfo.prescr_type': function(value, oldValue) {
      if (this.prescriptionInfo.prescr_type === '0') {
        this.prescriptionInfo.is_bottled = 0;
        this.prescriptionInfo.taste_type = 1;
        this.prescriptionInfo.is_pregnant = 0;
        this.prescriptionInfo.is_suffering = 0;
        this.prescriptionInfo.suffering_num = 1;
      }
      if (this.prescriptionInfo.prescr_type === '2') {
        this.prescriptionInfo.is_pregnant = 0;
        this.prescriptionInfo.is_suffering = 0;
        this.prescriptionInfo.suffering_num = 3;
      }
    },
  },
  methods: {
    // 问客服
    customerService() {
      // this.$router.push('/live/index');
      /* eslint-disable */
      document.title= '正在连接...';
      let url = 'https://es.echatsoft.com/visitor/pc/chat.html?companyId=463&echatTag=ezy-yaohulu';
      location.href = url;
    },
    // 返回上一页 清除所有值
    back() {
      console.log('返回上一页 清除所有值');
      this.removeStore();
      this.$router.back(-1);
    },
    // 处方订单
    prescriptionOrder() {
      this.$router.push('/prescription/prescription_order');
    },
    // 在线问诊
    goInterrogation() {
      intoInquiry();
    },
    // 处方示例
    examples() {
      this.$router.push('/patSquare/examples');
    },
    // 收货地址
    goAddress() {
      // 未登录
      // if (!this.userid || this.userid === 'undefined') {
      if ((!getToken() && !this.$route.query.userToken) || getToken() === 'undefined') {
        Toast('用户未登录，请重新登录');
        goLogin();
        return false;
      }
      this.setStore();
      this.$router.push('/address/index');
    },
    setStore() {
      sessionStorage.setItem('prescriptionInfo', JSON.stringify(this.prescriptionInfo));
    },
    removeStore() {
      sessionStorage.removeItem('prescriptionInfo');
    },
    // 上传图片
    addImgUrl(data) {
      this.prescriptionInfo.imageUrl = data.url;
    },
    // 删除图片
    removeImgUrl() {
      this.prescriptionInfo.imageUrl = '';
    },
    // 剂数
    dose() {
      this.popupVisible2 = !this.popupVisible2;
    },
    // 剂数加
    add() {
      let num = this.prescriptionInfo.suffering_num;
      num++;
      this.prescriptionInfo.suffering_num = num;
    },
    // 剂数减
    reduce() {
      if(this.prescriptionInfo.prescr_type === '2'){
        if (this.prescriptionInfo.suffering_num <= 3) {
          this.prescriptionInfo.suffering_num = 3;
          Toast('膏方剂量不能小于3');
          return false;
        }
      }
      let num = this.prescriptionInfo.suffering_num;
      if (this.prescriptionInfo.is_suffering === 1) {
        if (num <= 3) {
          Toast('代煎剂量不能小于3');
          return false;
        }
      }
      num--;
      if (num <= 0) {
        return;
      }
      this.prescriptionInfo.suffering_num = num;
    },
    // 手机号
    phoneFocus() {
      console.log('手机号聚焦');
    },
    phoneBlur() {
      console.log('手机号失焦');
      // let page = document.getElementById('page');
      // page.scrollTop = 0;
      window.scrollTo(0, 0);
      if (this.prescriptionInfo.phone === '') {
        Toast({
          message: '请输入手机号',
          position: 'middle',
          duration: 1000
        });
      } else {
        return;
      }
    },
    // 备注
    remarkFocus() {
      console.log('备注聚焦');
    },
    remarkBlur() {
      console.log('备注失焦');
      // let page = document.getElementById('page');
      // page.scrollTop = 0;
      window.scrollTo(0, 0);
      // setTimeout(function(){
      //   console.log(document.body.scrollHeight);
      //   document.body.scrollTop = document.body.scrollHeight;
      // },300);
      // setTimeout(() => {
      //   let page = document.getElementById('page');
      //   console.log(page, page.scrollHeight, page.clientHeight);
      //   page.scrollTop = page.scrollHeight - page.clientHeight;
      //   console.log(page.scrollTop);
      // }, 100);
    },
    // 是否怀孕
    toOther(val) {
      this.prescriptionInfo.is_pregnant = val;
    },
    // 代煎
    decoct() {
      this.popupVisible = !this.popupVisible;
    },
    // 是否煎熬
    otherTHREE(val) {
      this.prescriptionInfo.is_suffering = val;
      if(this.prescriptionInfo.is_suffering === 1){
        if (this.prescriptionInfo.suffering_num <= 3) {
          this.prescriptionInfo.suffering_num = 3;
          Toast('代煎剂量不能小于3');
        }
      }
    },
    // 盛装方式
    toCostumes(val) {
      this.prescriptionInfo.is_bottled = val;
    },
    // 口感
    toTexture(val) {
      this.prescriptionInfo.taste_type = val;
    },
    // 提交
    submit() {
      // 未登录
      if ((!getToken() && !this.$route.query.userToken) || getToken() === 'undefined') {
        console.log('userToken');
        MessageBox.confirm('您未登录,是否前往登录?').then(action => {
          goLogin();
        });
        return false;
      }
      if (!this.userid || this.userid === 'undefined') {
        console.log('userid');
        MessageBox.confirm('您未登录,是否前往登录?').then(action => {
          goLogin();
        });
        return false;
      }
      if (this.bgColor === false) {
        return false;
      }
      if (!this.verify()) {
        return;
      }
      let data = {
        source: this.source ? this.source : '10056', // 来源 药葫芦下单10056 电商平台下单10058
        userid: this.userid, // 用户id
        recipe_pic_url: this.prescriptionInfo.imageUrl,
        is_suffering: this.prescriptionInfo.is_suffering,
        suffering_num: this.prescriptionInfo.suffering_num,
        is_pregnant: this.prescriptionInfo.is_pregnant,
        remark: this.prescriptionInfo.remark,
        mobile: this.prescriptionInfo.phone,
        consignee: this.preservationAddress.addressName,
        con_tel: this.preservationAddress.addressPhone,
        province: this.preservationAddress.addressProvince,
        city: this.preservationAddress.addressCity,
        zone: this.preservationAddress.addressDistrict,
        address: this.preservationAddress.addressDetail + this.preservationAddress.addressNum,
        // type: '0',
        prescr_type: this.prescriptionInfo.prescr_type,
        is_bottled: this.prescriptionInfo.is_bottled,
        taste_type: this.prescriptionInfo.taste_type,
        weixin_openid: this.wxopenid ? this.wxopenid : '',
        StoreId: this.StoreId ? this.StoreId : '',
      };
      this.bgColor = false;
      console.log('拍方抓药提交参数', data);
      // doctorAjax.post('/api/order/ds/prescription/upload', data).then(res => {ajax
      ajax.post('/api/prescription/upload', data).then(res => {
        console.log('拍方抓药返回数据', res);
        if (res.status === 200 && res.data.code === 0) {
          Toast({
            message: res.data.message,
            position: 'middle',
            duration: 1500
          });
          this.bgColor = true;
          this.removeStore();
          if(res.data.data.order_id){
            this.$router.push('/prescription/prescription_detail?order_type=1&order_id=' + res.data.data.order_id);
          } else {
            this.$router.push('/prescription/prescription_detail?order_type=1&order_id=' + res.data.data);
          }
        } else {
          Toast({
            message: res.data.message,
            position: 'middle',
            duration: 1500
          });
          this.bgColor = true;
        }
      });
    },
    verify() {
      let myreg = /^[1][0-9]{10}$/;
      if (!this.prescriptionInfo.imageUrl) {
        Toast({
          message: '请上传处方图片！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (!myreg.test(this.prescriptionInfo.phone)) {
        Toast({
          message: '请填写有效的手机号码！',
          position: 'middle',
          duration: 1500
        });
        return false;
      } else if (!this.preservationAddress.addressName) {
        Toast({
          message: '请填写收件地址！',
          position: 'middle',
          duration: 1500
        });
        return false;
      }
      return true;
    },
    // 判断微信还是支付宝或者其他浏览器
    liulanqi() {
      if (/MicroMessenger/.test(window.navigator.userAgent)) {
      // 微信
        this.payEnv = 'weixin';
        // if (!sessionStorage.getItem('wxopenid')) {
        //   let url = `${process.env.WEB_HOST}/patSquare/index`;
        //   let link = wxjs.getOpenIdUrl(url);
        //   location.href = link;
        // }
      } else if (/AlipayClient/.test(window.navigator.userAgent)) {
      // 支付宝
        this.payEnv = 'alipay';
      } else {
      // 其他浏览器
        this.payEnv = 'others';
      }
      console.log('浏览器this.payEnv', this.payEnv);
    },
  },
  created() {
    // 判断是否有openid
    if (sessionStorage.getItem('wxopenid')) {
      this.wxopenid = sessionStorage.getItem('wxopenid');
    }
    // 微信公众号支付 需要获取code
    // let _self = this;
    // let code = getQueryString('code');
    // if (code) {
    //   wxjs.init(code).then((res) => {
    //     console.log('微信', res.wxconfig);
    //     if (res.wxconfig.openid) {
    //       sessionStorage.setItem('wxopenid', res.wxconfig.openid);
    //     }
    //     _self.wxopenid = res.wxconfig.openid; // openid
    //     console.log('_self.wxopenid', _self.wxopenid);
    //   });
    // }
    // 先判断是否是在微信内还是微信外的普通手机浏览器
    // this.liulanqi();
    // 取出收货地址
    if (JSON.parse(sessionStorage.getItem('preservationAddress'))) {
      this.preservationAddress = JSON.parse(sessionStorage.getItem('preservationAddress'));
    }
    // 取出拍方信息
    if (JSON.parse(sessionStorage.getItem('prescriptionInfo'))) {
      this.prescriptionInfo = JSON.parse(sessionStorage.getItem('prescriptionInfo'));
    }
    // 未登录
    if ((!getToken() && !this.$route.query.userToken) || getToken() === 'undefined') {
      MessageBox.confirm('您未登录,是否前往登录?').then(action => {
        goLogin();
      });
    } else if ((!getuserID() && !this.$route.query.userid) || getuserID() === 'undefined') {
      MessageBox.confirm('您未登录,是否前往登录?').then(action => {
        goLogin();
      });
    }
    // 下单来源
    if (getuserSource()) {
      this.source = getuserSource();
    } else if (this.$route.query.source) {
      this.source = this.$route.query.source;
      setuserSource(this.$route.query.source);
    }
    // 用户token
    // if (getToken()) {
    //   this.userToken = getToken();
    // } else if (this.$route.query.userToken) {
    //   this.userToken = this.$route.query.userToken;
    //   setToken(this.$route.query.userToken);
    // }
    if (this.$route.query.userToken) {
      this.userToken = this.$route.query.userToken;
      setToken(this.$route.query.userToken);
    } else if (getToken()) {
      this.userToken = getToken();
    }
    // 用户id
    if (getuserID()) {
      this.userid = getuserID();
    } else if (this.$route.query.userid) {
      this.userid = this.$route.query.userid;
      setuserID(this.$route.query.userid);
    }
    // 要是有传递问诊来源 将问诊来源进行存储
    if (this.$route.query.consultSource) {
      sessionStorage.setItem('consultSource', JSON.stringify(this.$route.query.consultSource));
    }
    // 要是没有传递问诊来源 并且session里面也没有 默认将问诊来源成1再进行存储
    if (!this.$route.query.consultSource && !JSON.parse(sessionStorage.getItem('consultSource'))) {
      sessionStorage.setItem('consultSource', JSON.stringify(1));
    }
    // // 是否有缓存来源地址
    // let storageVisitUrl = sessionStorage.getItem('visitUrl');
    // if (storageVisitUrl) {
    //   sessionStorage.removeItem('visitUrl');
    // }
    // 融云token
    if (this.$route.query.rongyunToken) {
      setRongcloudtoken(decodeURIComponent(this.$route.query.rongyunToken));
    }
    // StoreId
    if (this.$route.query.StoreId) {
      this.StoreId = this.$route.query.StoreId
      sessionStorage.setItem('StoreId', JSON.stringify(this.$route.query.StoreId));
    } else if( JSON.parse(sessionStorage.getItem('StoreId'))) {
      this.StoreId = JSON.parse(sessionStorage.getItem('StoreId'));
    }
  },
};
</script>
<style lang="less" scoped>
.buyingMedicine{
  .myList{
    height: 44px;
    line-height: 44px;
    color: #d74949;
  }
}
input,textarea{
  font-size: 14px;
}
.pageMain{
  position: absolute;
  top: 44px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow-y:scroll;
  -webkit-overflow-scrolling:touch;
  background: #fff;
  font-size: 14px;
}
.pageMain::-webkit-scrollbar {
  display: none;
}
.line{
  height: 10px;
  background-color: #f5f5f5;
}
.line70{
  height: 70px;
}
.tabs{
  height: 48px;
  background: #fff;
  margin-bottom: 2px;
  /deep/ .mint-navbar .mint-tab-item{
    color: #999999;
    position: relative;
    &:last-child:before{
      content: '';
      position: absolute;
      width: 1px;
      height: 25px;
      background-color: #f5f5f5;
      left: 0px;
    }
    .mint-tab-item-label{
      font-size: 16px;
    }
  }
  /deep/ .mint-navbar .mint-tab-item.is-selected{
    color: #333333;
    border: none;
    &:after {
      content: '';
      position: absolute;
      width: 75px;
      height: 2px;
      background-color: #787878;
      left: 0px;
      bottom: 2px;
      right: 0px;
      margin:  auto;
    }
  }
}
// 上传图片
.uploadBox{
  width: 100%;
  min-height: 280px;
  padding: 0 10px;
  padding-top: 10px;
  background: url(imgs/banner.png);
  background-size: 100% 100%;
  .imgBox{
    height: 245px;
    overflow: hidden;
  }
  .txtbox{
    text-align: center;
    font-size: 12px;
    color: #666666;
  }
}
.listItem {
  width: 100%;
  height: 47px;
  line-height: 47px;
  padding: 0 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
  display: flex;
  font-size: 12px;
}
.itemLeft {
  // width: 80px;
  height: 100%;
  display: flex;
  align-items: center;
  span{
    margin-right: 5px;
  }
}
.itemRight {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
// 问号
.questioMnark{
  width: 14px;
  height: 14px;
  margin-right: 5px;
}
// 剂数
.dose{
  img{
    width: 15px;
    height: 15px;
  }
  .number{
    width: 40px;
    text-align: center;
  }
}
// 患者手机号
.telephone{
  input{
    width: 100%;
    height: 100%;
    border: none;
    text-align: right;
  }
}
// 是否怀孕
.pregnant{
  height: 100%;
  display: flex;
  align-items: center;
  img{
    width: 18px;
    height: 18px;
    margin-right: 10px;
    margin-left: 10px;
  }
}
// 是否代煎
.decoctingMedicine{
  height: 100%;
  display: flex;
  align-items: center;
  img{
    width: 18px;
    height: 18px;
    margin-right: 10px;
    margin-left: 10px;
  }
}
// 备注
.remark{
  width: 100%;
  height: 40px;
  display: flex;
  >p{
    padding-left: 10px;
    margin-right: 25px;
    height: 40px;
    display: flex;
    align-items: center;
    span{
      margin-left: 5px;
      color: #999999;
    }
  }
  textarea{
    flex: 1;
    height: 40px;
    line-height: 40px;
    border: none;
  }
}
// 收货地址
.address{
  padding: 0 10px;
  padding-right: 30px;
  position: relative;
  font-size: 12px;
}
// 无地址
.no-address{
  height: 70px;
  display: flex;
  justify-content: space-between;
}
.no-addressL{
  height: 100%;
  padding-top: 10px;
  color: #000;
  >div{
    line-height: 25px;
  }
}
.no-addressR{
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #999999;
  position: relative;
  .addressIcon{
    position: absolute;
    width: 8px;
    height: 15px;
    right: -15px;
    top: 27px;
  }
}
// 有地址
.address-top{
  height: 35px;
  display: flex;
  justify-content: space-between;
}
.addressTil{
  width: 80px;
  height: 35px;
  display: flex;
  align-items: center;
}
.info{
  flex: 1;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  >div{
    height: 35px;
    line-height: 35px;
  }
  .name{
    flex: 1;
    text-align: right;
  }
  .phone{
    width: 105px;
    text-align: right;
  }
}
.address-bottom{
  height: 50px;
  display: flex;
  position: relative;
  .addressTilNo{
    width: 80px;
  }
  .dizhi{
    flex: 1;
    height: 50px;
    line-height: 25px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // display: -webkit-box;
    // -webkit-line-clamp: 2;
    // -webkit-box-orient: vertical;
  }
  .addressIcon{
    position: absolute;
    width: 8px;
    height: 15px;
    right: -20px;
    top: 6px;
  }
}
// 电话
.telBox{
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  font-size: 12px;
  color: #666666;
}
// 问客服
.iconKF{
  position: absolute;
  width: 40px;
  height: 40px;
  background-image: url(./imgs/home_btn_wkf.png);
  background-size: 100% 100%;
  top: 316px;
  left: 10px;
}
// 提交
.submit_btn{
  position: fixed;
  bottom: 15px;
  left: 10px;
  right: 10px;
  margin: 0 auto;
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  background-color: #d74949;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
  max-width: 600px;
}
.submit_btn.huisi{
  background: #ccc;
}
.mint-popup{
  position: absolute;
}
</style>
