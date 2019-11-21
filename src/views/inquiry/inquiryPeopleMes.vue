<template>
  <div id="inquiryPeopleMes">
    <mt-header title="就诊人信息">
      <mt-button slot="left" icon="back" onclick="history.go(-1)"></mt-button>
    </mt-header>
    <div class="message-page" id="inquiry-page">
      <mt-field label="就诊人姓名" class="require" :attr="{ maxlength: 10 }" placeholder="就诊人姓名" v-model.trim="msg.name" @change="checkValue('name')" slot="<h1>sss</h1>">
      </mt-field>
      <mt-field label="性别" class="require">
        <div class="box-sex">
          <div class="sexType " :class="{selected:isMan}" @click="checkRadio('1')">男</div>
          <div class="sexType" :class="{selected:!isMan}" @click="checkRadio('0')">女</div>
        </div>
      </mt-field>
      <mt-field label="年龄" class="require " placeholder="请输入年龄" type="text" :attr="{ maxlength: 3 }" v-model="msg.age" @change="checkValue('age')"></mt-field>
      <mt-field label="手机号" class="require" placeholder="请输入手机号" :attr="{ maxlength: 11 }" type="tel" v-model="msg.mobile"></mt-field>
      <div class="box-btn active">
        <div class="btn-full static" @click="comfirmAndSubmit">
          确认提交
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import page from './modules/page';
import { getRequestObj } from '@/utils/index';
import { Header, MessageBox, Toast } from 'mint-ui';
import ajax from '@/utils/ajax';
const queryString = require('query-string');
export default {
  name: 'inquiryPeopleMes',
  components: {
    'mt-header': Header,
  },
  data: function () {
    return {
      male: {
        checked: true
      },
      female: {
        checked: false
      },
      msg: {
        name: '',
        mobile: '',
        age: '',
      },
    };
  },
  computed: {
    isMan: function () {
      return this.msg.gender === '1' ? true : false;
    }
  },
  methods: {
    checkRadio: function (gender) {
      this.msg = Object.assign({}, this.msg, { gender: gender });
      // Toast(gender);
    },
    verityForm: function (data) {
      if (!data.name) {
        MessageBox('提示', '姓名不能为空');
        return false;
      }
      if (!data.age) {
        MessageBox('提示', '年龄不能为空');
        return false;
      }
      if (!/^\d*$/.test(data.age)) {
        MessageBox('提示', '年龄必须为整数');
        return false;
      }
      if (data.age < 1) {
        MessageBox('提示', '年龄不能小于1');
        return false;
      }
      if (data.age > 200) {
        MessageBox('提示', '年龄不能超过200');
        return false;
      }
      if (!data.mobile) {
        MessageBox('提示', '手机不能为空');
        return false;
      }
      const reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(data.mobile)) {
        MessageBox('提示', '手机格式不对');
        return false;
      }
      return true;
    },
    setInquiryPeopleMsg: function () {
      this.msg = getRequestObj();
    },
    comfirmAndSubmit: function () {
      let pullData = this.msg;
      if (!this.verityForm(pullData)) {
        return;
      }
      let url = `/api/user/EditUserMember`;
      ajax.post(url, pullData).then((res) => {
        console.log(res);
        if (res.status === 200 && res.statusText === 'OK') {
          // 当参数中带有?type=select时候,返回,同样带上该参数.
          if (res.data.code === -1) {
            Toast(res.data.message);
          } else {
            let url = '';
            let manageType = localStorage.getItem('inquiryPeopleSource');
            let parameter = queryString.parse(location.search);
            parameter.type = manageType;
            parameter = queryString.stringify(parameter);
            url = '/inquiry/manageinquiryPeople?' + parameter;
            window.location.href = url;
          }
        }
      });
    },
    // 编辑就诊人信息
    getInquiryMes: function () {
      let string;
      const hash = location.href;
      let index = hash.indexOf('?');
      let indexName = hash.indexOf('name');
      // 1.如果带了参数,说明就诊人已经被选择。
      if (index !== -1 && indexName !== -1) {
        string = hash.substr(index + 1);
        const patient = queryString.parse(string);
        this.msg = patient;
      } else {
        this.msg.gender = '1';
      }
    },
    checkValue(value) {
      if (value === 'name') {
        this.msg.name = this.msg.name.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g, '');
        this.msg.name = this.msg.name.replace(/\s+/g, '');
      }
      if (value === 'age') {
        this.msg.age = this.msg.age.replace(/[^0-9]/g, '');
      }
    }
  },
  mounted: function () {
    page.selfAdaptionScreen();
    this.setInquiryPeopleMsg();
    this.getInquiryMes();
  },
};
</script>
<style lang="less">
  .message-page {
    padding: 44px 0 0 0;
    background-color: #EFEFF4;
  }
  @import "../../styles/mixin";
  @bd-grey: #E6E6E6; // 边框灰色
  @btn-blue: @green-color;
  @ft-black: #333;
  @ft-grey: #888;
  #inquiryPeopleMes {
    .mint-cell {
      &.require {
        .mint-cell-text:before {
          display: inline-block;
          width: 10px;
          content: " * ";
          color: red;
        }
      }
      &.noRequire {
        .mint-cell-text:before {
          display: inline-block;
          width: 10px;
          content: "  ";
          color: red;
        }
      }
      & + .mint-cell {
        border-top: 1px solid @bd-grey;
      }
    }
    input.mint-field-core {
      text-align: right;
      margin-right: 10px;
    }
  }
  // 性别选择框
  .box-sex {
    display: flex;
    .sexType {
      border-radius: 1em;
      padding: 3px 15px;
      border: 1px solid @bd-grey;
      margin-left: 15px;
      &.selected {
        color: @btn-blue;
        border: 1px solid @btn-blue;
      }
    }
  }
  .box-btn {
    margin-top: 120px;
  }
  .mint-cell-wrapper {
    background-size: 100% 0;
  }
</style>
