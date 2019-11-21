'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 测试环境
  // // 网站
  WEB_HOST: '"http://localhost:8585"',
  // .net 接口 默认host
  BASE_HOST: '"https://tyao.kangmeiyaohulu.com"',
  // .net后台 接口 默认host
  BASE_BACK_HOST: '"https://tdyao.kangmeiyaohulu.com"',
  // .net 医生端接口
  DOCTOR_HOST: '"https://tdocapi.kangmeiyaohulu.com"',
  // java 搜索模块 默认Host
  ES_BASE_HOST: '"https://tsearch.kangmeiyaohulu.com"',
  // java 电商模块 默认host
  MALL_BASE_HOST: '"https://tmall.kangmeiyaohulu.com"',
  // 医林api 默认host
  YILIN_BASE_HOST: '"https://tdocker.kangmeiyaohulu.com"',
  // 文件上传服务器
  UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // get weixin js sdk config host
  WXCONFIG_HOST: '"http://www.jkbat.com"',
  // 融云appKey
  RONGYUN_APPKEY:'"lmxuhwagli3md"',
  // 西药物流接口
  WEST_MEDICINE: '"https://tdmall.kangmeiyaohulu.com"',
  // 微信appId
  APPID:'"wx730edeff1905080d"',
  /**
  // .net 接口 默认host
  BASE_HOST: '"https://yao.kangmei.com.cn"',
  // .net后台 接口 默认host
  BASE_BACK_HOST: '"https://yaoadmin.kangmei.com.cn"',
  // .net 医生端接口
  DOCTOR_HOST: '"https://docapi.kangmei.com.cn"',
  // java 搜索模块 默认Host
  ES_BASE_HOST: '"https://search.kangmei.com.cn"',
  // java 电商模块 默认host
  MALL_BASE_HOST: '"https://mall.kangmei.com.cn"',
  // 医林api 默认host
  YILIN_BASE_HOST: '"https://docker.kangmei.com.cn"',
  // 文件上传服务器
  UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // get weixin js sdk config host
  WXCONFIG_HOST: '"http://www.jkbat.com"',
  // 融云appKey
  RONGYUN_APPKEY: '"z3v5yqkbz1g30"',
  // 微信appId
  APPID:'"wx939de8bcffa23bb0"',
   **/

  // 正式环境
  // WEB_HOST: '"https://yhlwx.kangmei.com.cn"',
  // // app H5
  // WEB_HOST_APP: '"https://mob.kangmei.com.cn"',
  // // .net 接口 默认host
  // BASE_HOST: '"https://yao.kangmei.com.cn"',
  // // .net后台 接口 默认host
  // BASE_BACK_HOST: '"https://yaoadmin.kangmei.com.cn"',
  // // .net 医生端接口
  // DOCTOR_HOST: '"https://docapi.kangmei.com.cn"',
  // // java 搜索模块 默认Host
  // ES_BASE_HOST: '"https://search.kangmei.com.cn"',
  // // java 电商模块 默认host
  // MALL_BASE_HOST: '"https://mall.kangmei.com.cn"',
  // // 医林api 默认host
  // YILIN_BASE_HOST: '"https://docker.kangmei.com.cn"',
  // // 文件上传服务器
  // UPLOAD_HOST: '"https://uploads.kangmei.com.cn"',
  // // get weixin js sdk config host
  // WXCONFIG_HOST: '"http://www.jkbat.com"',
  // // 西药物流接口
  // WEST_MEDICINE: '"https://addmall.kangmei.com.cn"',
  // // 融云appKey
  // RONGYUN_APPKEY: '"z3v5yqkbz1g30"',
  // // 微信appId
  // APPID:'"wx939de8bcffa23bb0"',

})
