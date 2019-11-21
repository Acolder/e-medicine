<template>
  <div class="upload-wrapper">
    <div v-if="!imgUrl" class="noneData">
      <div class="sample">
        <img src="./imgs/picture_cfsl.png" alt="" @click.stop="examples">
        <!-- <div class="icon" @click.stop="customerService()"></div> -->
      </div>
      <div class="sampleTxt">
        <div class="uploadImg" @click="openLocals">
          <img src="./imgs/pfgy_upload.png" alt="">
          <span>上传处方图片</span>
        </div>
        <div class="interrogation" @click.stop="interrogation">没有处方？找医师开</div>
      </div>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <input ref="pathClear" type="file"  accept="image/*" :name="fileName" @change="fileChanged"/>
      </form>
    </div>
    <div v-else class="havaData">
      <div class="havaDataimg">
        <div class="img_wap">
          <img :src="imgUrl" alt="" @click.stop="bigPicture">
        </div>
        <!-- <div class="icon" @click.stop="customerService()"></div> -->
      </div>
      <div class="sampleTxt">
        <div class="uploadImg" @click.stop="removePackage">
          <img src="./imgs/pfzy_delete.png" alt="">
          <span>删除处方图片</span>
        </div>
      </div>
    </div>
    <div class="maxImg" @click="minImg" v-if="maxImg">
      <img :src="imgUrl" alt="">
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import { Indicator, Toast } from 'mint-ui';
// import axios from 'axios';
import { intoInquiry } from '@/api/user';
import { webPostObject } from './ossUpload/index.js';
export default {
  data() {
    return {
      maxImg: false,
    };
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
    // 图片地址
    imgUrl: {
      type: String,
      default: '',
      required: true
    },
    // 图片地址
    isMaxIMg: {
      type: String,
      default: '',
      required: true
    },
  },
  methods: {
    // 在线问诊
    interrogation() {
      intoInquiry();
    },
    // 处方示例
    examples() {
      this.$router.push('/patSquare/examples');
    },
    // 问客服
    customerService() {
      console.log('问客服');
    },
    // 查看大图
    bigPicture() {
      console.log(this.isMaxIMg);
      if (this.isMaxIMg === '0') {
        return false;
      }
      this.maxImg = true;
    },
    // 恢复小图
    minImg() {
      this.maxImg = false;
    },
    // 删除图片
    removePackage() {
      let _self = this;
      _self.$emit('removeImg');
    },
    // 上传图片
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    fileChanged() {
      this.uploadImg();
    },
    uploadImg() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.bmp') {
        Toast({
          message: '仅支持.jpg、.png、.jpeg、.bmp的图片格式',
          position: 'bottom',
          duration: 2000
        });
        return false;
      }
      let file = fileElement[0].files[0];
      let imgSize = Math.ceil(file.size / 1024 / 1024);
      if (imgSize > 20) {
        Toast({
          message: '文件不能大于20MB,重新选择文件',
          position: 'bottom',
          duration: 2000
        });
        _self.$refs.pathClear.value = '';
        return false;
      }
      Indicator.open('图片正在上传中...');
      // 服务器上传
      // let formdata1 = new FormData();
      // formdata1.append('file', file, file.name);
      // let config = {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // };
      // axios.post(`${process.env.UPLOAD_HOST}`, formdata1, config).then((res) => {
      //   console.log(res);
      //   let data = res.data;
      //   Indicator.close();
      //   if (data) {
      //     _self.$emit('uploadSuccess', data[0]);
      //   }
      // }).catch(() => {
      //   Indicator.close();
      //   Toast({
      //     message: '图片上传失败',
      //     position: 'bottom',
      //     duration: 2000
      //   });
      // });
      // oss web直传
      webPostObject(file, file.name).then(data => {
        console.log(data);
        Indicator.close();
        _self.$emit('uploadSuccess', data);
      }).catch(() => {
        Indicator.close();
        Toast({
          message: '图片上传失败',
          position: 'bottom',
          duration: 2000
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.upload-wrapper{
  height: 100%;
}
.noneData,.havaData{
  position: relative;
  height: 100%;
}
.sample{
  width: 100%;
  height: 200px;
  position: relative;
  img{
    width: 100%;
    height: 100%;
  }
  // .icon{
  //   position: absolute;
  //   width: 40px;
  //   height: 40px;
  //   background-image: url(./imgs/home_btn_wkf.png);
  //   background-size: 100% 100%;
  //   right: 15px;
  //   top: 80px;
  // }
}
.sampleTxt{
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  .uploadImg{
    width: 120px;
    height: 36px;
    border-radius: 2px;
    border: solid 1px #999999;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
      width: 16px;
      height: 14px;
      margin-right: 3px;
    }
    span{
      font-size: 12px;
      color: #333333;
    }
  }
  .interrogation{
    position: absolute;
    color: #d74949;
    right: 0px;
    font-size: 12px;
  }
}
.havaDataimg{
  width: 100%;
  height: 200px;
  position: relative;
  border: 1px solid #eeeeec;
  overflow: hidden;
  .img_wap{
    // width: 100%;
    // height: 0px;
    // padding-bottom: 56%;
    // position: relative;
    img{
      width: 100%;
      // position: absolute;
      // top: -30%;
      // left: 0px;
    }
  }
  .icon{
    position: absolute;
    width: 40px;
    height: 40px;
    background-image: url(./imgs/home_btn_wkf.png);
    background-size: 100% 100%;
    right: 15px;
    top: 80px;
  }
}
// 大图效果
.maxImg{
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  overflow: auto;
  background-color:rgba(0, 0, 0, 0.5);
  z-index: 100;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  img{
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
