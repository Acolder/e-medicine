<template>
  <div class="buyingMedicine" style="">
    <mt-header fixed title="康美e抓药">
      <mt-button icon="back" slot="left" @click="goBack"></mt-button>
      <!-- <mt-button icon="back" slot="left" @click="back()"></mt-button> -->
      <mt-button slot="right">
        <div class="myList" @click="prescriptionOrder">抓药服务单</div>
      </mt-button>
    </mt-header>
    <div class="pageMain">
      <!-- banner轮播 -->
      <div class="banner">
        <mt-swipe :auto="0">
          <mt-swipe-item v-for="(item, index) in bannerSwiper" :key="index">
            <img :src="item.picture_path" alt="" @click="goBanner(item)">
          </mt-swipe-item>
        </mt-swipe>
      </div>
      <!-- tab -->
      <div class="tabs">
        <mt-navbar v-model="selected">
          <mt-tab-item id="1">没有处方</mt-tab-item>
          <mt-tab-item id="2">有处方</mt-tab-item>
        </mt-navbar>
      </div>
      <!-- tab-container -->
      <div class="container">
        <mt-tab-container v-model="selected">
          <mt-tab-container-item id="1">
            <div class="imgBox">
              <img src="./imgs/home_btn_zxys.png" alt="" @click="goInterrogation()">
              <p>咨询医师</p>
            </div>
            <div>没有处方？在线开</div>
            <div>由康美网络医院提供在线问诊、电子处方服务</div>
          </mt-tab-container-item>
          <mt-tab-container-item id="2">
            <div class="imgBox">
              <img src="./imgs/home_btn_zxzy.png" alt="" @click="patSquare()">
              <p>在线抓药</p>
              <div class="icon" @click="customerService()"></div>
            </div>
            <div>中药材抓药、代煎、送货上门</div>
            <div>已承接处方量710余万、服务250万人次，最快1小时送货上门</div>
          </mt-tab-container-item>
        </mt-tab-container>
      </div>
      <div class="qualifications">
        <div class="til">相关资质</div>
        <div class="iconBox">
          <div @click="toQualifications(1)">
            <img src="./imgs/home_hospital.png" alt="">
            <p>网络医院</p>
          </div>
          <div @click="toQualifications(2)">
            <img src="./imgs/home_drugstorel.png" alt="">
            <p>智慧药房</p>
          </div>
          <div @click="toQualifications(3)">
            <img src="./imgs/home_drug.png" alt="">
            <p>智慧医药</p>
          </div>
        </div>
      </div>
      <div class="telBox">
        <a href="tel:4000-333-888" class="tel">
          服务热线:4000-333-888
        </a>
      </div>
    </div>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { intoInquiry, goLogin } from '@/api/user';
