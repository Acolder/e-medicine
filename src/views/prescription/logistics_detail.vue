<template>
  <div class="page">
    <div class="wuliu">
      <mt-header fixed title="物流详情">
        <mt-button icon="back" slot="left" onclick="history.go(-1)"></mt-button>
      </mt-header>
      <!-- logisticsInfo.company.logis_company && logisticsInfo.company.logis_num中药煎煮 -->
      <!-- logisticsInfo.com && logisticsInfo.nu西药 -->
      <!-- this.$route.query.logistics_company && this.$route.query.km_order_id中药非煎煮 -->
      <div class="logisticsCompany" v-if="(logisticsInfo.company.logis_company && logisticsInfo.company.logis_num) ||
                                          (logisticsInfo.com && logisticsInfo.nu) ||
                                          (this.$route.query.logistics_company && this.$route.query.km_order_id)">
        <div>
          <span>物流公司：</span>
          <span>{{logisticsInfo.company.logis_company || logisticsInfo.com || this.$route.query.logistics_company}}</span>
        </div>
        <div>
          <span>物流单号：</span>
          <span>{{ logisticsInfo.company.logis_num || logisticsInfo.nu || this.$route.query.km_order_id }}</span>
        </div>
      </div>
      <div class="logisticsInformation">
        <ul class="logistics-wrapper" v-if="logisticsInfo.list && logisticsInfo.list.length>0">
          <li class="logistics-item" v-for="(item, index) in logisticsInfo.list" :key="index">
            <div class="item-left">
              <i class="logistics-signal"></i>
              <div class="ftime">{{item.current_lo_time || item.ftime || item.AcceptTime}}</div>
            </div>
            <div class="item-right">
              {{item.addr_info || item.context || item.AcceptStation}}
            </div>
          </li>
        </ul>
        <div style="textAlign: center" v-else>
          暂无物流信息，请耐心等待~
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import yilin from '@/utils/yilinApiRequest.js';
import ajax from '@/utils/ajax.js';
import java from '@/utils/javaApiRequest.js';
import medicineRequest from '@/utils/WmedicineRequest.js';
export default {
  data() {
    return {
      logisticsInfo: {
        company: {
          logis_company: '',
          logis_num: '',
          order_id: ''
        },
        list: []
      },
      logisticsInfo2: {},
      lastLogis: { // 物流信息及时间
        'current_lo_time': '',
        'addr_info': ''
      },
    };
  },
  methods: {
    // 非西药物流信息
    getLogis(orderId) {
      let url = '/api/system/GetOutsideUrl';
      let params = {
        'url': `http://www.kmzhyf.cn:8182/zyf/web?order_id=${orderId}&methodName=getWLInfoNoValicode`
      };
      ajax.get(url, {
        params: params
      }).then((res) => {
        console.log(JSON.parse(res.data.data));
        if (res) {
          let response = JSON.parse(res.data.data);
          if (res.status === 200 && response && response.head && response.head.code === '0' && response.data) {
            this.logisticsInfo = response.data;
            console.log('非西药物流信息获取成功', this.logisticsInfo);
          }
        }
      });
    },
    // 获取物流订单---通过用户详情
    getLogis1(order_id) {
      if (!order_id) {
        return;
      }
      let url = '/mall/order/queryUserOrderDetailByOrderId';
      let param = {
        'orderId': order_id,
      };
      java.post(url, param).then((res) => {
        if (res) {
          let response = res.data;
          if (res.status === 200 && response && response.resultCode === '0' && response.resultData) {
            let { logisticsNumber, logisticsType, orderId } = response.resultData;
            this.logisticsInfo2 = { logisticsNumber, logisticsType, orderId };
            console.log('1.用户详情信息获取成功，开始转换物流类型', this.logisticsInfo2);
            this.queryKdnName(this.logisticsInfo2.logisticsType);
          }
        }
      });
    },
    // 转换物流类型，兼容旧接口
    queryKdnName(type) {
      let url = '/mall_suport/back/order/queryKdnName';
      let param = {
        type: type
      };
      medicineRequest.post(url, param).then(res => {
        if (res.status === 200 && res.data.resultCode === '0' && res.data.resultData) {
          this.logisticsInfo2.logisticsType = res.data.resultData.kdnName;
          console.log('2.物流类型转换成功，开始获取西药物流信息', this.logisticsInfo2);
          this.getLogis2();
        }
      });
    },
    // 获取西药物流信息
    getLogis2() {
      // 西药接口
      let url = '/mall_suport/back/order/logisticsInfo';
      let param = this.logisticsInfo2;
      medicineRequest.post(url, param).then((res) => {
        if (res) {
          let response = res.data;
          if (res.status === 200 && response && response.resultCode === '0' && response.resultData) {
            // this.logisticsInfo = response.resultData;
            this.logisticsInfo.company.logis_company = response.resultData.ShipperCode || ''; // 快递公司
            this.logisticsInfo.company.logis_num = response.resultData.LogisticCode || ''; // 物流单号
            this.logisticsInfo.list = response.resultData.Traces; // 时间与描述
            console.log('3.西药物流信息获取成功', this.logisticsInfo);
          }
        }
      });
    },
  },
  mounted() {
    if (this.$route.query.km_order_id) {
      console.log('有ID');
      if (Number(this.$route.query.prescr_type) === 1) {
        console.log('>>>>开始获取西药物流信息<<<<');
        this.getLogis1(this.$route.query.km_order_id);
      } else {
        console.log('>>>>开始获取非西药物流信息<<<<');
        this.getLogis(this.$route.query.km_order_id);
      }
    } else {
      console.log('没有KMORDERID,无法查询物流信息');
      // this.logisticsInfo = this.$route.params.logisticsInfo;
      // 西药物流
      // this.logisticsInfo.company.logis_company = this.$route.params.logisticsInfo.com ? this.$route.params.logisticsInfo.com : '';
      // this.logisticsInfo.company.logis_num = this.$route.params.logisticsInfo.nu ? this.$route.params.logisticsInfo.nu : '';
      // this.logisticsInfo.list = this.$route.params.logisticsInfo.data;
      // console.log(this.logisticsInfo.list);
    }
  }
};

