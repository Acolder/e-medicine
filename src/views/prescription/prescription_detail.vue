<template>
  <div class="presc-index">
    <mt-header fixed :title="RUNRULES['title']">
      <a href="javascript:;" slot="left" @click="$router.go(-1);">
        <mt-button icon="back"></mt-button>
      </a>
    </mt-header>
    <!-- 状态图标 -->
    <!-- 第一种步骤条 -->
    <!-- <scroller> -->
    <div class="prescBody sympt_part" :class="$route.query.pay ? 'bott': ''" :style="{height: !!!RUNRULES['btnText'] ? 'calc(100% - 44px)' : ''}">
      <div class="">
    <div class="presc_status_bar" v-if="!RUNRULES['flag'] && RUNRULES['flag'] !== undefined">
      <div class="status_item">
        <img :src="Number(orderDetails.order_type) === 1 ? img0.src :img01.src" alt="">
        <span :class="{active: img0.active}">{{stepText['0']}}</span>
      </div>
      <div class="status_item">
        <img :src="Number(orderDetails.order_type) === 1 ? img1.src :img1.src" alt="">
        <span :class="{active: Number(orderDetails.order_type) === 1 ? img1.active : img1.active}">
          {{stepText['1']}}
        </span>
      </div>
      <div class="status_item">
        <img :src="Number(orderDetails.order_type) === 1 ? img2.src :img2.src" alt="">
        <span :class="{active: Number(orderDetails.order_type) === 1 ? img2.active : img2.active}">
          {{stepText['2']}}
        </span>
      </div>
      <div class="status_item">
        <img :src="img3.src" alt="">
        <span :class="{active: img3.active}">{{stepText['3']}}</span>
      </div>
      <div class="status_item">
        <img :src="img4.src" alt="">
        <span :class="{active: img4.active}">{{stepText['4']}}</span>
      </div>
    </div>
    <!-- 第二种步骤条 -->
    <!-- <div class="yd_status_bar">
          <step :current="ycode" current-color="#26a2ff">
              <step-item>
                  <span slot="bottom">{{stepText['0']}}</span>
              </step-item>
              <step-item>
                  <span slot="bottom">{{stepText['1']}}</span>
              </step-item>
              <step-item>
                  <span slot="bottom">{{stepText['2']}}</span>
              </step-item>
              <step-item>
                  <span slot="bottom">{{stepText['3']}}</span>
              </step-item>
              <step-item>
                  <span slot="bottom">{{stepText['4']}}</span>
              </step-item>
          </step>
    </div> -->
    <!-- 拍方订单 AND 医生开方订单-->
    <!-- ------------------------------------------------------------------------ -->
    <!-- 审核-待千金方药师审核-->
    <div class="auditing" v-if="RUNRULES['0']" style="color: #d4291c">
      {{ GETSHNEHE() }}
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 收货人物流 -->
    <div class="logis_info_bar presc_module" v-if="RUNRULES['1']">
      <div class="logis_info" @click.stop="goDetail(orderDetails.order_id, orderDetails.km_order_id, orderDetails.docprescriptions[0].prescr_type, orderDetails.logistics_company)" v-if="RUNRULES['wuliu'] !== false">
        <!-- 快递公司或快递信息 -->
        <div class="logis_desc">
          <span :style="{color: lastLogis['addr_info'] === '暂无物流信息' ? '#d68c19' : '#000'}">
            {{ orderDetails.docprescriptions[0].prescr_type === 0 &&
               orderDetails.docprescriptions[0].is_suffering === 0 ?
               orderDetails.logistics_company ?
               orderDetails.status === 20 ?'物流公司：' + orderDetails.logistics_company : '订单正在配送中' : '暂无物流信息' :
               lastLogis['addr_info'] || '暂无物流信息' }}<!-- 物流信息 -->
          </span>
        </div>
        <!-- 物流单号或时间 -->
        <div class="logis_time" v-if="orderDetails.km_order_id || lastLogis['current_lo_time']">
          {{ orderDetails.docprescriptions[0].prescr_type === 0 &&
             orderDetails.docprescriptions[0].is_suffering === 0 ?
             orderDetails.km_order_id ? '物流单号：' + orderDetails.km_order_id : '' :
             lastLogis['current_lo_time'] }}<!-- 时间 -->
        </div>
      </div>
      <!-- 收货人与地址 -->
      <div class="consignee_info" :style="{paddingRight: orderDetails.order_type !== '1' || orderDetails.status === 5 ? '26px' : '10px'}"
           v-if="orderDetails.consignee && orderDetails.con_tel && orderDetails.detail_address"
           @click="ADDADDR">
        <div class="name_phone">
          <span class="name"><i>收货人：</i><i>{{orderDetails.consignee}}</i></span>
          <span class="phone"><i>{{orderDetails.con_tel}}</i></span>
        </div>
        <p class="address" :class="orderDetails.order_type !== '1' && orderDetails.status === 5 && !$route.query.pay && !$route.query.mkc ? 'jian' : ''" style="display: flex; marginTop: 10px">
          <i>地址：{{orderDetails.detail_address}}</i>
        </p>
      </div>
      <!-- 没有收货人信息时展示 -->
      <div class="consignee_info"
           @click="ADDADDR"
           v-if="(!orderDetails.consignee || !orderDetails.con_tel || !orderDetails.detail_address)">
        <div class="name_phone wu">
          <span class="name"><i>请填写收货地址</i></span>
        </div>
      </div>
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 上传功能及展示处方图片 -->
    <div class="up" v-if="RUNRULES['2']">
        <!--上传处方 -->
        <div class="upcf">
          <span>上传处方</span>
          <div class="imgbox">
                <!-- 处方图 -->
                <div class="recipe" v-if="orderDetails.docprescriptions[0].recipe_pic_url" @click="maximg">
                  <img :src="orderDetails.docprescriptions[0].recipe_pic_url" alt="">
                </div>
                <!-- 上传处方组件 -->
                <uploadImg v-if="!orderDetails.docprescriptions[0].recipe_pic_url" isMaxIMg="'1'" :imgUrl="prescriptionInfo.imageUrl" :fileName="'Image'" @uploadSuccess="addImgUrl" @removeImg="removeImgUrl"></uploadImg>
          </div>
        </div>
        <!-- 收货人信息 -->
        <div class="consignee_info common" v-if="(orderDetails.status === 0 ||orderDetails.status === 100) && Number(orderDetails.order_type) === 1">
            <div class="name_phone">
              <span class="name"><i>收货人：</i><i>{{orderDetails.consignee}}</i></span>
              <span class="phone"><i>{{orderDetails.con_tel}}</i></span>
            </div>
            <p class="address" style="display: flex; marginTop: 10px">
              <i>地址：{{orderDetails.detail_address}}</i>
            </p>
        </div>
        <!-- 收货地址 -->
        <div class="addr" v-if="!RUNRULES['99']">
            <span class="addr_left">收货地址:</span>
            <span class="addr_right"><i>{{orderDetails.consignee}} {{orderDetails.con_tel}}</i><i>{{orderDetails.detail_address}}</i></span>
        </div>
        <!-- 患者手机号码 -->
        <div class="user_tel" v-if="!RUNRULES['99'] || (orderDetails.status === 0 ||orderDetails.status === 100) && Number(orderDetails.order_type) === 1">
            <span>{{RUNRULES['phone']}}</span><span>{{orderDetails.docprescriptions[0].tel}}</span>
        </div>
        <!-- 二 -->
        <!-- <section v-if="RUNRULES['99']">
            <div class="daijian"><span>是否代煎:</span><span>{{orderDetails.docprescriptions[0].is_suffering === 1 ? '是' : '否'}}</span></div>
            <div class="jishu"><span>剂数:</span><span>{{orderDetails.docprescriptions[0].amount}}</span></div>
        </section> -->
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 患者信息&主诉及辩证 -->
    <div class="presc_module" v-if="RUNRULES['3']">
      <div class="presc_row">
        <p class="left">患者信息:</p>
        <p class="right">{{orderDetails.docprescriptions[0].username}}/{{orderDetails.docprescriptions[0].gender?'男':'女'}}&nbsp;{{orderDetails.docprescriptions[0].age}}岁/{{orderDetails.docprescriptions[0].tel}}</p>
      </div>
      <div class="presc_row">
        <p class="left">主诉及辩证:</p>
        <p class="right">{{orderDetails.docprescriptions[0].diagnosis || '暂无'}}</p>
      </div>
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 处方/西药清单 -->
    <div class="drug_list_wrapper presc_module" v-if="RUNRULES['4'] && orderDetails.docprescriptions[0].prescr_type !== '' && orderDetails.docprescriptions[0].docprescriptiondetails.length > 0 ">
      <p class="drug_list_title">{{orderDetails.docprescriptions[0].prescr_type === 1 ? '西药清单': orderDetails.docprescriptions[0].prescr_type === 6 ? '中成药清单': '处方'}}</p>
      <p class="drug_list_title qq" v-if="orderDetails.docprescriptions[0].prescr_type === 0"><i>中药清单</i><i>共{{orderDetails.docprescriptions[0].amount}}剂{{orderDetails.docprescriptions[0].is_suffering === 0 ? '' : ',煎煮x' + orderDetails.docprescriptions[0].suffering_num+'剂'}}</i></p>
      <p class="drug_list_title qq" v-if="orderDetails.docprescriptions[0].prescr_type === 2"><i>膏方清单</i><i>共{{orderDetails.docprescriptions[0].amount}}剂</i></p>
      <p class="drug_list_title qq" v-if="orderDetails.docprescriptions[0].prescr_type === 3"><i>丸剂清单-{{GETNAME(orderDetails.docprescriptions[0].wj_type)}}</i><i>共{{orderDetails.docprescriptions[0].amount}}剂</i></p>
      <!-- 非西药 -->
      <div class="presc_row noborder" style="flexWrap: wrap;" v-if="orderDetails.docprescriptions[0].prescr_type !== 1 && orderDetails.docprescriptions[0].prescr_type !== 6">
         <div style="float: left; paddingRight: 8px; color: #999" v-for="(item, index) in orderDetails.docprescriptions[0].docprescriptiondetails" :key="index">
              <div class="xy">
                  <p class="">{{item.medicines}}</p>
              </div>
         </div>
      </div>
      <!-- 西药和中成药 -->
      <div v-if="orderDetails.docprescriptions[0].prescr_type === 1 || orderDetails.docprescriptions[0].prescr_type === 6">
        <div class="presc_row noborder col" v-for="(item, index) in orderDetails.docprescriptions[0].docprescriptiondetails" :key="index">
              <div class="pl">
                  <p class="left" style="float: left; width: 260%"><i>{{item.medicines}}</i><i class="otcANDrx" :class="Number(item.isotc) === 1 ? 'otch': Number(item.isotc) === 3 ? 'otcl' : Number(item.isotc) === 2 ? 'rx': ''"></i></p>
                  <p class="right" style="float: right"><i>x</i>&nbsp;{{item.dose}}</p>
              </div>
              <div style="width: 100%; hieght: 10px; fontSize: 10px; color: #999; lineHeight: 38px;">{{item.goods_norms}}&nbsp;{{item.goods_orgin}}</div>
              <div style="width: 100%; hieght: 10px; fontSize: 10px; color: #999;">用法:&nbsp;{{item.m_usage}}&nbsp;{{item.medperday}}&nbsp;{{item.medperdos}}{{item.medperdos_unit}}</div>
        </div>
      </div>
      <!-- <div class="drug_list_title drugs" :class="numFlag ? '' : 'jiantou'" :style="{justifyContent: numFlag ? '' : 'center'}" @click="downnn()" v-if="getListLength() > 2">
        <span v-if="index >= num" v-for="(item, index) in orderDetails.docprescriptions[0].docprescriptiondetails" :key="index+'a'">{{item.medicines}}</span>
      </div> -->
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 服用方法-医嘱-煎煮方式-备注 -->
    <div class="method common" v-if="RUNRULES['5']">
        <div class="method_one" v-if="orderDetails.docprescriptions[0].prescr_type !== 1"><span>服用方法:</span><span>{{orderDetails.docprescriptions[0].medication_instruction || '暂无服用方法'}}</span></div>
        <div class="method_two"><span>医嘱:</span><span>{{orderDetails.docprescriptions[0].doctor_advice || '暂无'}}</span></div>
        <div class="method_three" v-if="orderDetails.docprescriptions[0].prescr_type === 0"><span>煎服方式:</span><span>{{orderDetails.docprescriptions[0].suffering_type === 0 ? '一剂两包' :
                                                                                                                         orderDetails.docprescriptions[0].suffering_type === 1 ?'一剂三包' : '暂无煎煮'}}</span></div>
        <div class="method_four"><span>备注:</span><span>{{orderDetails.remark || '暂无'}}</span></div>
    </div>
    <!-- ------------------------------------------------------------------------ -->
     <!-- 是否代煎-是否怀孕-剂数 -->
     <div class="dhj common" v-if="RUNRULES['6']">
        <div class="daijian"><span>是否代煎:</span><span>{{orderDetails.docprescriptions[0].is_suffering === 1 ? '是' : '否'}}</span></div>
        <div class="huairun"><span>是否怀孕:</span><span>{{orderDetails.docprescriptions[0].is_pregnant === 1 ? '是' : '否'}}</span></div>
        <div class="jishu" v-if="RUNRULES['filter'] !== false"><span>剂数</span><span>{{orderDetails.docprescriptions[0].amount}}</span></div>
     </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 服务费-总计 -->
    <div class="money common" v-if="RUNRULES['7']">
       <div class="money_top">
          <p><span>服务费:</span><span>￥<i>{{orderDetails.order_price.toFixed(2)}}</i></span></p>
          <p><span>总计:</span><span>￥<i>{{orderDetails.order_price.toFixed(2)}}</i></span></p>
       </div>
    </div>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 处方编号&服务单号&下单时间&确认时间 -->
    <div class="codeee common" v-if="RUNRULES['code'] === 1">处方编号:<span>{{orderDetails.docprescriptions['0'].prescri_id}}</span></div>
    <!-- 订单编号-下单时间-确认时间 -->
    <div class="time common" v-if="RUNRULES['code'] === 2">
          <p><span>服务单号:</span><span>{{orderDetails.order_id}}</span></p>
          <p><span>下单时间:</span><span>{{orderDetails.create_time}}</span></p>
          <p v-if="RUNRULES['time'] !== '隐藏'"><span>确认时间:</span><span>{{orderDetails.confirm_time}}</span></p>
    </div>
    </div>
    </div>
    <!-- </scroller> -->
    <!-- ------------------------------------------------------------------------ -->
    <mt-button v-if="!RUNRULES['f'] && RUNRULES['btnText']"
               type="primary"
               size="large" @click="submit(RUNRULES['btnText'])"
               :style="{'background': GETBTNCOLOR(RUNRULES['btnText'])}"
               >
               {{RUNRULES['btnText']}}
    </mt-button>
    <!-- ------------------------------------------------------------------------ -->
    <!-- 合计-取消订单-订单支付 -->
    <div class="btttn" v-if="RUNRULES['f']">
      <span>合计：<i>{{'￥'+orderDetails.order_price.toFixed(2)}}</i></span>
      <span @click="submit('取消服务单')">取消</span>
      <span @click="submit('订单支付')">支付</span>
    </div>
     <!-- 全屏展示处方图 -->
    <div class="maximg" v-if="maxF" @click="minimg"><img :src="orderDetails.docprescriptions[0].recipe_pic_url" alt=""></div>
  </div>
