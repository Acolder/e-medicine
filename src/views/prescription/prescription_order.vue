<template>
  <div class="has-header prescription-body" :class="{'pre-body-white': noData}">
    <mt-header fixed title="处方服务单">
      <!-- <router-link to="/" slot="left"> -->
        <mt-button icon="back" slot="left" onclick="history.go(-1)"></mt-button>
      <!-- </router-link> -->
    </mt-header>
    <div class="load-more-container" :style="{ '-webkit-overflow-scrolling': scrollMode }">
      <div class="nav-bar">
        <div class="menu-item" v-for="(menu, index) in menus" :key="index+'a'" :class="{active:activeId===menu.id}" @click="menuClick(menu)">
          {{ menu.name }}
        </div>
      </div>
      <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :auto-fill="false" :bottomPullText="bottomText" ref="loadmore">
        <div class="list-container">
          <!--全部-->
          <ul class="order-list" :style="{'minHeight': listF ? '84vh': ''}">
            <li v-for="(order, index) in allOrderData" :key="index"  @click.stop="gotoDetail(order.order_id)">
              <!--待确认-->
              <div v-if="order.status === 5 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <label class="left valid-txt">(有效期3天)</label>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：待确认
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <!--普通下单-->
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-confirm right" @click.stop="confirmOrder(order.order_id, order.source_id, order.order_type, order.order_status)">确认处方</button>
                  <!-- <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button> -->
                </div>
              </div>
              <!--已确认（待收货）-->
              <div v-if="(order.status === 10 || order.status === 15) && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：待收货
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-logistics right" @click.stop="gotoLogistics(order.order_id, order.km_order_id, order.docprescriptions['0'].prescr_type, order.logistics_company)">查看物流</button>
                </div>
              </div>
               <!--已确认（待发货）-->
              <div v-if="order.status === 7 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：待发货
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
              <!--待审核-->
              <div v-if="order.status === 0 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：待审核
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-cancel right" @click.stop="cancelOrder(order.order_id)">取消服务单</button>
                </div>
              </div>
              <!--已取消-->
              <div v-if="(order.status === 106 || order.status === 97 || order.status === 102 || order.status === 99 || order.status === 101 || order.status === 103) && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药: 已取消
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
              <!--已完成-->
              <div v-if="order.status === 20 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">已完成</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药: 已完成
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
              <!--审核失败-->
              <div v-if="(order.status === 98 || order.status === 100 || order.status === 105) && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">审核未通过</span>
                </div>
                <div class="detail" v-if="(order.status === 98 ||order.status === 100 || order.status === 105) && order.order_type === '1'">
                  <p>
                    拍方抓药：审核未通过
                  </p>
                </div>
                <div class="detail" v-else-if="(order.status === 98 ||order.status === 100 || order.status === 105) && order.order_type !== '1'">
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
              <!--待医网签-->
              <div v-if="order.status === 6 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">{{ order.statusname }}</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：待医网签
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
              <!--已过期-->
              <div v-if="order.status === 104 && order.prescr_type !== 7">
                <div class="status clearfix">
                  <span class="left">{{ order.create_time.substring(0, 16) }}</span>
                  <span class="status-name">已过期</span>
                </div>
                <!--拍方抓药-->
                <div class="detail" v-if="Number(order.order_type) === 1">
                  <p>
                    拍方抓药：已过期
                  </p>
                  <p v-if="order.docprescriptions[0].docprescriptiondetails.length > 0">
                    抓药清单：{{ GETTITLE(order.docprescriptions[0]) }}
                    <span v-for="(herb, herbIndex) in order.docprescriptions[0].docprescriptiondetails" :key="herbIndex+'t'">
                         {{Number(order.docprescriptions[0].prescr_type) === 1 || Number(order.docprescriptions[0].prescr_type) === 6 ? herbIndex === 0 ? '' : '、' : '、'}}{{herb.medicines}}
                    </span>
                  </p>
                </div>
                <div class="detail" v-else>
                  <p>
                    <span class="name">就诊人：{{ order.docprescriptions[0].username }}</span>
                    <span class="name">开方医生：{{ order.real_name }}</span>
                  </p>
                  <p>诊断：{{ order.zhenduan }}</p>
                </div>
                <div class="footer clearfix">
                  <span v-if="ISFLAG(order)">服务单金额&nbsp;&nbsp;合计: &yen; {{ order.order_price.toFixed(2) }}</span>
                  <button class="btn to-detail right" @click.stop="gotoDetail(order.order_id)">查看服务单</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </mt-loadmore>
      <div class="no-more" v-show="showNomore">没有更多了</div>
      <div class="no-data" v-show="noData">
        <img src="./img/icon_zwdd1.png" /><br/>暂无服务单
      </div>
    </div>
  </div>
