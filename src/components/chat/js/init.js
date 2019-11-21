(function (dependencies) {
  let global = dependencies.global;
  let RongIMLib = dependencies.RongIMLib;
  let RongIMClient = RongIMLib.RongIMClient;
  function ObserverList() {

    let checkIndexOutBound = function (index, bound) {
      return index > -1 && index < bound;
    };

    this.observerList = [];

    this.add = function (observer, force) {
      force && (this.observerList.length = 0);
      this.observerList.push(observer);
    };

    this.get = function (index) {
      if (checkIndexOutBound(index, this.observerList.length)) {
        return this.observerList[index];
      }
    };

    this.count = function () {
      return this.observerList.length;
    };

    this.removeAt = function (index) {
      checkIndexOutBound(index, this.observerList.length) && this.observerList.splice(index, 1);
    };

    this.remove = function (observer) {
      if (!observer) {
        this.observerList.length = 0;
        return;
      }
      /* eslint-disable */
      observer = Object.prototype.toString.call(observer) === '[object Function]' ? [observer] : observer;
      for (let i = 0, len = this.observerList.length; i < len; i++) {
        if (this.observerList[i] === observer[i]) {
          this.removeAt(i);
          break;
        }
      }
    };

    this.notify = function (val) {
      for (let i = 0, len = this.observerList.length; i < len; i++) {
        this.observerList[i](val);
      }
    };

    this.indexOf = function (observer, startIndex) {
      let i = startIndex || 0;
      let len = this.observerList.length;
      while (i < len) {
        if (this.observerList[i] === observer) {
          return i;
        }
        i++;
      }
      return -1;
    };
  }

  let msgObserverList = new ObserverList();

  let init = function (params, callbacks) {
    let appKey = params.appKey;
    let token = params.token;
    let navi = params.navi || '';

    if (navi !== '') {
      //私有云
      let config = {
        navi: navi
      }
      RongIMLib.RongIMClient.init(appKey, null, config);
    } else {
      //公有云
      RongIMLib.RongIMClient.init(appKey);
    }

    let instance = RongIMClient.getInstance();

    // 连接状态监听器
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTED:
            callbacks.getInstance && callbacks.getInstance(instance);
            // cb && cb(callbacks);
            break;
        }
      }
    });
    //开始链接
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        callbacks.getCurrentUser && callbacks.getCurrentUser({ userId: userId });
        // cb && cb(callbacks);
        console.log('链接成功');
      },
      onTokenIncorrect: function () {
        console.log('token无效');
      },
      onError: function (errorCode) {
        console.log(errorCode);
      }
    });
    RongIMLib.RongIMVoice.init();
  }

  let watch = function (watcher) {
    msgObserverList.add(watcher);
  };

  global.QuickInit = {
    init: init,
    watch: watch
  };
})({
  global: window,
  RongIMLib: RongIMLib
});