</template>
<script>
import { goPay } from '@/api/pay';
import { MessageBox, Indicator, Button, Toast } from 'mint-ui';
import doctorAjax from '@/utils/doctorAjax.js';
import uploadImg from '@/components/upload/uploadImg';
import { getLogis, getLogis1 } from '@/utils/LOG.js';
import ajax from '@/utils/ajax.js';
// import { SHARE } from '@/utils/share.js';
// import java from '@/utils/javaApiRequest.js';
// import NativeShare from 'nativeshare';
// import yilin from '@/utils/yilinApiRequest.js';
// import { Step, StepItem } from '@/components/step';
// import wxjs from '@/utils/wxjsInterface';
// import wx from 'weixin-js-sdk';
export default {
  data() {
    return {
      payisWeixin: false, // 是否在微信打开
      preservationAddress: '',
      // ycode: 1,
      maxF: false, // 用于大图查看处方单
      stepTextRules: {
        user: ['上传处方', '药师审核', '用户支付', '待配送', '完成'],
        doctor: ['医生开方', '药师审核', '用户支付', '待配送', '完成']
      },
      stepText: [], // 步骤条的显示文字
      prescriptionInfo: { // 上传的图片
        imageUrl: ''
      },
      rules: { // 详情展示规则(一个对象就是一个页面)
        // 拍方订单
        user: {
          // 待审核（待千金方药师审核）
          'one': { '0': true, '1': false, '2': true, '3': false, '4': false, '5': false, '6': true, '7': false, '8': false, '99': true, 'phone': '患者手机号', 'code': 1, 'btnText': '取消服务单', 'flag': false, 'title': '服务单详情' },
          // 审核未通过
          'none': { '0': true, '1': false, '2': true, '3': false, '4': false, '5': false, '6': true, '7': false, '8': false, '99': true, 'phone': '患者手机号', 'code': 1, 'btnText': '审核未通过', 'flag': false, 'title': '服务单详情' },
          // 审核未通过(非标准处方审核失败)
          'none_two': { '0': true, '1': false, '2': true, '3': false, '4': false, '5': false, '6': true, '7': false, '8': false, '99': false, 'phone': '联系方式', 'code': 1, 'btnText': '咨询药师', 'flag': false, 'title': '服务单详情' },
          // 待确认
          'two': { '0': false, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': true, 'wuliu': false, 'code': 1, 'btnText': '确认处方', 'flag': false, 'title': '服务单详情' },
          // 待确认状态(订单支付页)
          'two3': { '0': false, '1': true, '2': false, '3': false, '4': true, '5': false, '6': false, '7': true, '8': true, '99': true, 'wuliu': false, 'code': 2, 'f': true, 'flag': true, 'title': '支付服务单', 'time': '隐藏' },
          // 待收货
          'three': { '0': false, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': true, 'code': 2, 'btnText': '确认收货', 'flag': false, 'title': '服务单详情' },
          // 商家已取消
          'three_103': { '0': true, '1': false, '2': true, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': true, 'code': 2, 'btnText': '服务单已取消', 'flag': false, 'title': '服务单详情' },
          // 西药代发货
          'three_xiyao': { '0': false, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': true, 'code': 2, 'flag': false, 'title': '服务单详情' },
          // 已完成
          'four': { '0': false, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': true, 'code': 2, 'btnText': '服务单已完成', 'flag': false, 'title': '服务单详情' },
          // 已取消（千金方药师审核不通过、用户主动取消）
          'five': { '0': true, '1': false, '2': true, '3': false, '4': false, '5': false, '6': true, '7': false, '8': false, '99': false, 'phone': '联系方式', 'code': 1, 'btnText': '服务单已取消', 'flag': false, 'title': '服务单详情' },
          // 过期
          'five_qx': { '0': true, '1': false, '2': true, '3': false, '4': false, '5': false, '6': true, '7': false, '8': false, '99': false, 'phone': '联系方式', 'code': 1, 'btnText': '服务单已过期', 'flag': false, 'title': '服务单详情' },
          // 已取消(已过期)（智慧药房审核不通过）
          'six': { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': true, 'wuliu': false, 'code': 1, 'btnText': '服务单已过期', 'flag': false, 'title': '服务单详情' },
          // 已取消
          'gg': { '0': true, '1': true, '2': true, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': true, 'wuliu': false, 'code': 1, 'btnText': '服务单已取消', 'flag': false, 'title': '服务单详情' }
        },
        // 医生开方订单
        doctor: {
          // 待审核（用户下单支付）
          'one': { '0': true, '1': false, '2': false, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': false, 'code': 1, 'flag': false, 'title': '服务单详情' },
          // 待确认（待千金方药师审核）
          'two': { '0': false, '1': true, '2': false, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': false, 'code': 1, 'wuliu': false, 'btnText': '确认处方', 'flag': false, 'title': '服务单详情' },
          // 待收货
          'three': { '0': false, '1': true, '2': false, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': false, 'code': 2, 'btnText': '确认收货', 'flag': false, 'title': '服务单详情' },
          // 西药代发货
          'three_xiyao': { '0': false, '1': true, '2': false, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': false, 'code': 2, 'flag': false, 'title': '服务单详情' },
          // 已完成
          'four': { '0': false, '1': true, '2': false, '3': true, '4': true, '5': true, '6': false, '7': true, '8': true, '99': false, 'code': 2, 'btnText': '服务单已完成', 'flag': false, 'title': '服务单详情' },
          // 没有库存
          'mkc': { '0': true, '1': false, '2': false, '3': true, '4': true, '5': true, '6': false, '7': false, '8': true, '99': true, 'wuliu': false, 'code': 2, 'btnText': '咨询药师', 'time': '隐藏', 'flag': false, 'title': '服务单详情' },
          // 已取消（千金方药师、智慧药房审核不通过、用户主动取消）
          'five': { '0': true, '1': false, '2': false, '3': true, '4': true, '5': true, '6': false, '7': true, '8': false, '99': false, 'wuliu': false, 'code': 1, 'btnText': '服务单已取消', 'flag': false, 'title': '服务单详情' },
          // 审核未通过
          'doc': { '0': true, '1': false, '2': false, '3': true, '4': true, '5': true, '6': false, '7': true, '8': false, '99': false, 'wuliu': false, 'code': 1, 'btnText': '审核未通过', 'flag': false, 'title': '服务单详情' },
          // 已取消（处方过期）
          'six': { '0': false, '1': false, '2': false, '3': true, '4': true, '5': true, '6': false, '7': false, '8': false, '99': false, 'code': 1, 'btnText': '服务单已过期', 'flag': false, 'title': '服务单详情' }
        }
      },
      RUNRULES: { }, // 页面显示规则(初始为空)
      orderDetails: { }, // 服务单信息(初始为空)
      prescrTypes: { // 处方类型
        '0': '中药清单',
        '1': '西药清单',
        '2': '膏方',
        '3': '丸剂',
        '4': '类型异常',
        '5': '固定膏方'
      },
      wjTypes: { // 丸剂类型
        '0': '丸剂',
        '1': '浓缩丸',
        '2': '水丸(包衣)',
        '3': '水蜜丸',
        '4': '(水丸)素丸'
      },
      lastLogis: { // 物流信息及时间
        'current_lo_time': '',
        'addr_info': ''
      },
      logisticsInfo: {}, // 物流地址信息
      logisticsInfo2: {}, // 用于请求西药物流的参数
      sending: false, // 是否正在提交
      doctorId: null, // 医生id
    };
  },
  components: {
    Button,
    // Step,
    // StepItem,
    uploadImg
  },
  computed: {
    // 订单状态（0:待审核,5 :待确认, 6:待医网签,7:待发货,10,15:待收货,20:已收货,97,102:已取消(用户患者),99:医生取消,101:平台取消98,100:审核失败,103:商家取消订单,104:订单过期,105非标准处方审核失败,1000医生APP端删除）
    showPatientInfo() {
      let status = String(this.orderDetails.status);
      console.log(status);
      return status === '5' || status === '10' || status === '15' || status === '20' || status === '97' || status === '98' || status === '99' || status === '100' || status === '101' || status === '102' || status === '103';
    },
    img0() {
      let status = String(this.orderDetails.status);
      let contains = ['0', '1', '5', '6', '7', '10', '15', '20'];
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_pfl@2x.png') : require('./img/icon_pf@2x.png'), active: flag };
    },
    img01() {
      let status = String(this.orderDetails.status);
      let contains = ['0', '1', '5', '6', '7', '10', '15', '20'];
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_yskf@2x.png') : require('./img/icon_yskfh@2x.png'), active: flag };
    },
    img1() {
      let status = String(this.orderDetails.status);
      let contains = [];
      // if (Number(this.orderDetails.order_type) === 1) { // 拍方
      contains = ['0', '1', '5', '7', '10', '15', '20'];
      // } else { // 开方
      //   contains = ['0', '1', '7', '10', '15', '20'];
      // }
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_ysqrl@2x.png') : require('./img/icon_ysqr@2x.png'), active: flag };
    },
    img2() {
      let status = String(this.orderDetails.status);
      let contains = [];
      // if (Number(this.orderDetails.order_type) === 1) { // 拍方
      contains = ['1', '5', '7', '10', '15', '20'];
      // } else { // 开方
      //   contains = ['0', '1', '5', '7', '10', '15', '20'];
      // }
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_yhqrl@2x.png') : require('./img/icon_yhqr@2x.png'), active: flag };
    },
    img3() {
      let status = String(this.orderDetails.status);
      let contains = ['1', '7', '10', '15', '20'];
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_fkl@2x.png') : require('./img/icon_fk@2x.png'), active: flag };
    },
    img4() {
      let status = String(this.orderDetails.status);
      let contains = ['20'];
      let flag = contains.indexOf(status) > -1;
      return { src: flag ? require('./img/icon_wcl@2x.png') : require('./img/icon_wc@2x.png'), active: flag };
    }
  },
  watch: {
    /* eslint-disable */
    orderDetails(newVal, oldVal) { // 监听orderDetails的变化匹配对应的页面
      // 0拍方抓药 1开方抓药 ''为电子处方单
      // 如果有对应的query值就return掉不执行下面的规则，在moutend已经执行过规则
      if (this.$route.query.pay) { // 去支付页面
        this.RUNRULES = this.rules.user['two3'];
        return;
      } else if (this.$route.query.mkc) { // 没有库存
        this.stepText = this.stepTextRules.doctor;
        this.orderDetails.status = 1314;
        this.RUNRULES = this.rules.doctor['mkc'];
        return;
      } else if (this.$route.query.order_type) {
        return;
      }
      // if (this.$route.query.order_type || this.$route.query.pay || this.$route.query.mkc) return;
      if (Number(newVal.order_type) === 0 || newVal.order_type === '') {
        this.stepText = this.stepTextRules.doctor;
        // newVal.status = 5;
        // 医生开方
        switch (Number(newVal.status)) {
          // 0:待审核
          case 0: this.RUNRULES = this.rules.doctor['one']; break;
          // 5 :待确认
          case 5: this.RUNRULES = this.rules.doctor['two']; break;
          // 西药待发货
          case 7: this.RUNRULES = this.rules.doctor['three_xiyao']; break;
          // 10,15:待收货
          case 10:
          case 15: this.RUNRULES = this.rules.doctor['three']; break;
          // 20:已收货
          case 20: this.RUNRULES = this.rules.doctor['four']; break;
          // 已取消
          case 100: this.RUNRULES = this.rules.doctor['doc']; break;
          case 97:
          case 98:
          case 99:
          case 101:
          case 102:
          case 103: this.RUNRULES = this.rules.doctor['five']; break;
          // 订单已过期
          case 104: this.RUNRULES = this.rules.doctor['six']; break;
          // 无库存(去咨询药师)
          case 106: this.RUNRULES = this.rules.doctor['mkc']; break;
        }
      } else {
        this.stepText = this.stepTextRules.user;
        // 用户
        // this.RUNRULES = this.rules.user['two3']; return;
        // newVal.status = 5;
        switch (Number(newVal.status)) {
          // 0:待审核
          case 0:
            this.RUNRULES = this.rules.user['one']; break;
          case 100:
            this.RUNRULES = this.rules.user['none']; break;
          // 5 :待确认
          case 5: this.RUNRULES = this.rules.user['two']; break;
          // 西药待发货
          case 7: this.RUNRULES = this.rules.user['three_xiyao']; break;
          // 10,15:待收货
          case 10:
          case 15: this.RUNRULES = this.rules.user['three']; break;
          // 20:已收货
          case 20: this.RUNRULES = this.rules.user['four']; break;
          // 商家取消订单
          case 103: this.RUNRULES = this.rules.user['three_103']; break;
          // 已取消
          case 97:
          case 98:
          case 99: this.RUNRULES = this.rules.user['five']; break;
          case 102: { // 两种取消页面，状态一样根据药品清单的数量判断进入那种页面
            newVal.docprescriptions[0].docprescriptiondetails.length > 0 ? this.RUNRULES = this.rules.user['gg'] :
              this.RUNRULES = this.rules.user['five'];
            break;
          }
          // 已过期
          case 104: { // 两种过期页面，状态一样根据药品清单的数量判断进入那种页面
            newVal.docprescriptions[0].docprescriptiondetails.length > 0 ? this.RUNRULES = this.rules.user['six'] :
              this.RUNRULES = this.rules.user['five_qx'];
            break;
          }
          // 已过期
          case 101: this.RUNRULES = this.rules.user['six']; break;
          // 非标准处方审核失败(去咨询药师)
          case 105: this.RUNRULES = this.rules.user['none_two']; break;
        }
      }
    },
    // 监听路由的变化，变化页面
    $route(newVal, oldVal) {
      console.log('监听到路由变化');
      // 支付页面
      if (newVal.query.pay && newVal.query.pay === '支付') {
        this.RUNRULES = this.rules.user['two3'];
      }
      // 没库存
      if (newVal.query.mkc && newVal.query.mkc === 'meikucun') {
        this.orderDetails.status = 1314; // 顶部状态置灰
        this.RUNRULES = this.rules.doctor['mkc']; // 应用页面
      }
      this.ROOTDATA();
    },
  },
  // beforeRouteEnter(to, from, next) {
  //   console.log(to.path, from.path);
  //   next(vm => {
  //     vm.ROOTDATA();
  //   });
  // },
  methods: {
    // 退出全屏
    minimg() {
      this.maxF = false;
    },
    // 全屏看处方单
    maximg() {
      this.maxF = true;
    },
    // 上传图片
    addImgUrl(data) {
      this.prescriptionInfo.imageUrl = data.url;
    },
    // 删除图片
    removeImgUrl() {
      this.prescriptionInfo.imageUrl = '';
    },
    // 添加修改收货地址
    ADDADDR() {
      // 如果不是待确认状态就return掉。(只有该状态下才能修改地址且支付服务单页面和没库存页面不能修改地址)
      let pay = this.$route.query.pay === '支付';
      let mkc = this.$route.query.mkc === 'meikucun';
      if (pay || mkc || Number(this.orderDetails.order_type) === 1 || this.orderDetails.status !== 5) return;
      this.$router.push('/address/index');
      // this.$router.push('/address/increaseAddress');
    },
    // 跳到物流详情页面
    goDetail(orderId, kmOrderId, prescrType, logisticsCompany) {
      if (this.lastLogis['addr_info'] !== '暂无物流信息') {
        console.log('跳到物流详情页面');
        this.$router.push({
          name: 'logistics_detail',
          query: {
            order_id: orderId,
            km_order_id: kmOrderId,
            prescr_type: prescrType,
            logistics_company: logisticsCompany
          },
        });
      } else {
        console.log('没有物流信息');
      }
    },
    // 判断是否在微信内(用于支付)
    liulanqi() {
      let ua = navigator.userAgent.toLowerCase();
      let isWeixin = ua.indexOf('micromessenger') !== -1;
      if (isWeixin) {
        this.payisWeixin = true;
        console.log('微信内置浏览器打开');
      } else {
        this.payisWeixin = false;
        console.log('普通浏览器打开');
      }
    },
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
    // 选择按钮的颜色
    GETBTNCOLOR(val) {
      switch (val) {
        case '服务单已完成':
        case '服务单已取消':
        case '服务单已过期':
        case '审核未通过': return '#999';
        default: return '#d74949';
      }
    },
    // 根据订单状态return对应的提示信息
    GETSHNEHE() {
      switch (Number(this.orderDetails.status)) {
        case 0: return '处方审核中';
        case 97:
        case 102: return '用户主动取消';
        case 99:
        case 101: return '医生取消';
        case 103: return '商家取消订单';
        case 104: return '服务单已过期';
        case 98: return '拍方抓药未录入取消';
        case 1314: return '药材库存不足，请咨询医师重新下单，很抱歉为您带来不便';
        case 106: return this.orderDetails.quit_reason || '药材库存不足，请咨询医师重新下单，很抱歉为您带来不便';
        case 105:
        case 100: return this.orderDetails.auditreason || '审核失败';
        default: return this.orderDetails.cancleremark;
      }
    },
    // 提交按钮
    submit(val) {
      switch (val) {
        case '取消服务单':
          this.CANCELORDER();
          break;
        case '咨询药师':
          this.CONSULTDOCTOR();
          break;
        case '确认处方':
          this.CONFIRMPRESCRIPTION();
          break;
        case '确认收货':
          this.CONFIRMGOODS();
          break;
        case '订单支付':
          this.ORDERPAY();
          break;
        default:
          console.log('_:(´ཀ`」 ∠):_');
          break;
      }
    },
    // 修改地址
    MODIFYADDR() {
      let orderAddress = {
        orderId: this.orderDetails.order_id, // 订单Id
      };
      if (JSON.parse(sessionStorage.getItem('preservationAddress'))) {
        let temData = JSON.parse(sessionStorage.getItem('preservationAddress'));
        console.log('temData', temData);
        orderAddress.consignee = temData.addressName,
        orderAddress.conTel = temData.addressPhone,
        orderAddress.province = temData.addressProvince,
        orderAddress.city = temData.addressCity,
        orderAddress.zone = temData.addressDistrict,
        // orderAddress.addrStr = temData.addressNum,
        // orderAddress.detailAddress = temData.addressProvince + temData.addressCity + temData.addressDistrict + temData.addressNum,
        orderAddress.addrStr = temData.addressDetail + temData.addressNum,
        orderAddress.detailAddress = temData.addressProvince + temData.addressCity + temData.addressDistrict + temData.addressDetail + temData.addressNum;
        // console.log('重新修改订单地址orderAddress', orderAddress);
        // sessionStorage.setItem('重新修改订单地址orderAddress', JSON.stringify(orderAddress));
      } else {
        orderAddress.consignee = this.orderDetails.consignee,
        orderAddress.conTel = this.orderDetails.con_tel,
        orderAddress.province = this.orderDetails.provinces,
        orderAddress.city = this.orderDetails.provinces,
        orderAddress.zone = this.orderDetails.zone,
        orderAddress.addrStr = this.orderDetails.addr_str,
        orderAddress.detailAddress = this.orderDetails.provinces + this.orderDetails.provinces + this.orderDetails.zone + this.orderDetails.addr_str;
      }
      // 修改订单地址
      return new Promise((resolve, reject) => {
        doctorAjax.post('api/order/changeOrderAddress', orderAddress).then(res => {
          console.log('修改订单收货地址', res.data.code, res.data.message, res);
          this.ROOTDATA();
          // 用于判断是否有库存
          resolve(res);
        });
      });
    },
    // 取消订单
    CANCELORDER() {
      MessageBox.confirm('是否取消服务单?').then(({ value, action }) => {
        Indicator.open();
        console.log('取消了订单!');
        let url = '/api/order/cancleOrder';
        let params = {
          orderId: this.orderDetails.order_id,
          cancleRemark: value || ''
        };
        doctorAjax.post(url, params).then((res) => {
          console.log(res);
          if (Number(res.code) === -1) {
            Toast(res.message);
          }
          Indicator.close();
          this.$router.go(-1);
        });
      }, () => {});
    },
    // 确认处方
    CONFIRMPRESCRIPTION() {
      // 电商来源的处方单跳回电商支付(防止e抓药和电商重复支付)
      if (Number(this.orderDetails.source_id) === 10058 && Number(this.orderDetails.order_type) === 0) {
        // 移动端与pc端跳到不同页面
        this.isPC() ? window.location.href = 'https://e-gm.km1818.com/orderlist.html' :
          window.location.href = 'http://e-gm.km1818.com/m/home.html';
        return;
      }
      // 收货信息不全无法支付
      if (!this.orderDetails.consignee || !this.orderDetails.con_tel || !this.orderDetails.detail_address) {
        console.log(this.orderDetails);
        Toast('请填写收货信息!');
        return;
      }
      let CODE = 0;
      let STATUS = 5;
      // 修改收货地址改变价格
      switch (Number(this.orderDetails.order_type)) {
        case 1: {
          this.PAYANDMKC(CODE, STATUS);
          break;
        }
        default: {
          this.MODIFYADDR().then(res => {
            CODE = res.data.code;
            STATUS = res.data.data.status;
            this.PAYANDMKC(CODE, STATUS);
          });
          break;
        }
      }
      // 使用window.location.href改变路由防止返回到订单列表页面(缺点：会有白屏)
      // if (window.location.href.indexOf('&pay=支付') > -1) return;
      // window.location.href += '&pay=支付';
      // console.log('跳到待支付页面');
    },
    // 处理支付页面和没库存页面
    PAYANDMKC(CODE, STATUS) {
      switch (CODE) {
        // 106 无库存
        case 0: STATUS === 106 ? this.GOMKC() : this.GOPAY(); break;
        case -1: console.log('网络异常!!!'); break;
      }
    },
    // 去支付
    GOPAY() {
      this.$router.push({
        name: 'prescription_detail',
        query: {
          order_id: this.orderDetails.order_id,
          pay: '支付'
        }
      });
    },
    // 去没库存页面
    GOMKC() {
      this.$router.push({
        name: 'prescription_detail',
        query: {
          order_id: this.orderDetails.order_id,
          mkc: 'meikucun'
        }
      });
    },
    // 确认收货
    CONFIRMGOODS() {
      console.log('点击了确认收货');
      let url = `/api/order/confirmReceipt/${this.orderDetails.order_id}`;
      doctorAjax.get(url).then((res) => {
        console.log(res);
        if (res.data.code === 0) {
          console.log('收货成功');
          switch (Number(this.orderDetails.order_type)) {
            case '':
            case 0: { this.RUNRULES = this.rules.doctor['four']; this.orderDetails.status = 20; break }
            case 1: { this.RUNRULES = this.rules.user['four']; this.orderDetails.status = 20; break }
          }
          Toast('收货成功!');
        } else {
          Toast('收货失败!');
        }
      });
    },
    // 订单支付
    ORDERPAY() {
      if (!this.orderDetails.consignee || !this.orderDetails.con_tel || !this.orderDetails.detail_address) {
        console.log(this.orderDetails);
        Toast('请填写收货信息!');
        return;
      }
      // 开始保存支付操作所需的参数
      let orderAddress = {
        orderId: this.orderDetails.order_id, // 订单Id
      };
      // 如果用户需要修改订单地址 则取出填写的地址 再重新修改订单地址
      if (JSON.parse(sessionStorage.getItem('preservationAddress'))) {
        let temData = JSON.parse(sessionStorage.getItem('preservationAddress'));
        console.log('temData', temData);
        orderAddress.consignee = temData.addressName,
        orderAddress.conTel = temData.addressPhone,
        orderAddress.province = temData.addressProvince,
        orderAddress.city = temData.addressCity,
        orderAddress.zone = temData.addressDistrict,
        // orderAddress.addrStr = temData.addressNum,
        // orderAddress.detailAddress = temData.addressProvince + temData.addressCity + temData.addressDistrict + temData.addressNum,
        orderAddress.addrStr = temData.addressDetail + temData.addressNum,
        orderAddress.detailAddress = temData.addressProvince + temData.addressCity + temData.addressDistrict + temData.addressDetail + temData.addressNum,
        // 修改订单地址
        doctorAjax.post('api/order/changeOrderAddress', orderAddress).then(res => {
          console.log('修改订单收货地址', res);
        });
        // console.log('重新修改订单地址orderAddress', orderAddress);
        // sessionStorage.setItem('重新修改订单地址orderAddress', JSON.stringify(orderAddress));
      }
      // 前往支付页 需要先保存部分支付订单的参数
      let payMsg = {
        orderId: this.orderDetails.order_id, // 订单号
        orderPrice: this.orderDetails.order_price, // 付款金额
        Category: 'prescription', // 商品：product 处方：prescription, 脉诊仪:jinmu
        StoreName: '' // 药店名称 已兼容旧版本
      };
      console.log('支付订单的参数payMsg', payMsg);
      sessionStorage.setItem('weixinPayMsg', JSON.stringify(payMsg));
      if (this.payisWeixin) { // 在微信内浏览器打开 得要先获取微信code值
        goPay();
      } else { // 在微信外的浏览器打开
        this.$router.push('/payment/index');
      }
    },
    // 咨询药师
    CONSULTDOCTOR() {
      console.log('跳到咨询药师页面');
      let _this = this;
      if (this.sending) {
        return false;
      }
      // 跳到咨询药师页面
      let url = '/api/user/rejectOrderConsultDoctor';
      let consultSource = JSON.parse(sessionStorage.getItem('consultSource'));
      let params = {
        ConsultSource: consultSource
      };
      // 无库存
      if (this.orderDetails.status === 106) {
        params.doctor_id = this.doctorId;
      }
      this.sending = true;
      // 获取医生和群组消息
      ajax.post(url, params).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          let consultData = {
            realname: res.data.data.realname, // 医生姓名
            groupid: res.data.data.groupid, // 群主id
            conversationType: 3, // 聊天类型 3 群聊
            doctorphotopath: '' // 医生头像
          };
          sessionStorage.setItem('consultData', JSON.stringify(consultData));
          let targetId = res.data.data.groupid;
          let consults = JSON.parse(sessionStorage.getItem('consultData'));
          let conversationType  = RongIMLib.ConversationType.GROUP; // 单聊,其他会话选择相应的消息类型即可。
          // let targetId = consults.groupid;
          // 无库存
          if (_this.orderDetails.status === 106) {
            // 发送自定义消息
            // 定义消息类型
            let messageName = 'UnknownMessage';
            let objectName = 'app:dialecticalPresc';
            let mesasgeTag = new RongIMLib.MessageTag(true, true);
            let prototypes = ['content'];
            RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
            let data = {
              type: 'prescription_failure',
              order_id: _this.orderDetails.order_id,
              message: _this.orderDetails.quit_reason
            };
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
          } else {
            // 发送文本消息
            let TextMsg = new RongIMLib.TextMessage({ content: '医生帮我看一下处方单' });
            RongIMClient.getInstance().sendMessage(conversationType, targetId, TextMsg, {
              onSuccess: function (message) {
                // message 为发送的消息对象并且包含服务器返回的消息唯一 Id 和发送消息时间戳
                console.log('Send successfully');
                _this.sending = false;
              },
              onError: function (errorCode, message) {
                let info = '';
                switch (errorCode) {
                  case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                  case RongIMLib.ErrorCode.UNKNOWN:
                    info = '未知错误';
                    break;
                  case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                    info = '在黑名单中，无法向对方发送消息';
                    break;
                  case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                    info = '不在讨论组中';
                    break;
                  case RongIMLib.ErrorCode.NOT_IN_GROUP:
                    info = '不在群组中';
                    break;
                  case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                    info = '不在聊天室中';
                    break;
                }
                console.log('发送失败: ' + info + errorCode);
                Toast('发送失败:' + info);
                _this.sending = false;
              }
            });
            // 发送自定义消息
            // 定义消息类型
            let messageName = 'UnknownMessage';
            let objectName = 'app:PrescriptionProtocol';
            let mesasgeTag = new RongIMLib.MessageTag(true, true);
            let prototypes = ['content'];
            RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);
            let data = {
              title: _this.orderDetails.auditreason || '审核不通过，由于处方信息不清楚',
              photoString: _this.orderDetails.docprescriptions[0].recipe_pic_url
            };
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
        } else {
          _this.sending = false;
        }
      });
    },
    // 判断是否为pc或移动端
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
    // 监听手指滑动事件
    touchmoveFunction(e) {
      let el = document.querySelector('.sympt_part');// 需要滑动的dom元素
      if (!e.isSCROLL) {
        e.preventDefault(); // 阻止默认事件(上下滑动)
        console.log('阻止了');
      } else {
        // 需要滑动的区域
        let moveY = e.touches[0].pageY;
        let top = el.scrollTop;
        let ch = el.clientHeight;// 对象最顶端和窗口最顶端之间的距离
        let scrollH = el.scrollHeight; // 含滚动内容的元素大小
        if ((top === 0 && moveY > this.startY) || (top + ch === scrollH && moveY < this.startY)) {
          e.preventDefault();
          console.log('滚来滚去……~(～o￣▽￣)～o 。。');
        } else {
          console.log('滚来滚去……o～(＿△＿o～) ~。。');
        }
      }
    },
    // 滑动开始获取初始位置坐标
    touchstartFunction(e) {
      this.startY = e.touches[0].pageY;
    },
    // 获取订单数据
    ROOTDATA() {
      let order_id = this.$route.query.order_id;
      let url = '/api/order/getPatientOrderDetail/' + order_id;
      doctorAjax.get(url).then((res) => {
        if (res && res.status === 200 && res.data && String(res.data.code) === '0' && res.data.data) {
          console.log('>>>>订单详情数据获取成功', res);
          this.doctorId = res.data.data.doctor_id;
          this.orderDetails = res.data.data;
          // K === 1 ? this.MODIFYADDR() : '';
          // 判断是否是订单列表页确认处方进入
          if (this.$route.query.order_type && this.$route.query.order_type === '2') {
            this.RUNRULES = this.rules.user['two3'];
          } else if (this.$route.query.order_type && this.$route.query.order_type === '1') {
          // 判断是否是拍方抓药页面进入
            this.stepText = this.stepTextRules.user;
            this.RUNRULES = this.rules.user['one'];
          } else if (this.$route.query.pay && this.$route.query.pay === '支付') {
            this.RUNRULES = this.rules.user['two3'];
          }
          // 填写收货地址,只有待确认状态下才能填写收货地址
          if (JSON.parse(sessionStorage.getItem('preservationAddress')) && this.orderDetails.status === 5 && Number(this.orderDetails.order_type) !== 1 ) {
            this.preservationAddress = JSON.parse(sessionStorage.getItem('preservationAddress'));
            console.log(`修改的收货地址信息`, this.preservationAddress);
            this.orderDetails.consignee = this.preservationAddress.addressName;
            this.orderDetails.con_tel = this.preservationAddress.addressPhone;
            // 收货地址采用拼接的形式
            this.orderDetails.detail_address = this.preservationAddress.addressProvince +
                                             this.preservationAddress.addressCity +
                                             this.preservationAddress.addressDistrict +
                                             this.preservationAddress.addressDetail +
                                             this.preservationAddress.addressNum;
          }
          // console.log(res.data.data.docprescriptions['0'].prescr_type);
          // 判断物流,根据prescr_type的类型判断调用什么获取物流信息的接口(西药和非西药的物流信息接口不同)
          if (this.orderDetails.status === 5 || this.orderDetails.status === 0) return;
          switch (Number(res.data.data.docprescriptions['0'].prescr_type)) {
          // 西药物流信息
            case 1: {
              console.log('>>>>开始获取西药物流信息<<<<');
              getLogis1(this);
              break;
            }
            // 非西药物流信息
            default: {
              console.log('>>>>开始获取非西药物流信息<<<<');
              getLogis(this);
            }
          }
        }
      });
    }
  },
  // 获取订单详情
  mounted() {
    this.ROOTDATA();
    // 禁止ios橡皮筋效果(弹簧效果)
    // ********************
    // ********************
    // ********************
    let ios = navigator.userAgent.indexOf('iphone');// 判断是否为ios
    // 获取触摸坐标
    let _this = this;
    document.body.addEventListener('touchstart', _this.touchstartFunction, { passive: false });
    //
    if (ios === -1) {
    // ios下运行
      let el = document.querySelector('.sympt_part');// 需要滑动的dom元素
      iosTrouchFn(el);
    }
    function iosTrouchFn(el) {
    // el需要滑动的元素
      el.addEventListener('touchmove', function(e) {
        e.isSCROLL = true;
      });
      document.body.addEventListener('touchmove', _this.touchmoveFunction, { passive: false }); // passive防止阻止默认事件不生效
    }
  },
  beforeDestroy() {
    // 移除事件监听
    let _this = this;
    document.body.removeEventListener('touchstart', _this.touchstartFunction, { passive: false });
    document.body.removeEventListener('touchmove', _this.touchmoveFunction, { passive: false });
  },
  destroyed() {
    MessageBox.close();
  },
  created() {
    // 先判断是否是在微信内还是微信外的普通手机浏览器
    // document.title = '服务单详情';
    this.liulanqi();
  }
};

</script>
<style lang="less" scoped>
@import '../../styles/mixin.less';
.codeee {
  padding: 12px 10px;
}
.bott {
  padding-bottom: 40px;
}
.jian {
  position: relative;
  &::after {
        content: " ";
        position: absolute;
        right: -10px;
        top: 4px;
        width: 9px;
        height: 9px;
        border-top: 1px solid #000;
        border-right: 1px solid #000;
        transform: rotateZ(45deg);
  }
}
.maximg {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: rgba(0,0,0, .4);
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 10px;
      & img {
        width: 100%;
        height: auto;
   }
}
.presc-index {
  padding-top: 44px;
  height: 100%;
  padding-bottom: 44px;
  background-color: #eeeef3;
  color: #333;
  font-size: 14px;
  overflow-y: scroll;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  & /deep/ ._v-container {
    top: 44px;
    height: 87%!important;
    // ._v-content {
    //   // padding-bottom: 70px;
    // }
  }
  & .prescBody {
    height: calc(100% - 84px);
    position: fixed;
    right: 0;
    left: 0;
    overflow-y: scroll;
    overflow-x: hidden;
  -webkit-overflow-scrolling : touch;
  }
  -webkit-overflow-scrolling : touch;
   & /deep/ .is-fixed {
    z-index: 99;
  }
  // & /deep/ .mint-button--primary {
  //   // background-color: #d74949;
  // }
  & .mint-button--primary {
    position: fixed;
    bottom:0px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    z-index: 99;
    & .is-disabled {
      opacity: 1;
    }
  }
  & .btttn {
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
    left: 0;
    line-height: 40px;
    text-align: center;
    display: flex;
    border-top: 1px solid #eee;
    justify-content: flex-start;
    & span:nth-child(1) {
      width: 160px;
      height: 100%;
      color: #333333;
      text-align: left;
      background: #fff;
      padding-left: 10px;
      i {
        color: #f94f4f;
      }
    }
    & span:nth-child(2) {
      flex: 1;
      background: #d7d7d7;
      color: #848484;
    }
    & span:nth-child(3) {
      flex: 1;
      background: #d74949;
      color: #ffffff;
     }
   }
}

.presc_status_bar {
  background-color: #fff;
  display: flex;
  padding: 0 20px;
  height: 85px;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 10px;

  &:after {
    content: ' ';
    position: absolute;
    width: calc(100% - 80px);
    height: 2px;
    background-color: #c1c1c1;
    top: 34px;
    left: 40px;
    z-index: 0;
  }

  .status_item {
    z-index: 1;
    height: 45px;
    font-size: 14px;
    color: #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: calc(25% - 10px);
    flex: none;
   .circle {
     width: 10px;
     height: 10px;
     border-radius: 50%;
     background: #000;
   }
    img {
      width: 29px;
      height: 29px;
      border-radius: 50%;
    }

    span {
      &.active {
        color: #a46f55;
      }
    }
  }
}
.common {
  background-color: #fff;
  margin-bottom: 10px;
}
.user_tel,
 .daijian,
   .jishu,
 .huairun,
 .method_one,
 .method_two,
 .method_three,
 .method_four {
    padding: 12px 10px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    span:nth-child(2) {
      max-width: 280px;
      text-align: left;
    }
}
// step
.yd_status_bar {
  background-color: #fff;
  padding: 20px 0;
  // border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}
  // 审核-待千金方药师审核
.auditing {
  width: 100%;
  background-color: #fff;
  padding: 11px 10px;
  margin-bottom: 10px;
  color: #26a2ff;
}
  // time
.time {
      padding: 12px 10px;
      & p {
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        & span:nth-child(2) {
           color: #666;
      }
  }
}
  // money
.money {
    & .money_top {
      padding: 12px 10px;
      border-bottom: 1px solid #eee;
      & p {
        padding: 8px 0;
        display: flex;
        justify-content: space-between;
        & span:nth-child(2) {
           color: #666;
      }
    }
  }
  & .money_bottom {
    padding: 20px 10px;
    font-size: 20px;
    font-weight: 700;
    & p {
      display: flex;
      justify-content: space-between;
    }
  }
}
  // 上传
.up {
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
  .consignee_info {
    width: 100%;
    // max-height: 90px;
    // min-height: 70px;
    padding: 16px 10px 16px 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    .wu {
      &::after {
        content: " ";
        position: absolute;
        right: 10px;
        top: 0;
        width: 10px;
        height: 10px;
        border-top: 1px solid #000;
        border-right: 1px solid #000;
        transform: rotateZ(45deg);
      }
    }
    .name_phone {
      position: relative;
      display: flex;
      .name {
        flex: 1;
      }

      .phone {
        flex: 1;
        text-align: right;
      }
    }
  }
  .upcf {
    padding: 36px 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    position: relative;
    justify-content: space-between;
    .imgbox {
      width: 80px;
      height: 80px;
      position: absolute;
      right: 22px;
      bottom: 5px;
      & .recipe {
        width: 100%;
        height: 100%;
        & img{
          width: 100%;
          height: 100%;
        }
      }
    }
    & /deep/ .uploadImg {
      width: 80px;
      height: 80px;
    }
    & /deep/ .upload-wrapper {
      height: 20px;
      top: 30px;
    }
    & /deep/ .havaDataimg {
      width: 80px;
      height: 80px;
      & img {
        width: 100%;
        height: 100%;
      }
    }
  }
  // 地址
  .addr {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 66px;
    padding: 5px 10px;
    border-bottom: 1px solid #eee;
    & .addr_right {
      max-width: 80%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
    }
  }
}
.logis_info_bar {
  width: 100%;
  background-color: #fff;

  .logis_info {
    width: 100%;
    // height: 70px;
    padding: 16px 10px 16px 33px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    position: relative;

    &:after {
      content: " ";
      border: 1px solid;
      width: 8px;
      height: 8px;
      border-color: #666 #666 transparent transparent;
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%) rotate(45deg);
    }

    .logis_desc {
      position: relative;
      width: calc(100% - 20px);
      display: flex;
      span {
        display: inline-block;
        width: 100%;
        font-size: 14px;
        color: #333;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      &:before {
        content: " ";
        position: absolute;
        left: -22px;
        top: 4px;
        width: 17px;
        height: 12px;
        background-image: url(./img/icon_ck@2x.png);
        background-repeat: no-repeat;
        background-size: cover;
      }
    }

    // .logis_time {}
  }

  .consignee_info {
    width: 100%;
    // max-height: 90px;
    // min-height: 70px;
    padding: 16px 10px 16px 33px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    .wu {
      &::after {
        content: " ";
        position: absolute;
        right: 10px;
        top: 5px;
        width: 10px;
        height: 10px;
        border-top: 1px solid #000;
        border-right: 1px solid #000;
        transform: rotateZ(45deg);
      }
    }
    .name_phone {
      position: relative;
      display: flex;

      &:before {
        content: " ";
        position: absolute;
        left: -22px;
        top: 0px;
        width: 13px;
        height: 17px;
        background-image: url(./img/icon_bx@2x.png);
        background-repeat: no-repeat;
        background-size: cover;
      }

      .name {
        flex: 2;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .phone {
        flex: 1;
        text-align: right;
      }
    }
  }
}

.presc_module {
  width: 100%;
  background-color: #fff;
  margin-bottom: 10px;
}


@titlewidth: 120px;

.presc_row {
  background-color: #fff;
  display: flex;
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  // .xy {
  //   // width: 100%;
  // }
  &.noborder {
    border: none;
    justify-content: flex-start;
  }
  &.col {
    flex-direction: column;
    border-bottom: 1px solid #eee;
    & .pl {
      display: flex;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
      }
      .otcANDrx {
        display: inline-block;
        width: 30px;
        height: 15px;
        margin-left: 10px;
      }
      .otch {
        background-image: url(./img/pla_iocn_otch@2x.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position-y: 50%;
      }
      .otcl {
        background-image: url(./img/pla_iocn_otcl@2x.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position-y: 50%;
      }
      .rx {
        background-image: url(./img/pla_iocn_rx@2x.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position-y: 50%;
      }
    }
  }
  .left {
    font-size: 15px;
    color: #333;
    width: 32%;
  }

  .right {
    width: 100%;
    font-size: 15px;
    color: #666;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/*处方清单*/
.drug_list_wrapper {
   .qq {
    display: flex;
    justify-content: space-between;
  }
  .drug_list_title {
    font-size: 16px;
    color: #333;
    padding: 15px 10px;
    border: 1px solid #eee;
    &.jiantou {
      &::after {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-top: 1px solid #987a7a;
        border-left: 1px solid #987a7a;
        transform: rotateZ(45deg);
      }
    }
    &.drugs {
      border: none;
      display: flex;
      span {
        margin-right: 5px;
      }
    }
  }
}

</style>