</template>

<script>
import  { Header, Button, Loadmore, Indicator, MessageBox, Toast } from 'mint-ui';
import docAjax from '@/utils/doctorAjax';
import { getUserInfo, goLogin } from '@/api/user';
import { getQueryString } from '@/utils/index';
export default {
  name: 'prescription-order',
  data() {
    return {
      activeId: 1, // tab选中项
      userId: '', // userId
      allOrderData: [], // 全部订单数据
      dataStatus: 'data_all', // 请求订单状态
      menus: [
        { name: '全部', status: 'data_all', id: 1 },
        { name: '待确认', status: 'data_not_confirm', id: 2 },
        { name: '已确认', status: 'data_confirmed', id: 3 },
        { name: '审核失败', status: 'data_audit_fail', id: 4 },
        { name: '已取消', status: 'data_cancled', id: 5 }],
      // 上拉下拉数据参数
      allLoaded: false, // 是否全部加载完
      scrollMode: 'auto', // 滑动方式
      pageNum: 1, // 页码
      bottomText: '上拉加载更多...',
      showNomore: false, // 没有更多
      noData: false, // 没有订单数据
      listF: true,
      flag: false // tab切换时防止获取的数据与tab不符
    };
  },
  components: {
    'mt-header': Header,
    'mt-button': Button,
    'mt-loadmore': Loadmore
  },
  methods: {
    // 根据返回的丸剂类型return对应的丸剂名称
    GETNAME(num) {
      let nu = Number(num);
      switch (nu) {
        case 0: return '丸剂';
        case 1: return '浓缩丸';
        case 2: return '水丸(包衣)';
        case 3: return '水蜜丸';
        case 4: return '(水丸)素丸';
      }
    },
    // 根据prescr_type返回对应的药品标题
    GETTITLE(order) {
      switch (Number(order.prescr_type)) {
        case 0: {
          return '中药*' + order.amount + '剂';
        }
        case 2: {
          return '膏方*' + order.amount + '剂';
        }
        case 3: {
          return this.GETNAME(order.wj_type) + '*' + order.amount + '剂';
        }
        case 5: {
          return '固定膏方*' + order.amount + '剂';
        }
        default: {
          return '';
        }
      }
    },
    // tab栏切换
    menuClick(menu) {
      if (!this.flag || this.activeId === menu.id) return;
      this.showNomore = false;
      this.dataStatus = menu.status;
      this.activeId = menu.id;
      this.allOrderData = [];
      this.pageNum = 1;
      Indicator.open();
      this.getPrescription();
    },
    // 获取用户信息
    getUserInfoList() {
      let urlActiveId = Number(getQueryString('activeId'));
      if (urlActiveId) {
        this.activeId = Number(urlActiveId);
      }
      switch (urlActiveId) {
        case 1:
          this.dataStatus = 'data_all';
          break;
        case 2:
          this.dataStatus = 'data_not_confirm';
          break;
        case 3:
          this.dataStatus = 'data_confirmed';
          break;
        case 4:
          this.dataStatus = 'data_audit_fail';
          break;
        case 5:
          this.dataStatus = 'data_cancled';
          break;
      }
      getUserInfo().then(resp => {
        if (resp.status === 200 && String(resp.data.code) === '0') {
          this.userId = resp.data.data.userid;
          // 获取处方列表
          console.log(`userId(${this.userId})获取成功，开始获取服务单列表`);
          this.getPrescription();
        } else if (resp.status === 200 && String(resp.data.code) === '-2') {
          Toast('用户未登录，请重新登录!');
          goLogin();
        }
      });
    },
    // 获取处方列表
    getPrescription() {
      if (!this.userId) {
        Indicator.close();
        Toast('用户未登录，请重新登录!');
        goLogin();
        return false;
      }
      this.flag = false;
      return docAjax.post('/api/order/getPatientOrderList', {
        userId: this.userId,
        status: this.dataStatus,
        pageIndex: this.pageNum,
        pageSize: 10
      }).then(resp => {
        Indicator.close();
        if (resp.status === 200 && resp.data.code === 0) {
          let totalCount = resp.data.recordscount; // 数据总条数
          let hasMore = totalCount !== this.allOrderData.length && totalCount > 0;
          let noAnyData = totalCount === 0;
          if (totalCount === 0) {
            this.listF = false;
          } else {
            this.listF = true;
          }
          if (hasMore) {
            let loadTop = sessionStorage.getItem('loadTop');
            if (loadTop) {
              // 下拉刷新
              this.allOrderData = resp.data.data;
            } else {
              // 上拉加载和切换tab栏
              this.allOrderData = this.allOrderData.concat(resp.data.data);
            }
          } else {
            // this.flag = true;
          }
          console.log(`共${totalCount}条数据>>>>>>>当前获得${this.allOrderData.length}条数据`, this.allOrderData);
          this.flag = true;
          sessionStorage.removeItem('loadTop');
          this.isHaveMore(hasMore, noAnyData);
          this.$nextTick(function() {
            this.scrollMode = 'touch';
          });
        }
      });
    },
    // 下拉刷新
    loadTop: function() {
      // this.allOrderData = [];
      sessionStorage.setItem('loadTop', 'loadTop');
      this.pageNum = 1;
      this.getPrescription().then(() => {
        this.$refs.loadmore.onTopLoaded();
      });
    },
    // 上拉加载
    loadBottom: function() {
      this.pageNum = this.pageNum + 1;
      this.getPrescription().then(() => {
        this.$refs.loadmore.onBottomLoaded();
      });
    },
    isHaveMore(isHaveMore, noAnyData) {
      this.allLoaded = true;
      this.showNomore = true;
      if (isHaveMore) {
        this.allLoaded = false;
        this.showNomore = false;
        this.noData = false;
      }
      if (noAnyData) {
        this.showNomore = false;
        this.noData = true;
      }
    },
    ISFLAG(order) {
      switch (Number(order.order_type)) {
        // 拍方
        case 1: {
          switch (Number(order.status)) {
            case 0: return false;
            // 根据价格决定是否显示价格
            default: return !!order.order_price;
          }
        }
        // 开方&电子处方单
        default: {
          switch (Number(order.status)) {
            case 0: // 待审核
            case 97:
            case 98:
            case 100:
            case 102: // 用户取消
            case 104: // 已过期(用户未支付)
            case 5: return false;
            // 根据价格决定是否显示价格
            default: return !!order.order_price;
          }
        }
      }
    },
    // 跳转订单详情
    gotoDetail(orderId) {
      console.log(this.allOrderData);
      this.$router.push({
        path: '/prescription/prescription_detail', query: { order_id: orderId }
      });
    },
    // 判断是否为pc
    isPC() {
      if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      // 移动端
        return false;
      }
      else {
      // PC端
        return true;
      }
    },
    // 确认处方
    confirmOrder(orderId, sourceId, orderType, status) {
      // 电商来源的处方单跳回电商支付
      if (Number(sourceId) === 10058 && Number(orderType) === 0) {
        this.isPC() ? window.location.href = 'https://e-gm.km1818.com/orderlist.html' : window.location.href = 'http://e-gm.km1818.com/m/home.html';
        // window.location.href = 'https://e-gm.km1818.com/orderlist.html';
        return;
      }
      // 医生开方待确认点击确认处方跳到服务单详情页面(用户跳到e抓药待支付页面)
      this.$router.push({
        path: '/prescription/prescription_detail',
        query: {
          order_id: orderId,
          // order_type: Number(status) === 1 ? '2' : ''
        }
      });
      console.log('跳到待支付页面');
    },
    // 查看物流
    gotoLogistics(orderId, kmOrderId, prescrType, logisticsCompany) {
      console.log(orderId, kmOrderId);
      this.$router.push({
        path: '/prescription/logistics_detail',
        query: {
          order_id: orderId,
          km_order_id: kmOrderId,
          prescr_type: prescrType,
          logistics_company: logisticsCompany
        }
      });
      console.log('跳到物流页面');
    },
    // 取消处方单
    cancelOrder(order_id) {
      MessageBox.confirm('是否取消处方订单?').then(({ value, action }) => {
        Indicator.open();
        let url = '/api/order/cancleOrder';
        let params = {
          orderId: order_id,
          cancleRemark: value || ''
        };
        docAjax.post(url, params).then((res) => {
          Indicator.close();
          this.$router.go(0);
        });
      }, () => {});
    }
  },
  mounted() {
    // 获取用户信息
    this.getUserInfoList();
    console.log();
  },
  // created() {
  //   document.title = '处方服务单';
  // }
};
</script>

