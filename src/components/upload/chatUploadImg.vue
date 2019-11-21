<template>
  <div class="upload-wrapper">
    <div class="noneData">
      <div class="uploadImg" @click="openLocals">
      </div>
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <input type="file"  accept="image/*" :name="fileName" @change="fileChanged"/>
      </form>
    </div>
  </div>
</template>
<script>
import $ from 'jquery';
import { Indicator, Toast } from 'mint-ui';
// import axios from 'axios';
import { webPostObject } from './ossUpload/index.js';
export default {
  data() {
    return {
      uploadLoading: false,
    };
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    }
  },
  methods: {
    // 删除
    removePackage() {
      let _self = this;
      _self.$emit('removeImg');
    },
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
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.bmp') {
        Toast({
          message: '仅支持.jpg、.png、.gif、.jpeg、.bmp的图片格式',
          position: 'bottom',
          duration: 2000
        });
        return false;
      }
      let file = fileElement[0].files[0];
      let imgSize = Math.ceil(file.size / 1024 / 1024);
      console.log(imgSize);
      if (imgSize > 20) {
        Toast({
          message: '文件不能大于20MB,重新选择文件',
          position: 'bottom',
          duration: 2000
        });
        return false;
      }
      _self.uploadLoading = true;
      Indicator.open('上传中...');
      if (imgSize > 2) {
        // 融云web端发送图片
        // 使用canvas将file转为base64达到压缩效果
        let img = new Image();
        let reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
          img.onload = function () {
            let w = img.width;
            let h = img.height;
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            // 设置 canvas 的宽度和高度
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(img, 0, 0, w, h);
            let base64 = null;
            // 将图片压缩在2MB之内
            if (imgSize > 2 && imgSize <= 3) {
              base64 = canvas.toDataURL('image/jpeg', 0.66);
            } else if (imgSize > 3 && imgSize <= 5) {
              base64 = canvas.toDataURL('image/jpeg', 0.4);
            } else if (imgSize > 5 && imgSize <= 6) {
              base64 = canvas.toDataURL('image/jpeg', 0.33);
            } else if (imgSize > 6 && imgSize <= 8) {
              base64 = canvas.toDataURL('image/jpeg', 0.25);
            } else if (imgSize > 8 && imgSize <= 10) {
              base64 = canvas.toDataURL('image/jpeg', 0.2);
            } else if (imgSize > 10 && imgSize <= 15) {
              base64 = canvas.toDataURL('image/jpeg', 0.13);
            } else if (imgSize > 15) {
              base64 = canvas.toDataURL('image/jpeg', 0.1);
            }
            // 将base64转为file
            let minFile = _self.base64toFile(base64, file.name);
            console.log(minFile.size / 1024 / 1024);
            _self.uploadFile(minFile, minFile.name);
            // resolve(base64);
          };
        };
        reader.readAsDataURL(file);
      } else {
        _self.uploadFile(file, file.name);
      }
      // oss web直传
      console.log(file);
    },
    // 将base64转为file
    base64toFile(base64, filename) {
      let arr = base64.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bytes = window.atob(arr[1]); // 去掉url的头，并转换为byte
      let n = bytes.length;
      let u8arr = new Uint8Array(n);
      for (let i = 0; i < bytes.length; i++) {
        u8arr[i] = bytes.charCodeAt(i);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // file上传服务器
    uploadFile(file, filename) {
      let _self = this;
      // oss web直传
      webPostObject(file, filename).then(data => {
        Indicator.close();
        _self.uploadLoading = false;
        $(`input[type='file'][name='${_self.fileName}']`).val(''); // 清空上传控件内容
        _self.$emit('uploadSuccess', data, file);
      }).catch(() => {
        _self.uploadLoading = false;
        $(`input[type='file'][name='${_self.fileName}']`).val(''); // 清空上传控件内容
        Toast({
          message: '图片上传失败',
          position: 'bottom',
          duration: 2000
        });
      });
    }
  },
};
</script>
<style lang="less" scoped>
.upload-wrapper{
  position: relative;
}
.noneData {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .uploadImg{
    width: 50px;
    height: 50px;
    background-size: 100% 100%;
    background-image: url(./imgs/icon_photo.png);
  }
}
</style>
