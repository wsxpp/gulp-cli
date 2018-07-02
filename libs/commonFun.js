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
function getElementComputerStyle(selector, attribute) {
  var element = document.querySelector(selector);
  return parseFloat(window.getComputedStyle(element, null)[attribute]);
}