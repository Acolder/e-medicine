<template>
  <div id="manageInquiryPeople">
    <mt-header title="就诊人信息">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
      <div class="icon-add" slot="right" @click="addPaintent"></div>
    </mt-header>
    <div class="manage-page" id="inquiry-page">
      <div class="container-list">
            <cell-swipe v-for="(object, index) in patients" :class="['box-item']" :key="object.memberid"
                        :right="getRight(object.memberid,index)">
              <div class="box-in-1">
                <div type="radio" class="icon-select " :class="{selected:object.checked}"
                     @click="disableSelect===false?checkedRadio(index):''"></div>
                <div class="word"> {{(object.name)}} / {{object.gender == 1 ? '男' : '女'}} / {{object.age}}岁</div>
              </div>
              <div class="box-in-2">
                <!-- <router-link v-if="disableSelect===false" :to="{ path: './inquiryPeopleMes', query: object}"
                             slot="right">
                  <div class="icon-edit"></div>
                </router-link> -->
                <div v-if="disableSelect===false" slot="right" @click="toInquiryPeopleMes(object)">
                  <div class="icon-edit"></div>
                </div>
                <div v-if="disableSelect===true" slot="right">
                  <div class="icon-edit"></div>
                </div>
              </div>
            </cell-swipe>
      </div>
      <!--暂无就诊人-->
      <div class="noPaintent" v-if="this.patients.length===0">
        <img class="img_noPaintent" src="./imgs/icon-zwjzr.png" alt="">
        <span>暂无就诊人~</span>
        <div class="box">
          <div class="btnAdd" @click="addPaintent">
            添加就诊人
          </div>
        </div>
      </div>
      <div class="box-btn" :class="{active:!disableSelect,hide:hide}" @click="!disableSelect?checkSubmit():''">
        <div class="btn-full static">
          确认提交
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import page  from './modules/page';
import { Header, CellSwipe, MessageBox }  from 'mint-ui';
import ajax from '@/utils/ajax';
const queryString = require('query-string');
export default {
  name: 'manageInquiryPeople',
  data: function () {
    return {
      allLoaded: false,
      right: [
        {
          content: '删除',
          handler: () => this.deleteInquiryPeople()
        }],
      patients: [],
      disableSelect: true,
      hide: false,
      pageIndex: 1,
      pageSize: 20
    };
  },
  components: {
    'mt-header': Header,
    'cell-swipe': CellSwipe,
  },
  methods: {
    // 获取就诊人来源
    getInquirySource: function () {
      let parameter = queryString.parse(location.search);
      localStorage.setItem('inquiryPeopleSource', parameter.type);
    },
    // 添加就诊人
    addPaintent: function () {
      // let parameter = queryString.parse(location.search);
      // let url = '';
      // if (parameter && parameter.type === 'select') {
      //   url = '/inquiry/inquiryPeopleMes?type=select';
      // } else if (parameter && parameter.type === 'edit') {
      //   url = '/inquiry/inquiryPeopleMes?type=edit';
      // } else {
      //   url = '/inquiry/inquiryPeopleMes';
      // }
      // window.location.href = url;
      let parameter = location.search;
      this.$router.push({
        path: `/inquiry/inquiryPeopleMes?${parameter}`
      });
    },
    getRight: function (id, index) {
      return [
        {
          content: '删除',
          handler: () => this.deleteInquiryPeople(id, index)
        }];
    },
    checkSubmit: function () {
      let patient;
      for (let i = 0; i < this.patients.length; i++) {
        if (this.patients[i].checked === true) {
          patient = this.patients[i];
          patient.description = this.$route.query.description;
          const stringtified = queryString.stringify(patient);
          window.location.href = './intoSecond?' + stringtified;
          return;
        }
      }
      if (!patient) {
        MessageBox('提示', '请选择就诊人');
      }
    },
    checkedRadio: function (index) {
      for (let i = 0; i < this.$data.patients.length; i++) {
        this.$data.patients[i].checked = false;
      }
      this.$data.patients[index].checked = true;
      this.$data.patients = Object.assign([], this.$data.patients);
    },
    getInquiryMsgs: function () {
      let url = '/api/user/MemberList?pageIndex=' + this.pageIndex + '&pageSize=' + this.pageSize;
      ajax.get(url).then((res) => {
        this.patients = [...this.patients, ...res.data.data];
        this.patients.reverse();
        console.log(this.patients);
      });
    },
    deleteInquiryPeople: function (memberId, index) {
      this.ishasConsultOrder(memberId, index);
    },
    // 判断是选择就诊人,还是管理就诊人 disableSelect:false 不让选,
    isSelect: function () {
      const hash = location.href;
      // 1.如果带了参数,说明就诊人已经被选择。
      if (hash.indexOf('?') !== -1) {
        const params = queryString.parse(hash.substr(hash.indexOf('?') + 1));
        // 2.1 就诊人信息变更，发送就诊请求
        if (params.type === 'manage') {
          this.disableSelect = true;
          console.info('禁止确认提交,选中,以及编辑!');
        } else if (params.type === 'select') {
          this.disableSelect = false;
        }
        else if (params.type === 'edit') {
          this.disableSelect = false;
          this.hide = true;
        }
      }
    },
    // 判断就诊人是否存在咨询单
    ishasConsultOrder: function (memberId, index) {
      // 判断联系人是否有订单
      let url = `/api/user/HaveConsult/` + memberId;
      ajax.get(url).then((res) => {
        console.info('ishasConsultOrder:', res);
        if (res.data.data === 0 || res.data.data === 1) {
          MessageBox('提示', '不能删除当前就诊人!');
        }
        if (res.data.data === 2) {
          console.info('就诊结束:', res.data.data);
          let url = `/api/user/DeleteUserMember/` + memberId;
          MessageBox.confirm('若删除就诊人信息,将无法查看该就诊人记录,是否要删除?').then(action => {
            ajax.get(url).then((res) => {
              this.patients.splice(index, 1);
              console.info('删除成功!');
            });
          });
        }
        if (res.data.data === -1) {
          console.info('未就诊:', res.data.data);
          let url = `/api/user/DeleteUserMember/` + memberId;
          ajax.get(url).then((res) => {
            this.patients.splice(index, 1);
            console.info('删除成功!');
          });
        }
      });
    },
    toInquiryPeopleMes(message) {
      message.description = this.$route.query.description;
      this.$router.push({
        path: '/inquiry/inquiryPeopleMes', query: message
      });
    }
  },
  mounted: function () {
    this.getInquirySource();
    page.selfAdaptionScreen();
    this.getInquiryMsgs();
    this.isSelect();
  },
};
</script>
<style lang="less">
  @import "../../styles/mixin";
  @bd-grey: #E6E6E6; // 边框灰色
  #manageInquiryPeople {
    .manage-page {
      padding: 44px 0 0 0;
      background-color: #EFEFF4;
    }
    .box-item {
      display: flex;
      height: 64px;
      padding: 0 10px;
      font-size: 16px;
      justify-content: space-between;
      align-items: center;
      vertical-align: bottom;
      background: #FFF;
      border-bottom: 1px solid @bd-grey;
      .word {
        display: inline-block;
        margin-right: 5px;
      }
    }
    .icon-select {
      .icon-construction("./imgs/icon_querenxuannono.png", 20px);
      vertical-align: bottom;
    }
    .icon-select.selected {
      .icon-construction("./imgs/icon_querenxuan.png", 20px);
      vertical-align: bottom;
    }
    .icon-edit {
      .icon-construction("./imgs/icon_editor.png", 20px);
      vertical-align: bottom;
    }
    .box-btn {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0;
      margin-top: 0;
      .btn-full {
        margin-top: 0;
        &.static {
          margin: 0;
          border-radius: 0;
        }
      }
    }
    .mint-cell-wrapper {
      background-size: 120% 0px;
      .mint-cell-value {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  // 暂无就诊人
  @blue-color: @green-color;
  .noPaintent {
    position: absolute;
    text-align: center;
    font-size: 16px;
    color: #666;
    bottom: 0;
    top: 0;
    text-align: center;
    background-color: #FFF;
    .img_noPaintent {
      width: 100%;
      display: inline-block;
      background: #FFF;
      margin-top: 100px;
      margin-bottom: 30px;
    }
    .box {
      padding: 20px;
      .btnAdd {
        display: inline-block;
        font-size: 18px;
        color: @green-color;
        border: 1px solid @green-color;
        padding: 10px 40px;
        border-radius: 2em;
        text-align: center;
      }
    }
  }
  .container-list {
    overflow: auto;
    padding-bottom: 60px;
    // 滚动条颜色
    &::-webkit-scrollbar {
      background-color: #CDCDCD;
      width: 0.1em;
    }
    &::-webkit-scrollbar-track {
      background-color: #F25712; //一种偏橘的红色（如果是口红色号的话应该适合白皮）
    }
    &::-webkit-scrollbar-track-piece {
      background-color: #CCC; //一种灰色
      height: 0.1em;
    }
  }
</style>

