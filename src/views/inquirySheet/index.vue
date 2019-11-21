<template>
  <div class="inquirySheet">
    <mt-header fixed :title="title">
      <a href="javascript:;" slot="left" @click="$router.go(-1);">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <div class="inquirySheet_body" :class="{'has-submit': hasSubmit}">
        <div class="inquiry_f">
          <!-- --------------------------------------- -->
          <div class="news common">
            <h3>基本信息</h3>
            <div class="newsInput">
              <div class="newsK"><em>*</em><mt-field label="姓名:" placeholder="" v-model.trim="userData.name" :disabled="hasSubmit"></mt-field></div>
              <div class="newsK gender" @click="showGenderVisible">
                <!-- <mt-radio title="性别" v-model="userData.sex" :options="genderOptions"></mt-radio> -->
                <span><em>*</em>性别：</span><span :class="{'gender-show': hasSubmit}">{{ userData.sex===0?'女':'男' }} </span>
              </div>
              <div class="newsK"><em>*</em><mt-field label="年龄:" placeholder="" v-model.trim="userData.age" :disabled="hasSubmit"></mt-field></div>
              <div class="newsK" style="width: 88%"><em>*</em><mt-field label="手机:" placeholder="" v-model.trim="userData.mobile" :disabled="hasSubmit" :attr="{ maxlength: 11 }"></mt-field></div>
            </div>
          </div>
          <!-- --------------------------------------- -->
            <div class="symptom common">
              <h2><em>*</em>主要症状</h2>
              <mt-field placeholder="请详细填写本次问诊的主要症状,发病的时间等信息,便于医生诊断" type="textarea" rows="4" v-model="userData.symptom" :disabled="hasSubmit"></mt-field>
            </div>
          <!-- --------------------------------------- -->
          <div class="symptom common">
            <h2>病史</h2>
            <mt-field placeholder="是否对某些药物过敏,食物过敏" type="textarea" rows="4" v-model="userData.medical_history" :disabled="hasSubmit"></mt-field>
          </div>
          <!-- --------------------------------------- -->
          <div class="symptom common">
            <h2>过敏史</h2>
            <mt-field placeholder="过敏史" type="textarea" rows="4" v-model="userData.allergy_history" :disabled="hasSubmit"></mt-field>
          </div>
          <!-- --------------------------------------- -->
          <div class="common interrogation-type">
            <em>*</em>
            <mt-radio
              title="问诊类型"
              v-model="userData.interrogation_type"
              align="right"
              :options="getInterrogation()">
            </mt-radio>
          </div>
          <!-- --------------------------------------- -->
          <template v-if="hasSubmit && userData.imgs !== ''">
            <div class="picture common">
              <h2>请拍摄舌像，脸部照，患处，或检验单</h2>
              <div class="upppImg">
                  <uploadImg :imgUrl="userData.imgs" :fileName="'Image'" :isMaxIMg="'1'" :isCheck="true" @uploadSuccess="addImgUrl" @removeImg="removeImgUrl"></uploadImg>
              </div>
            </div>
          </template>
          <template v-if="!hasSubmit">
            <div class="picture common">
              <h2>请拍摄舌像，脸部照，患处，或检验单</h2>
              <div class="upppImg">
                  <uploadImg :imgUrl="userData.imgs" :fileName="'Image'" :isMaxIMg="'1'" :isCheck="'true'" @uploadSuccess="addImgUrl" @removeImg="removeImgUrl"></uploadImg>
                  <div class="pic"></div>
              </div>
            </div>
          </template>
          <!-- --------------------------------------- -->
          <div class="symptomList common flex" v-for="(item, index) in items" :key=index>
            <template v-if="item.type === 'Radio'">
              <em>*</em>
              <mt-radio
                :title="`${index+1}、${item.title}`"
                v-model="item.answer"
                align="right"
                :options="getOptions(item.content)" class="mt-option">
              </mt-radio>
            </template>
            <template v-else-if="item.type === 'Text'">
              <em>*</em>
              <div class="symptom mt-option text-box">
                <h2>&nbsp;&nbsp;&nbsp;{{ index+1 }}、{{ item.title }}</h2>
                <mt-field placeholder="" type="textarea" rows="4" v-model="item.answer" :disabled="hasSubmit"></mt-field>
              </div>
            </template>
            <template v-else-if="item.type === 'CheckBox'">
              <em>*</em>
              <mt-checklist
                :title="`${index+1}、${item.title}`"
                v-model="item.answer"
                :options="getOptions(item.content)" class="mt-option">
              </mt-checklist>
            </template>
          </div>
        </div>
    </div>
    <mt-popup
      v-model="genderVisible"
      position="bottom" class="gender-choose">
      <mt-picker :slots="slots" valueKey="value" @change="genderChange"></mt-picker>
    </mt-popup>
    <mt-button type="primary" size="large" @click="submit" v-show="!hasSubmit">确认提交</mt-button>
  </div>
