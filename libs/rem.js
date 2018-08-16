(function () {
  var html = document.querySelector('html');
  var init = function () {
    var width = html.getBoundingClientRect().width;
    width = Math.round(width); width = width > 750 ? 750 : width;
    var fontSize = width / 750 * 100;
    if (navigator.appVersion.indexOf("MicroMessenger") >= 0) {
      html.style.fontSize = fontSize / (window.devicePixelRatio % 1 ? window.devicePixelRatio % 1 : 1) + "px";
    } else {
      html.style.fontSize = fontSize + "px";
    }
  };
  init();
  var timer;
  var resize = function () { clearTimeout(timer); timer = setTimeout(init, 25) };
  window.addEventListener("resize", resize)
})();