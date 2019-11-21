import Vue from 'vue';
import Router from 'vue-router';
import inquiryLayout from '../views/inquiry/inquiryLayout.vue';
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router);

export default new Router({
  base: '/',
  mode: 'history',
  routes: [
    // 主页
    {
      path: '/',
      name: 'default',
      component: _import('patSquare/prescription'),
      meta: {
        title: '康美e抓药'
      }
    },
    {
      path: '/em/index',
      name: 'index',
      component: _import('home/index'),
    },
    {
      path: '/live/index',
      name: 'liveIndex',
      component: _import('live/index'),
    },
    // 第三方帐号登录绑定
    {
      path: '/theThirdParty/binding',
      name: 'binding',
      component: _import('theThirdParty/binding'),
    },
    // 选择国家区号
    {
      path: '/theThirdParty/selectCounty',
      component: _import('theThirdParty/selectCountry')
    },
    // 第三方帐号登录绑定完成
    {
      path: '/theThirdParty/complete',
      name: 'bindingComplete',
      component: _import('theThirdParty/complete'),
    },
    // 康美e抓药
    {
      path: '/patSquare/prescription',
      name: 'patSquarePrescription',
      component: _import('patSquare/prescription'),
      meta: {
        title: '康美e抓药'
      }
    },
    // 相关资质
    {
      path: '/patSquare/qualifications',
      name: 'patSquareQualifications',
      component: _import('patSquare/qualifications'),
      meta: {
        title: '相关资质'
      }
    },
    // 在线抓药流程
    {
      path: '/patSquare/step',
      name: 'patSquareStep',
      component: _import('patSquare/step'),
      meta: {
        title: '在线抓药流程'
      }
    },
    // 拍方抓药
    {
      path: '/patSquare/index',
      name: 'patSquareIndex',
      component: _import('patSquare/index'),
      meta: {
        title: '在线抓药'
      }
    },
    // 处方上传示例
    {
      path: '/patSquare/examples',
      name: 'patSquareExamples',
      component: _import('patSquare/examples'),
      meta: {
        title: '处方上传示例'
      }
    },
    // 支付页面 首页
    {
      path: '/payment/index',
      name: 'paymentIndex',
      component: _import('payment/index'),
      meta: {
        title: '支付页面'
      }
    },
    // 支付页面 完成页 微信和支付宝的h5支付完成跳转的页面
    {
      path: '/payment/payCompleted',
      name: 'paymentPayCompleted',
      component: _import('payment/payCompleted'),
      meta: {
        title: '支付页面'
      }
    },
    // 支付页面 成功页 微信内jsapi支付用到
    {
      path: '/payment/paySuccess',
      name: 'paymentPaySuccess',
      component: _import('payment/paySuccess'),
      meta: {
        title: '支付页面'
      }
    },
    // 支付页面 失败页 微信内jsapi支付用到
    {
      path: '/payment/payError',
      name: 'paymentPayError',
      component: _import('payment/payError'),
      meta: {
        title: '支付页面'
      }
    },
    // 收货地址列表
    {
      path: '/address/index',
      name: 'addressIndex',
      component: _import('address/index'),
      meta: {
        title: '收货地址'
      }
    },
    // 添加收货地址
    {
      path: '/address/increaseAddress',
      name: 'increaseAddress',
      component: _import('address/increaseAddress'),
      meta: {
        title: '新增地址'
      }
    },
    // 登录
    {
      path: '/login', component: _import('login/login'),
      meta: {
        title: '登录'
      }
    },
    // 注册
    {
      path: '/registe', component: _import('registe/registe'),
      meta: {
        title: '注册'
      }
    },
    // 找回密码
    {
      path: '/findPassword', component: _import('findPassword/findPassword'),
      meta: {
        title: '找回密码'
      }
    },
    // 处方订单
    {
      path: '/prescription/prescription_order',
      name: 'prescription-order',
      component: _import('prescription/prescription_order'),
      meta: {
        title: '处方服务单'
      }
    },
    // // 处方订单详情
    // {
    //   path: '/prescription/prescription_detail',
    //   name: 'prescription_detail',
    //   component: _import('prescription/prescription_detail'),
    //   // meta: {
    //   //   keepalive: false
    //   // }
    // },
    // 通用问诊单
    {
      path: '/inquirySheet',
      name: 'inquirySheet',
      component: _import('inquirySheet/index'),
      meta: {
        title: '通用问诊单'
      }
    },
    // 物流详情页
    {
      path: '/prescription/logistics_detail',
      name: 'logistics_detail',
      component: _import('prescription/logistics_detail'),
      meta: {
        title: '物流详情'
      }
    },
    // 直接进入问诊
    {
      path: '/checkInquiry',
      name: 'checkInquiry',
      component: _import('inquiry/index'),
      meta: {
        title: '进入问诊'
      }
    },
    {
      // 在线问诊
      path: '/inquiry',
      name: 'inquiry',
      component: inquiryLayout,
      meta: {
        title: '在线问诊'
      },
      children: [
        {
          // 问诊向导
          path: 'guideDefault',
          name: 'guideDefault',
          component: _import('inquiry/guideDefault'),
          meta: {
            title: '导诊接待'
          }
        },
        {
          // 管理就诊人
          path: 'manageInquiryPeople',
          name: 'manageInquiryPeople',
          component: _import('inquiry/manageInquiryPeople'),
          meta: {
            title: '就诊人信息'
          }
        },
        {
          // 就诊人详细信息
          path: 'inquiryPeopleMes',
          name: 'inquiryPeopleMes',
          component: _import('inquiry/inquiryPeopleMes'),
          meta: {
            title: '就诊人信息'
          }
        },
        {
          // 就诊向导二次进入
          path: 'intoSecond',
          name: 'intoSecond',
          component: _import('inquiry/intoSecond'),
          meta: {
            title: '就诊向导'
          }
        },
        {
          // 就诊中
          path: 'doing',
          name: 'doing',
          component: _import('inquiry/doing'),
          meta: {
            title: '就诊中'
          }
        },
        // 处方订单详情
        {
          path: '/prescription/prescription_detail',
          name: 'prescription_detail',
          component: _import('prescription/prescription_detail'),
          meta: {
            title: '服务单详情'
          }
        },
      ]
    },
    // 微信入口
    {
      path: '/weixin/entry',
      name: 'weixinEntry',
      component: _import('weixin/entry'),
    },
    // 注册微信入口
    {
      path: '/registe/entry',
      name: 'registeEntry',
      component: _import('registe/entry'),
    },
    // 微信中转页
    {
      path: '/weixin/transfer',
      name: 'weixinTransfer',
      component: _import('weixin/transfer')
    },
    //
    {
      path: '/weixin/hub',
      name: 'weixinHub',
      component: _import('weixin/hub')
    }
  ]
});
