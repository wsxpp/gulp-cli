'use strict';

!function () {
  var ModalHelper = function (bodyCls) {
    var scrollLeft;
    return {
      afterOpen: function afterOpen() {
        scrollLeft = document.scrollingElement.scrollLeft;
        document.body.classList.add(bodyCls);
        document.body.style.left = -scrollLeft + 'px';
      },
      beforeClose: function beforeClose() {
        document.body.classList.remove(bodyCls);
        // scrollLeft lost after set position:fixed, restore it back.
        document.scrollingElement.scrollLeft = scrollLeft;
      }
    };
  }('modal-open');
  /**
   * 计算自动滚动屏幕居中
   */
  var rem = parseFloat(document.querySelector('html').style.fontSize);
  var scrollX = 1.86 / 2 * rem;
  var scrollIng = false;
  $('html, body').scrollLeft(scrollX);
  $('html').on('touchend', function () {
    if (scrollX != $('html, body').scrollLeft()) {
      scrollIng = true;
      $('html, body').animate({ scrollLeft: scrollX }, 500, function () {
        scrollIng = false;
      });
    }
  });

  /**
   * 开始弹层点击按钮关闭弹层
   */
  $('.start-mask .btn-start').on('click', function () {
    $('.start-mask').fadeOut();
  });

  /**
   * 切换道具分类
   */
  $('.option').on('click', function () {
    $('.option').removeClass('active');
    $(this).addClass('active');
    $('.box').hide();
    $('.' + this.dataset.class).show();
  });

  /**
   * 控制选择道具框展开和收起
   */
  $('.switch-bar .arrow').on('click', function () {
    if (this.classList.contains('rotate')) {
      this.classList.remove('rotate');
      $('.props-box').animate({ bottom: "0" }, 500);
    } else {
      this.classList.add('rotate');
      $('.props-box').animate({ bottom: "-3.2rem" }, 500);
    }
  });

  /**
   * 切换背景
   */
  $('.box-bg >div').on('click', function () {
    document.querySelector('.index-container').style.backgroundImage = 'url(' + this.dataset.url + ')';
  });

  /**
   * 选择道具
   */
  $('.box-prop >div').on('click', function () {
    $('.index-container').append('\n      <div class="prop" style="top:0px;left:100px;width:100px;">\n        <img src="' + this.dataset.url + '" class="propImg">\n        <div class="del"></div>\n        <div class="scale"></div>\n      </div>\n    ');
  });

  /**
   * 选中道具时，页面不可拖动
   */
  var timer = void 0;
  $(document).on('touchstart', '.prop', function () {
    clearTimeout(timer);
    ModalHelper.afterOpen();
  }).on('touchend', '.prop', function () {
    timer = setTimeout(ModalHelper.beforeClose, 500);
  });

  /**
   * 删除道具
   */
  $(document).on('click', '.prop .del', function () {
    $(this.parentNode).remove();
  });

  /**
   * 缩放道具
   */
  document.addEventListener('touchstart', function (e) {
    if (e.target.classList.contains('scale')) {
      e.target.dataset['startX'] = e.touches[0].clientX;
      e.target.dataset['startW'] = e.target.parentNode.style.width;
    }
  });
  document.addEventListener('touchmove', function (e) {
    if (e.target.classList.contains('scale')) {
      e.target.parentNode.style.width = parseFloat(e.target.dataset['startW']) + e.touches[0].clientX - parseFloat(e.target.dataset['startX']) + 'px';
    }
  });

  /**
   * 移动道具
   */
  document.addEventListener('touchstart', function (e) {
    if (scrollIng) return;
    if (e.target.classList.contains('propImg')) {
      e.target.dataset['startX'] = e.touches[0].clientX;
      e.target.dataset['startY'] = e.touches[0].clientY;
    }
  });
  document.addEventListener('touchmove', function (e) {
    if (scrollIng) return;
    if (e.target.classList.contains('propImg')) {
      e.target.parentNode.style.left = e.touches[0].clientX - parseFloat(e.target.dataset['startX']) + parseFloat(e.target.parentNode.style.left) + 'px';
      e.target.parentNode.style.top = e.touches[0].clientY - parseFloat(e.target.dataset['startY']) + parseFloat(e.target.parentNode.style.top) + 'px';
      e.target.dataset['startX'] = e.touches[0].clientX;
      e.target.dataset['startY'] = e.touches[0].clientY;
    }
  });
}();