<style lang="less" scoped>
   @import "../../styles/mixin.less";
   @background-color-e5: #e5e5e5;
   @border-bottom: solid 1px #e0e0e0;
   @color66: #666;
   @color87: #878787;
   @color6a: #6a6a6a;
   @color33: #333;
   @colorD3: #0ccdd3;
   @colorF4c: #ff4c56;
   @colorFae: #ffae00;
  .prescription-body {
    height: 100%;
    background: #eeeef3;
    &.pre-body-white {
      background: #fff;
    }
    & /deep/ .mint-header {
       height: 44px;
       background: #fff;
       color:#333;
       border-bottom: 1px solid #e6e6e6;
    }
    & /deep/ .mint-header-title {
      font-size: 20px;
    }
  }
  .nav-bar {
    position: fixed;
    width: 100%;
    top: 44px;
    z-index: 5;
    left: 0;
    right: 0;
    border-bottom: solid 1px #eeeef3;
    display: flex;
    background: @white-color;
  }
  .menu-item {
    position: relative;
    padding: 17px 0;
    flex: 1;
    font-size: 16px;
    text-align: center;
    &.active {
      color: #d74949;
      &:after {
        position: absolute;
        bottom: 0;
        left: 10%;
        content: ' ';
        width: 80%;
        height: 2px;
        background: #d74949;
        display: block;
      }
    }
  }
  .order-list {
    li {
      background: #fff;
      margin-bottom: 15px;
      font-size: 15px;
      color: #333;
      padding-top: 10px;
      .status {
        text-align: right;
        padding: 10px 0;
        border-bottom: @border-bottom;
        font-size: 14px;
        margin: 0 10px;
        .order-tobeConfirmed {
          color: @colorF4c;
          font-size: 16px;
        }
        .order-hasConfirmed {
          color: @color33;
          font-size: 16px;
        }
        .order-hasCancelled {
          font-size: 16px;
        }
        .valid-txt{
          padding-left: 8px;
          color: @colorF4c;
        }
        .status-name {
          color: @colorF4c;
          font-size: 16px;
        }
      }
      .detail {
        padding: 10px;
        border-bottom: @border-bottom;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        p {
          margin: 5px 0;
          // display: -webkit-box;
          // display: flex;
          // float: left;
        }
        .name {
          &:first-child {
            margin-right: 20px;
          }
        }
      }
      .footer {
        padding: 10px;
        line-height: 30px;
        span {
          float: left;
        }
      }
      .btn {
        padding: 5px;
        border-radius: 3px;
        &.to-detail {
          font-size: 15px;
          color: #d74949;
          border: solid 1px #d74949;
        }
        &.to-confirm {
          color: @colorF4c;
          border: solid 1px @colorF4c;
          margin-left: 10px;
          font-size: 15px;
        }
        &.to-logistics {
          color: @colorFae;
          border: solid 1px @colorFae;
          margin-left: 10px;
          font-size: 15px;
        }
        &.to-cancel {
          font-size: 15px;
          color: #333;
          border: solid 1px #999;
        }
      }
    }
  }
  .load-more-container {
    overflow-y: scroll;
    height: 100%;
    padding-top: 51px;
  }
  .no-more {
    height: 30px;
    line-height: 30px;
    background-color: #f8f8f8;
    text-align: center;
  }
  .no-data {
    width: 100%;
    height: 100%;
    text-align: center;
    background: #fff;
    border-top: solid 2px #eeeef3;
    padding-top: 25%;
    font-size: 16px;
    color: @color66;
    img {
      width: 60%;
      // margin-left: -7%;
      margin-bottom: 15px;
    }
  }
  /*.mint-tab-container {*/
    /*height: 100%;*/
    /*overflow-y: scroll;*/
    /*overflow-x: hidden;*/
    /*width: 100%;*/
  /*}*/
  /*.mint-tab-container-wrap {*/
    /*overflow-x: hidden;*/
    /*width: 100%;*/
    /*height: 100%;*/
  /*}*/
</style>
