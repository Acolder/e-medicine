import ajax from '@/utils/ajax.js';
import java from '@/utils/javaApiRequest.js';
import WmedicineRequest from '@/utils/WmedicineRequest.js';
// 获取药物流信息需要根据药品的类型调用接口
export function getLogis(_self) {
  // 智慧药房订单Id,km_order_id
  let order_id = _self.orderDetails.km_order_id;
  if (!order_id) {
    return;
  }
  // 非西药接口
  let url = '/api/system/GetOutsideUrl';
  let params = {
    'url': `http://www.kmzhyf.cn:8182/zyf/web?order_id=${order_id}&methodName=getWLInfoNoValicode`
  };
  ajax.get(url, {
    params: params
  }).then((res) => {
    if (res) {
      let response = JSON.parse(res.data.data);
      if (res.status === 200 && response && response.head && response.head.code === '0' && response.data) {
        _self.logisticsInfo = response.data;
        console.log('非西药物流信息获取成功', _self.logisticsInfo);
        if (response.data.list.length > 0) {
          _self.lastLogis = response.data.list.pop();
          // eslint-disable-next-line no-unused-expressions
          _self.lastLogis['addr_info'] === '' ? _self.lastLogis['addr_info'] === '暂无物流信息' : '';
        }
      }
    }
  });
}
// 获取物流订单---通过用户详情
export function getLogis1(_self) {
  let order_id = _self.orderDetails.km_order_id;
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
        _self.logisticsInfo2['logisticsNumber'] = response.resultData.logisticsNumber;
        _self.logisticsInfo2['logisticsType'] = response.resultData.logisticsType;
        _self.logisticsInfo2['orderId'] = response.resultData.orderId;
        console.log('1.用户详情信息获取成功，开始转换物流类型', _self.logisticsInfo2);
        queryKdnName(_self);
      }
    }
  });
}
// 转换物流类型，兼容旧接口
function queryKdnName(_self) {
  let url = '/mall_suport/back/order/queryKdnName';
  let param = {
    type: _self.logisticsInfo2['logisticsType']
  };
  WmedicineRequest.post(url, param).then(res => {
    if (res.status === 200 && res.data.resultCode === '0' && res.data.resultData) {
      // 转换物流类型
      _self.logisticsInfo2['logisticsType'] = res.data.resultData.kdnName;
      console.log('2.物流类型转换成功，开始获取西药物流信息', _self.logisticsInfo2);
      getLogis2(_self);
    }
  });
}
// 获取西药物流信息
export function getLogis2(_self) {
  // 西药接口
  let url = '/mall_suport/back/order/logisticsInfo';
  let params = _self.logisticsInfo2;
  WmedicineRequest.post(url, params).then(res => {
    if (res) {
      let response = res.data;
      if (res.status === 200 && response && response.resultCode === '0' && response.resultData) {
        _self.logisticsInfo = response.resultData;
        console.log('3.西药物流信息获取成功', _self.logisticsInfo);
        _self.lastLogis['addr_info'] = response.resultData.Traces.length > 0 ? response.resultData.Traces.concat().shift().AcceptStation : '';
        _self.lastLogis['current_lo_time'] = response.resultData.Traces.length > 0 ? response.resultData.Traces.concat().shift().AcceptTime : '';
      } else {
        // eslint-disable-next-line no-unused-expressions
        _self.lastLogis['addr_info'] === '暂无物流信息';
      }
    }
  });
}