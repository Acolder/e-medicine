<myComment></myComment>
<template>
  <div id="waiting">
    <mt-header title="罗医生">
      <router-link to="/inquiry/intoSecond" slot="left">
        <mt-button icon="back"></mt-button>
      </router-link>
      <mt-button slot="right" :class='[btnClass]'>结束问诊</mt-button>
    </mt-header>
    <div class="page" id="page">
      <div class="box-timeDown">
        <span class="mes-1">已等候时间:</span>
        <span class="mes-2">{{TIME}}</span>
      </div>
      <me-chat name="罗医生" message="请您耐心等待" actor='doctor'>
      </me-chat>
    </div>
  </div>
</template>
<script>
import { Header }  from 'mint-ui';
import page  from './modules/page';
import Timer  from './modules/timer';
import RY  from './rongyun/rongyun';
import chat from  '@/components/chat/chat.vue';
import ajax from '@/utils/ajax';
// const queryString = require('query-string');
export default {
  name: 'waiting',
  components: {
    'mt-header': Header,
    'me-chat': chat,
  },
  data: function () {
    return {
      TIME: '',
      value: 'helloword',
      btnClass: 'btn-right',
      consult: {}
    };
  },
  computed: {},
  mounted: function () {
    page.selfAdaptionScreen();
    /*    let string;
        const hash = location.hash;
        let index = hash.indexOf('?');
        // if has entrytime and consultid
        if (index !== -1) {
          string = hash.substr(index + 1);
          const consult = queryString.parse(string);
          this.consult = consult;
          // put UtCData to nomal data
          Timer.setTime(Timer.subtractingTime(consult.entrytime));
          Timer.countUp();
          this.refreshTime();
        } else {
          console.info('~~~~consult is empty!');
        } */
    this.getStatus();
  },
  methods: {
    refreshTime: function () {
      setTimeout(() => {
        this.TIME = Timer.getModifyTime();
        this.refreshTime();
      }, 1000);
    },
    getStatus: function () {
      let url = 'api/user/isExistsMember';
      ajax.get(url).then((res) => {
        if (res.data.code === 0 && res.status === 200) {
          console.info('linked success!');
          // 1.没有咨询中，候诊中的订单，且没有就诊人,即(第一次进入)
          if (!res.data.data.isexistsmember && res.data.data.consultstatus === 2) {
            // 第一次进入页面
            window.location.href = '/#/inquiry/guideDefault';
          }
          // 2.没有咨询中，候诊中的订单，且有就诊人，（第二次进入）
          if (res.data.data.isexistsmember && res.data.data.consultstatus === 2) {
            window.location.href = '/#/inquiry/intoSecond';
          }
          // 3.有候诊中的订单，返回: IsExistsMember="true(有就诊人)", ConsultID=“咨询单ID”  ConsultStatus=“咨询状态（候诊中=0）”  EntryTime=“进入候诊开始时间”  GroupId=“融云群组ID”  WatingSeconds=“等待秒”  DoctorName=“医生姓名” DoctorID=“医生ID”
          // 候诊中
          if (res.data.data.isexistsmember && res.data.data.consultstatus === 0) {
            console.info('waiting:', res.data.data);
            /* Timer.setTime(Timer.subtractingTime(new Date(res.data.data.entrytime).getTime()));
             Timer.countUp();
             this.refreshTime(); */
            let groupid = res.data.data.groupid;
            console.info('groupid:', groupid);
            RY.initiate(groupid);
            RY.setMsg({ content: 'sdfsfsfsf！' }, groupid);
          }
          // 4.有候诊中的订单，返回: IsExistsMember="true(有就诊人)", ConsultID=“咨询单ID”  ConsultStatus=“咨询状态（候诊中=0）”  EntryTime=“进入候诊开始时间”  GroupId=“融云群组ID”  WatingSeconds=“等待秒”  DoctorName=“医生姓名” DoctorID=“医生ID”
          // 就诊中
          if (res.data.data.isexistsmember && res.data.data.consultstatus === 1) {
            window.location.href = '/#/inquiry/doing';
          }
        }
      });
    }
  },
};
</script>
<style lang="less" scoped>
  @import "../../styles/mixin";
  @font-size: 16px;
  @font-size-biger: 18px;
  @bg-yellow: #F4DDAA;
  @font-yellow: #D4893A;
  @font-bulue-light: @green-color;
  .btn-right {
    .btn();
    color: @font-bulue-light;
    font-size: @font-size;
  }
  .box-timeDown {
    margin: 0 10px 20px 10px;
    font-size: @font-size;
    color: @font-yellow;
    background-color: @bg-yellow;
    text-align: center;
    padding: 6px 0;
    border-radius: 0.3em;
    .mes-1 {
    }
    .mes-2 {
      margin: 0 0 0 15px;
    }
  }
</style>

