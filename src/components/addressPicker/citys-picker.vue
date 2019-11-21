<template>
  <div class="citys-picker-wrapper">
    <div class="citys" v-for="c in citys.citys" :key="c.initial">
      <a class="letter" :name="c.initial">{{c.initial}}</a>
      <ul class="citylist">
        <li v-for="(city,index) in c.list" :key="index" @click.stop="selectCity(city.name)">{{city.name}}</li>
      </ul>
    </div>
    <ul class="links">
      <li><a href="javascript:;"  @click.stop="letter_nav('top')">热门</a></li>
      <li v-for="c in citys.citys" :key="c.initial"><a :href="'#'+c.initial"  @click.stop="letter_nav">{{c.initial}}</a></li>
    </ul>
  </div>
</template>
<script>
import citys from './citys-data.js';
export default {
  data() {
    return {
      citys: citys
    };
  },
  methods: {
    letter_nav(p) {
      this.$emit('nav', p);
    },
    selectCity(cname) {
      this.$emit('selectCity', cname);
    }
  }
};

</script>
<style lang="less" scoped>
@import '../../styles/mixin.less';

.citys-picker-wrapper {
  font-size: 14px;

  .citys {
    .letter {
      padding-left: 14px;
      background-color: #f5f5f5;
      color: #666;
      line-height: 25px;
      display: block;
    }

    .citylist {
      li {
        line-height: 44px;
        padding-left: 14px;

        &:nth-child(2n+2) {
          .border-1px(#e0e0e0);
        }

        &:last-child {
          &:after {
            border: none;
          }
        }
      }
    }
  }

  .links {
    position: fixed;
    right: 0;
    top: 200px;
    bottom: 0;
    height: 70%;

    li {
      text-align: center;
      width: 30px;
      line-height: 15px;
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 11px;
        color: #959595;
      }
    }
  }
}

</style>
