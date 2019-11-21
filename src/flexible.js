export function FONTSIZE() {
  return (
    !(function (window) {
      let docWidth = 750;
      let doc = window.document;
      let docEl = doc.documentElement;
      let resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
      let recalc = (function refreshRem() {
        let clientWidth = docEl.getBoundingClientRect().width;
        docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 11.2), 8.55) * 5 + 'px';
        return refreshRem;
      })();
      docEl.setAttribute('data-dpr', window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1);
      if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
        doc.documentElement.classList.add('ios');
        if (parseInt(window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8) { doc.documentElement.classList.add('hairline') }
      }
      if (!doc.addEventListener) return;
      window.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener('DOMContentLoaded', recalc, false);
    })(window)
  );
}