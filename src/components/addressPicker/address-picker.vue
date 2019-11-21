<template>
  <div class="address-picker">
    <transition name="fade">
      <div class="mask" @click="cancel" v-if="addressShow"></div>
    </transition>
    <transition name="animate">
      <div class="picker" v-if="addressShow">
        <div class="picker-head">
          <div>
            <span @click="cancel">取消</span>
          </div>
          <div>
            <span @click="ok">确定</span>
          </div>
        </div>
        <div class="picker-wrap">
          <div class="content">
            <div class="content-item" v-picker.province="{set:set}" ref="province">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of address" :class="{color:index==pIndex}" :key="val.name">{{val.name}}</div>
              </div>
            </div>
            <div class="content-item" v-picker.city="{set:set}" ref="city">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of city" :class="{color:index==cIndex}" :key="index">{{val.name?val.name:val}}</div>
              </div>
            </div>
            <div class="content-item" v-show="!hasTown" v-picker.town="{set:set}" ref="town">
              <div class="picker-item">
                <div class="item" v-for="(val,index) of town" :class="{color:index==tIndex}" :key="val">{{val}}</div>
              </div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import address from './address-data.js';
export default {
  /**
   * 使用：
   * 1.必须传一个props:'addressShow'，布尔值，控制地址选择器显示与否
   * 2.自定义ok和cancel事件，表示当address-picker组件点击确定按钮和取消按钮的操作，
   * 3.ok事件将当前选中的省市区传给父组件事件，cancel事件让父组件的addressShow值变为false
   */
  props: ['addressShow'],
  data() {
    return {
      address: address,
      pIndex: 0,
      cIndex: 0,
      tIndex: 0
    };
  },
  computed: {
    province() {
      return this.address[this.pIndex].name;
    },
    city() {
      return this.address[this.pIndex].cityList.length === 1 ? this.address[this.pIndex].cityList[0].areaList : this.address[this.pIndex].cityList;
    },
    town() {
      return this.address[this.pIndex].cityList.length === 1 ? [] : this.address[this.pIndex].cityList[this.cIndex].areaList;
    },
    hasTown() {
      return this.address[this.pIndex].cityList.length === 1;
    }
  },
  methods: {
    ok() {
      let pro = this.province;
      let cit = this.city[this.cIndex].name || this.city[this.cIndex];
      let tow = this.town[this.tIndex] ? this.town[this.tIndex] : '';
      // 每次点击确定事件，将地址选择器重置到初始状态
      this.pIndex = 0;
      this.cIndex = 0;
      if (pro === '北京市' || pro === '天津市' || pro === '重庆市' || pro === '上海市') {
        let tem = pro;
        let tem2 = cit;
        // let tem3 = tow;
        pro = tem.substring(0, 2);
        cit = tem;
        tow = tem2;
      }
      this.$emit('ok', { province: pro, city: cit, town: tow });
    },
    cancel() {
      // 每次点击取消事件，将地址选择器重置到初始状态
      this.pIndex = 0;
      this.cIndex = 0;
      this.$emit('cancel');
    },
    set(name, index) {
      if (name === 'province') {
        this.pIndex = index;
      } else if (name === 'city') {
        this.cIndex = index;
      } else {
        this.tIndex = index;
      }
    }
  },
  watch: {
    pIndex() {
      this.cIndex = 0;
      this.tIndex = 0;
      if (this.pIndex === 0) {
        this.$refs.province.children[0].style.transform = 'translateY(0)';
      }
      this.$refs.city.children[0].style.transform = 'translateY(0)';
      this.$refs.town.children[0].style.transform = 'translateY(0)';
    },
    cIndex() {
      this.tIndex = 0;
      this.$refs.town.children[0].style.transform = 'translateY(0)';
    }
  },
  directives: {
    picker: {
      bind(el, binding) {
        let startY = '';
        let differY = '';
        let currentY = 0;
        let len = el.children[0].children.length;
        let dom = el.children[0];
        let index = 0;
        let maxY = -(len - 1);
        let r = 26;
        el.addEventListener('touchstart', (e) => {
          e.preventDefault();
          if (dom.style.transform === 'translateY(0px)') {
            currentY = 0;
            maxY = -(el.children[0].children.length - 1);
          }
          let ev = e.touches[0];
          startY = ev.clientY;
        });
        el.addEventListener('touchmove', (e) => {
          e.preventDefault();
          let ev = e.touches[0];
          differY = ev.clientY - startY;
          dom.style.transition = 'transform 0s';
          dom.style.transform = `translateY(${currentY * r + differY}px)`;
        });
        el.addEventListener('touchend', (e) => {
          e.preventDefault();
          let ev = e.changedTouches[0];
          differY = ev.clientY - startY;
          dom.style.transition = 'transform .3s';
          if (differY <= -r / 2) {
            currentY += Math.floor(differY / r);
            if (currentY <= maxY) currentY = maxY;
          } else if (differY >= r / 2) {
            currentY += Math.floor(differY / r);
            if (currentY >= 0) currentY = 0;
          }
          dom.style.transform = `translateY(${currentY * r}px)`;
          index = Math.floor(Math.abs(currentY / 1)); // 记录当前位移在数组中的索引,必须取整，否则会出现浮点数
          let name = '';
          if (binding.modifiers.province) {
            name = 'province';
          } else if (binding.modifiers.city) {
            name = 'city';
          } else if (binding.modifiers.town) {
            name = 'town';
          }
          binding.value.set(name, index);
        });
      }
    }
  }
};

</script>
<style lang="less" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .3s linear;
}

.fade-enter,
.fade-leave-to {
  opacity: 1;
}

.animate-enter-active,
.animate-leave-active {
  transition: all .3s;
}

.animate-enter,
.animate-leave-to {
  transform: translateY(100%);
}

.mask {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  z-index: 1;
  background: rgba(0, 0, 0, .6);
}

.picker .color {
  color: #000;
  font-weight: bold;
}

.picker {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 10;
  right: 0;
  height: 150px;
  background: #fff;
}

.picker-head {
  display: flex;
  justify-content: space-around;
  padding: 0 .3em;
  height: 36px;
  font-size: 15px;
  color: #2395ff;
  background: #efefef;
}

.picker-head div {
  flex-grow: .4;
  line-height: 36px;
}

.picker-head div:nth-child(1) {
  text-align: left;
}

.picker-head div:nth-child(2) {
  text-align: right;
}

.picker-wrap {
  position: relative;
  height: 130px;
}

.line {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-13px);
  width: 100%;
  height: 26px;
  border-top: .02em solid #ddd;
  border-bottom: .02em solid #ddd;
}

.content {
  display: flex;
  width: 100%;
  height: 100%;
}

.content-item {
  flex: 1;
  height: 100%;
  overflow: hidden;
  transition: width .3s;
}

.picker-item {
  position: relative;
  z-index: 11;
  width: 100%;
  top: 52px;
  height: auto;
}

.item {
  height: 26px;
  line-height: 26px;
  font-size: 13px;
  color: #707274;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

</style>