import { getQueryString } from '@/utils/index';
import { setuserSource, setToken, setuserID, setRongcloudtoken, getuserSource, getToken, getuserID } from '@/utils/auth';
export default {
  data: function () {
    return {
      source: '', // 来源 药葫芦下单10056 电商平台下单10058
      userid: '', // 用户id
      userToken: '', // 用户token
      // 轮播图
      bannerSwiper: [
        {
          picture_url: '/patSquare/step',
          picture_path: 'https://uploads.kangmei.com.cn/Files/20190328/2gpzq5ef.atn.png',
        },
        {
          picture_url: '',
          picture_path: 'https://uploads.kangmei.com.cn/Files/20190329/iqpingcp.utr.png',
        },
        {
          picture_url: '',
          picture_path: 'https://uploads.kangmei.com.cn/Files/20190329/mrfsiqqs.uhi.png',
        },
        {
          picture_url: '',
          picture_path: 'https://uploads.kangmei.com.cn/Files/20190409/y15zw5f3.lbk.jpg'
        }
      ],
      selected: '1'
    };
  },
  methods: {
    // 处方订单
    prescriptionOrder() {
      this.$router.push('/prescription/prescription_order');
    },
    // banner跳转
    goBanner(val) {
      if (val.picture_url) {
        this.$router.push(val.picture_url);
      }
    },
    // 在线问诊
    goInterrogation() {
      intoInquiry();
    },
    // 拍方抓药
    patSquare() {
      this.$router.push('/patSquare/index');
    },
    // 问客服
    customerService() {
      // this.$router.push('/live/index');
      /* eslint-disable */
      document.title= '正在连接...';
      let url = 'https://es.echatsoft.com/visitor/pc/chat.html?companyId=463&echatTag=ezy-yaohulu';
      location.href = url;
    },
    // 网络医院
    toQualifications(val) {
      this.$router.push('/patSquare/qualifications?type=' + val);
    },
    // 返回url
    getVisitUrl() {
      let visitUrl = getQueryString('visitUrl'); // 回退url
      if (visitUrl && visitUrl.length > 0) {
        sessionStorage.setItem('visitUrl', JSON.stringify(visitUrl));
      }
    },
    // 返回
    goBack() {
      let visitUrl = sessionStorage.getItem('visitUrl');
      if (visitUrl) {
        console.log(1);
        visitUrl = JSON.parse(visitUrl);
        visitUrl = decodeURIComponent(visitUrl);
        sessionStorage.removeItem('visitUrl');
        window.location.href = visitUrl;
      } else {
        console.log(2);
        this.$router.push({
          path: '/patSquare/prescription'
        });
      }
    }
  },
  created() {
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
    // 返回url
    this.getVisitUrl();
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
    // 融云token
    if (this.$route.query.rongyunToken) {
      setRongcloudtoken(decodeURIComponent(this.$route.query.rongyunToken));
    }
  }
};
</script>
<style lang="less" scoped>
.buyingMedicine{
  padding-top: 44px;
  .myList{
    height: 44px;
    line-height: 44px;
    color: #d74949;
  }
}
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
// banner轮播
.banner{
  width: 100%;
  height: 210px;
  img{
    height: 100%;
    width: 100%;
  }
  /deep/ .mint-swipe-indicators{
    left: 40px;
    bottom: 10px;
  }
  /deep/ .mint-swipe-indicator.is-active {
    background: #a16654;
    opacity: 1;
  }
  /deep/ .mint-swipe-indicator{
    background: #baa19c;
    width: 10px;
    height: 3px;
    border-radius: 0;
    opacity: 0.5;
  }
}
.tabs{
  height: 48px;
  background: #fff;
  margin-bottom: 10px;
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
.container{
  height: 242px;
  background: #fff;
  margin-bottom: 10px;
  padding: 0 10px;
  padding-top: 30px;
  .imgBox{
    margin: 5px auto;
    margin-bottom: 10px;
    width: 162px;
    height: 115px;
    background-color: #ffffff;
    box-shadow: 0px 2px 8px 0px rgba(136, 95, 83, 0.2);
    border-radius: 2px;
    padding-top: 20px;
    position: relative;
    img{
      width: 62px;
      height: 56px;
      display: block;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    p{
      text-align: center;
      font-size: 15px;
      color: #a26654;
    }
    .icon{
      position: absolute;
      width: 40px;
      height: 40px;
      background-image: url(./imgs/home_btn_wkf.png);
      background-size: 100% 100%;
      right: -80px;
      top: 55px;
    }
  }
  >div{
    text-align: center;
    font-size: 12px;
    color: #666;
    line-height: 26px;
  }
}
.qualifications{
  height: 105px;
  background: #fff;
  padding: 0 10px;
  padding-top: 15px;
  .til{
    height: 18px;
    border-left: 3px solid #787878;
    margin-bottom: 13px;
    padding-left: 12px;
  }
  .iconBox{
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    >div{
      width: 30%;
      height: 45px;
      background-color: #b5654d;
      background-repeat: no-repeat;
      background-size: 37px;
      background-position-y: 10px;
      background-position-x: 3px;
      border-radius: 2px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 18px;
        height: 18px;
        margin-right: 5px;
      }
      p{
        font-size: 13px;
        color: #fff;
      }
    }
    >div:nth-child(1){
      background-image: url(./imgs/home_hospital_1.png);
    }
    >div:nth-child(2){
      background-image: url(./imgs/home_drugstorel_1.png);
    }
    >div:nth-child(3){
      background-image: url(./imgs/home_drug1.png);
    }
  }
}
.telBox{
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  font-size: 12px;
  color: #666666;
}
</style>