</template>
<script>
import uploadImg from '@/components/upload/uploadImg';
import docAjax from '@/utils/doctorAjax';
import { Toast } from 'mint-ui';
import { validatPhone } from '@/utils/validate';
export default {
  data() {
    return {
      value: '',
      checkValue: [],
      userData: [],
      items: [],
      title: '', // 标题
      hasSubmit: false, // 是否已提交
      genderVisible: false,
      slots: [
        {
          values: [{ key: 1, value: '男' }, { key: 0, value: '女' }],
          className: 'gender-option',
          textAlign: 'center',
          defaultIndex: 0
        }
      ],
      sending: false, // 是否正在发送
    };
  },
  components: {
    uploadImg
  },
  mounted() {
    this.getInquiryList();
  },
  methods: {
    // 获取问诊单内容
    getInquiryList() {
      let _this = this;
      let inquiryId = this.$route.query.inquiryId;
      this.title = this.$route.query.inquiryTitle;
      let url = '/api/visitform/get_submit';
      docAjax.get(url, {
        params: {
          id: inquiryId
        }
      }).then(res => {
        if (res.status === 200 && res.data.code === 0) {
          let returnData = res.data.data;
          _this.hasSubmit = returnData.form.name !== '';
          _this.userData = returnData.form;
          // _this.userData.interrogation_type = String(_this.userData.interrogation_type);
          let item = returnData.items;
          for (let i = 0; i < item.length; i++) {
            if (item[i].type === 'CheckBox' && !_this.hasSubmit) {
              item[i].answer = [];
            } else if (item[i].type === 'CheckBox' && _this.hasSubmit) {
              let thisAnswer = item[i].answer.split(',');
              item[i].answer = thisAnswer;
            }
          }
          _this.items = item;
        }
      });
    },
    // 返回options
    getOptions(content) {
      let contents = JSON.parse(content);
      let options = [];
      if (this.hasSubmit) {
        for (let i = 0; i < contents.length; i++) {
          options.push({
            label: contents[i].value,
            value: contents[i].key,
            disabled: true
          });
        }
      } else {
        for (let i = 0; i < contents.length; i++) {
          options.push({
            label: contents[i].value,
            value: contents[i].key
          });
        }
      }
      return options;
    },
    // 返回问诊类型
    getInterrogation() {
      let options = [
        {
          label: '初诊',
          value: '0',
          disabled: this.hasSubmit
        },
        {
          label: '复诊',
          value: '1',
          disabled: this.hasSubmit
        }
      ];
      return options;
    },
    // 显示性别选择
    showGenderVisible() {
      if (this.hasSubmit) {
        return false;
      }
      this.slots[0].defaultIndex = this.userData.sex === 1 ? 0 : 1;
      this.genderVisible = true;
    },
    // 选择性别
    genderChange(picker, value) {
      this.userData.sex = value[0].key;
    },
    // 上传图片
    addImgUrl(data) {
      this.userData.imgs = data.url;
    },
    // 删除图片
    removeImgUrl() {
      this.userData.imgs = '';
    },
    // 提交
    submit() {
      let _this = this;
      if (this.sending) {
        return false;
      }
      let url = '/api/visitform/submit';
      let form = this.userData;
      let item = [];
      let items = this.items;
      // 验证是否已填写完问诊单
      if (form.name === '' || form.name.length < 1) {
        Toast('请填写姓名！');
        return false;
      }
      if (form.sex === '') {
        Toast('请选择年龄！');
        return false;
      }
      if (form.age === '' || form.age.length < 1) {
        Toast('请填写年龄！');
        return false;
      }
      if (form.mobile === '' || form.mobile.length < 1) {
        Toast('请填写手机号！');
        return false;
      }
      if (!validatPhone(form.mobile)) {
        Toast('请填写正确手机号！');
        return false;
      }
      if (form.symptom === '' || form.symptom.legnth < 1) {
        Toast('请填写症状！');
        return false;
      }
      if (form.interrogation_type === '' || form.interrogation_type.length === 0) {
        Toast('请选择问诊类型！');
        return false;
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].answer === '' || items[i].answer.length === 0) {
          Toast(`第${i+1}题不能为空！`);
          return false;
        }
        if (items[i].type === 'CheckBox') {
          let answers = items[i].answer.toString();
          item.push({
            id: items[i].id,
            answer: answers
          });
        } else {
          item.push({
            id: items[i].id,
            answer: items[i].answer
          });
        }
      }
      let params = {
        id: form.id, // 问诊单卷ID
        name: form.name, // 患者姓名
        sex: form.sex, // 性别
        age: form.age, // 年龄
        mobile: form.mobile, // 电话
        symptom: form.symptom, // 症状
        medical_history: form.medical_history, // 病史
        imgs: form.imgs, // 图片集合
        items: item // 问诊单项答案集合
      };
      _this.sending = true;
      docAjax.post(url, params).then(res => {
        _this.sending = false;
        if (res.status === 200 && res.data.code === 0) {
          let consults = JSON.parse(sessionStorage.getItem('consultData'));
          // 定义消息类型
          let messageName = 'UnknownMessage';
          let objectName = "app:doctorComfirmPresc";
          let mesasgeTag = new RongIMLib.MessageTag(true, true);
          let prototypes = ['content'];
          RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
          // 发送自定义消息
          let conversationType  = RongIMLib.ConversationType.GROUP; // 单聊,其他会话选择相应的消息类型即可。
          let targetId = consults.groupid;
          let data = {
            title: _this.$route.query.inquiryTitle,
            id: _this.$route.query.inquiryId
          }
          data = JSON.stringify(data);
          let msg = new RongIMClient.RegisterMessage.UnknownMessage({ content: data });
          RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function (message) {
              console.log('发送自定义消息成功');
              window.location.href = '/inquiry/doing';
            },
            onError: function (errorCode) {
              console.log('发送自定义消息失败');
            }
          });
        }
      }).catch(res => {
        _this.sending = false;
        Toast(res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
.inquirySheet {
  width: 100%;
  height: 100%;
  & /deep/ .mint-radio-label, & /deep/ .mint-checkbox-label {
    vertical-align: middle;
    margin-left: 25px;
    width: 65px;
    line-height: 1.5;
    font-size: 12px;
    font-weight: 700;
  }
  & /deep/ .mint-button--primary {
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #d74949;
  }
  & /deep/ .mint-header-title {
    font-size: 18px;
  }
  .inquirySheet_body {
    position: absolute;
    top: 44px;
    left: 0;
    right: 0;
    bottom: 41px;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &.has-submit {
      bottom: 0;
    }
    .common {
      padding: 6px 15px;
      width: 100%;
      // height: auto;
    }
    .inquiry_f {
      width: 100%;
      min-height: 100%;
      background-color: #fff;
      font-size: 10px!important;
      font-weight: 600;
      .symptomList {
        & /deep/ .mint-radiolist-title {
          color: #000;
          font-weight: 700;
        }
        & /deep/ .mint-cell-title {
          width: 100%;
          .mint-radiolist-label {
            display: flex;
          }
        }
        & /deep/ .mint-checklist-title {
          color: #000;
          font-weight: 700;
        }
        & /deep/ .mint-cell-title {
          width: 100%;
          .mint-checklist-label {
            display: flex;
          }
        }
        &.flex {
          display: flex;
        }
        em {
          padding-top: 9px;
          color: #ff0000;
        }
        .mt-option {
          flex: 1;
        }
        .text-box {
          padding-top: 8px;
        }
      }
      .picture {
         .upppImg {
           width: 100%;
           height: 80px;
           display: flex;
           justify-content: flex-start;
           margin-top: 5px;
           .pic {
             width: 80px;
             height: 80px;
             background: url('./imgs/inquiry_order_example_icon.png') center center no-repeat;
             background-size: cover;
             margin-left: 10px;
             text-align: center;
             line-height: 80px;
           }
           & /deep/ .upload-wrapper {
             width: 80px;
             height: 80px;
             .uploadImg, .havaDataimg, .havaDataimg img {
               width: 100%;
               height: 100%;
             }
           }
         }
      }
      .symptom {
        h2 {
          margin-bottom: 16px;
        }
        & /deep/ .mint-cell-title {
          width: 0!important;
        }
        & /deep/ textarea {
          padding: 10px 5px;
          border: 1px solid #999;
          height: 70px;
        }
        em {
          color: #ff0000;
          margin-right: 2px;
        }
      }
      & .newsInput {
        .newsK {
          width: 33%;
          float: left;
          display: flex;
          & /deep/ .mint-cell-text {
            font-size: 10px!important;
          }
          em {
            line-height: 48px;
            color: #ff0000;
            margin-right: 2px;
          }
        }
        .gender {
          min-height: 48px;
          align-items: center;
          .gender-show {
            color: #888;
            background: #ebebe4;
            padding: 0 10px 0 5px;
            height: 19px;
          }
        }
        overflow: hidden;
        & /deep/ .mint-cell {
          float: left;
        }
      }
      & /deep/ .mint-cell-wrapper {
        padding: 0;
        .mint-cell-title {
          width: 30px;
          display: flex;
          align-items: center;
        }
        .mint-cell-value {
          font-size: 10px;
          align-items: center;
        }
      }
    }
  }
  .gender-choose {
    width: 100%;
    /deep/.gender-option {
      width: 100%;
    }
  }
  /deep/.mint-radio-input[disabled]:checked + .mint-radio-core {
    background-color: #26a2ff;
    border-color: #26a2ff;
  }
  /deep/.interrogation-type {
    display: flex;
    em {
      padding-top: 9px;
      color: #ff0000;
    }
    .mint-radiolist-title {
      color: #000;
      font-weight: 700;
      margin: 8px 5px;
    }
    .mint-cell {
      display: inline-block;
      .mint-cell-wrapper .mint-cell-title {
        width: auto;
        .mint-radiolist-label {
          display: flex;
          .mint-radio-label {
            margin-left: 10px;
          }
        }
      }
    }
  }
}
</style>