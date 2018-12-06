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
      document.querySelector(selector).style.display = 'block';
      ModalHelper.afterOpen();
    },
    hide: function (selector) {
      ModalHelper.beforeClose();
      document.querySelector(selector).style.display = 'none';
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
// axios.defaults.transformRequest = [function (data) {
//   let ret = ''
//   for (let it in data) {
//     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
//   }
//   return ret
// }];

var bindGetCode = function (time, btn_text) {
  var btn = document.querySelector('.btn-getCode');
  var tel = document.querySelector('.tel');
  var time = time; //时间间隔
  var telNumber = "";
  var counting = false;
  var countTime = time;
  // 倒计时
  var count = function () {
    if (countTime >= 0) {
      btn.innerHTML = countTime-- + 's';
      setTimeout(count, 1000)
    } else {
      countTime = time;
      btn.innerHTML = '获取验证码';
      counting = false;
      checkTel();
    }
  }
  // 检查手机号
  var checkTel = function () {
    if (telNumber.checkTel() && !counting) {
      btn.classList.add('active')
    } else {
      btn.classList.remove('active')
    }
  }
  tel.addEventListener('input', function () {
    telNumber = this.value;
    checkTel();
  })
  btn.addEventListener('click', function () {
    if (this.classList.contains('active')) {
      this.classList.remove('active');
      counting = true;
      count()
    }
  })
}