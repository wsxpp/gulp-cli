(function () {
  var d = document.getElementsByTagName("html")[0];
  var b = function () {
    var e = d.getBoundingClientRect().width;
    e = Math.round(e);
    e = e > 750 ? 750 : e;
    var f = e / 750 * 100;
    d.style.fontSize = f + "px"
  };
  b();
  var a;
  var c = function () {
    clearTimeout(a);
    a = setTimeout(b, 25)
  };
  window.addEventListener("resize", c)
})();