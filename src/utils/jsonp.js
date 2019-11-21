export function ajaxp(params) {
  /* eslint-disable */
  params = params || {};
  params.data = params.data || {};
  let json = params.jsonp ? jsonp(params) : json(params);
  // jsonp请求
  function jsonp(params) {
    //创建script标签并加入到页面中
    let callbackName = params.jsonp;
    let head = document.getElementsByTagName('head')[0];
    // 设置传递给后台的回调参数名
    params.data['callback'] = callbackName;
    let data = formatParams(params.data);
    let script = document.createElement('script');
    head.appendChild(script);
    //创建jsonp回调函数
    window[callbackName] = function(json) {
      head.removeChild(script);
      clearTimeout(script.timer);
      window[callbackName] = null;
      params.success && params.success(json);
    };
    //发送请求
    script.src = params.url + '?' + data;

    //为了得知此次请求是否成功，设置超时处理
    if(params.time) {
      script.timer = setTimeout(function() {
        window[callbackName] = null;
        head.removeChild(script);
        params.error && params.error({
          message: '超时'
        });
      }, params.time);
    }
  };
  //格式化参数
  function formatParams(data) {
    var arr = [];
    for(let name in data) {
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
    };
    // 添加一个随机数，防止缓存
    arr.push('v=' + random());
    return arr.join('&');
  }
  // 获取随机数
  function random() {
    return Math.floor(Math.random() * 10000 + 500);
  }
}
