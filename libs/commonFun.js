/**
 * 滚动穿透处理
 */
!function () {
  var style = document.createElement("style");
  style.innerHTML = 'body.modal-open {position: fixed;width: 100%;}';
  document.head.appendChild(style);
}()

var ModalHelper = (function (bodyCls) {
  var scrollTop;
  return {
    afterOpen: function () {
      scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add(bodyCls);
      document.body.style.top = -scrollTop + 'px';
    },
    beforeClose: function () {
      document.body.classList.remove(bodyCls);
      // scrollTop lost after set position:fixed, restore it back.
      document.scrollingElement.scrollTop = scrollTop;
    }
  };
})('modal-open');

/**
 * 弹层的静态方法
 */
var Mask = (function () {
  return {
    show: function (selector) {
      document.querySelector(selector).hidden = false;
      ModalHelper.afterOpen();
    },
    hide: function (selector) {
      ModalHelper.beforeClose();
      document.querySelector(selector).hidden = true;
    }
  };
})();

/**
 * 返回一个元素的计算属性
 */
function getStyle(selector, attribute) {
  var element = document.querySelector(selector);
  return window.getComputedStyle(element, null)[attribute];
}

/**
 * 手机号格式校验
 */
String.prototype.checkTel = function () {
  return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(this)
}

/**
 * 身份证格式校验
 */
String.prototype.checkIdcard = function () {
  return /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(this)
}

/**
 * axios 数据data反字符串转json
 */
axios.defaults.transformRequest = [function (data) {
  let ret = ''
  for (let it in data) {
    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
  }
  return ret
}];