</script>
<style scoped lang="less">
@white: #fff;

.page {
  padding-top: 44px;
  height: 100%;
  background-color: #f5f5f5;
  .wuliu {
    background-color: #F5F5F5;
  }
}

.logisticsCompany {
  top: 44px;
  height: 68px;
  padding: 16px 0 16px 10px;
  background: #ffffff;
  margin-bottom: 10px;
}

.logisticsInformation {
  padding: 15px 10px;
  // background: @white;

  .logistics-wrapper {
    .logistics-item {
      font-size: 12px;
      line-height: 12px;
      color: #666666;
      display: flex;

      .item-left {
        width: 84px;
        height: 62px;
        // border-right: 1px solid #e0e0e0;
        position: relative;
        padding-right: 12px;
        text-align: right;
        line-height: 14px;

        .logistics-signal {
          position: absolute;
          width: 6px;
          height: 6px;
          right: -3px;
          background: url(./img/icon-wla@2x.png);
          background-size: 100% 100%;
        }
      }

      .item-right {
        width: 270px;
        padding-left: 12px;
        padding-bottom: 10px;
        line-height: 16px;
        border-left: 1px solid #e0e0e0;
      }
    }

    >li:first-child {
      color: #f75858;

      .item-left {
        height: 67px;

        .logistics-signal {
          width: 9px;
          height: 9px;
          right: -4.5px;
          background: url(./img/icon-wlb@2x.png);
          background-size: 100% 100%;
        }
      }
    }

    >li:nth-child(3) {
      .day {
        float: right;
      }
    }

    >li:last-child {
      .item-left {
        border: none;
        height: 26px;

        .logistics-signal {
          background: url(./img/icon-wlc@2x.png);
          background-size: 100% 100%;
        }
      }
    }
  }
}

</style>
