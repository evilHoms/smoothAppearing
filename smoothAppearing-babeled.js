'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

var SmoothAppearing = function () {
  function SmoothAppearing() {
    _classCallCheck(this, SmoothAppearing);

    this.animationSpeed = '1s';
    this.delay = 500;

    this.ANIMATION_CLASSES = '.appears-top, .appears-bottom, .appears-left, .appears-right, .appears-hidden';
    this.ANIMATION_CLASSES_ARRAY = ['appears-top', 'appears-bottom', 'appears-left', 'appears-right', 'appears-hidden'];
    this.ANIMATION_STATES = ['waiting', 'in_progress', 'ended'];
    this.SCROLL_Y = {
      prev: window.scrollY,
      curr: window.scrollY,
      dir: undefined
    };

    this.animationElements;

    this.wrapper = this.wrapContent();
  }

  // Оборачиваем содержимое страницы в div, для контроля overflow


  _createClass(SmoothAppearing, [{
    key: 'wrapContent',
    value: function wrapContent() {
      var wrapper = document.createElement('div');
      Array.from(document.body.children).forEach(function (child) {
        wrapper.appendChild(child);
      });

      document.body.appendChild(wrapper);

      return wrapper;
    }

    // Задаем к обертке ширину и высоту, равную ширине и высоте всего документа, так же задаем overflow
    // По завершению анимации данные стили удаляются
    // Изменить. Задаваться должны перед началом конкретной анимации, удаляться по завершению анимации, если нет анимация в процессе.

  }, {
    key: 'setWrapperStyle',
    value: function setWrapperStyle(wrapper) {
      wrapper.style.height = document.documentElement.scrollHeight + 'px';
      wrapper.style.width = document.documentElement.scrollWidth + 'px';
      wrapper.style.overflow = 'hidden';
    }

    // Метод анимированного появления элемента из за экрана сверху.

  }, {
    key: 'appearsFromTop',
    value: function appearsFromTop(element) {
      var _this = this;

      var wasScrolled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      var animationSpeed = this.animationSpeed;
      var delay = this.delay;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      // Действия по завершению анимации
      var onTransitionEnd = function onTransitionEnd(e) {
        element.style.position = null;
        element.style.top = null;
        element.style.transition = null;
        element.classList.remove('appears-top');
        element._animationState = ANIMATION_STATES[2];

        if (!_this.isAnimInProgress(_this.animationElements)) _this.clear();
      };

      var _element$getBoundingC = element.getBoundingClientRect(),
          height = _element$getBoundingC.height,
          y = _element$getBoundingC.y;

      var _getComputedStyle = getComputedStyle(element),
          top = _getComputedStyle.top,
          position = _getComputedStyle.position;

      element._animationState = ANIMATION_STATES[1];
      var wasScrolledUp = wasScrolled && SCROLL_Y.dir === 'up';

      switch (position) {

        // При статичном позиционировании меняем позиционирование элемента на относительное
        // Задаем позицию верхнего края за верхней границей экрана, после этого
        // Включаем анимацию через таймер, иначе анимация не сработает, тк не успеет примениться
        case 'static':
          element.style.position = 'relative';
          // Фикс для случая, когда данная анимация должна примениться при скролле страницы вверх
          // Без условия, при рокрутке вверх анимация применится очень быстро
          element.style.top = '-' + (wasScrolledUp ? window.innerHeight / 3 + height : y + height) + 'px';
          setTimeout(function () {
            return element.style.transition = 'top ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.top = 0;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;

        // При остальных видах позиционирования, запоминаем начальное значение топ, перемещаем 
        // Элемент за границу экрана и активируем анимацию к запомненному положению.
        case 'fixed':
        case 'absolute':
        case 'relative':
          element.style.top = '-' + (wasScrolledUp ? window.innerHeight / 3 + height - parseInt(top) : y + height - parseInt(top)) + 'px';
          setTimeout(function () {
            return element.style.transition = 'top ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.top = top;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;
      }
    }

    // Метод анимированного появления элемента из за экрана снизу.

  }, {
    key: 'appearsFromBottom',
    value: function appearsFromBottom(element) {
      var _this2 = this;

      var wasScrolled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      var animationSpeed = this.animationSpeed;
      var delay = this.delay;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      var onTransitionEnd = function onTransitionEnd(e) {
        element.style.position = null;
        element.style.bottom = null;
        element.style.transition = null;
        element.classList.remove('appears-bottom');
        element._animationState = ANIMATION_STATES[2];

        if (!_this2.isAnimInProgress(_this2.animationElements)) _this2.clear();
      };

      var _element$getBoundingC2 = element.getBoundingClientRect(),
          height = _element$getBoundingC2.height,
          y = _element$getBoundingC2.y;

      var _getComputedStyle2 = getComputedStyle(element),
          bottom = _getComputedStyle2.bottom,
          position = _getComputedStyle2.position;

      var winHeight = window.innerHeight;
      element._animationState = ANIMATION_STATES[1];
      var wasScrolledDown = wasScrolled && SCROLL_Y.dir === 'down';

      switch (position) {

        case 'static':
          element.style.position = 'relative';
          element.style.bottom = '-' + (wasScrolledDown ? winHeight * 1.7 - y : winHeight - y) + 'px';
          setTimeout(function () {
            return element.style.transition = 'bottom ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.bottom = 0;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;

        case 'relative':
        case 'fixed':
        case 'absolute':
          element.style.bottom = '-' + (wasScrolledDown ? winHeight * 1.7 - y : winHeight - y + parseInt(bottom)) + 'px';
          setTimeout(function () {
            return element.style.transition = 'bottom ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.bottom = bottom;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;
      }
    }

    // Метод анимированного появления элемента из за экрана слева.

  }, {
    key: 'appearsFromLeft',
    value: function appearsFromLeft(element) {
      var _this3 = this;

      var animationSpeed = this.animationSpeed;
      var delay = this.delay;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      var onTransitionEnd = function onTransitionEnd(e) {
        element.style.position = null;
        element.style.left = null;
        element.style.transition = null;
        element.classList.remove('appears-left');
        element._animationState = ANIMATION_STATES[2];

        if (!_this3.isAnimInProgress(_this3.animationElements)) _this3.clear();
      };

      var _element$getBoundingC3 = element.getBoundingClientRect(),
          width = _element$getBoundingC3.width,
          x = _element$getBoundingC3.x;

      var _getComputedStyle3 = getComputedStyle(element),
          left = _getComputedStyle3.left,
          position = _getComputedStyle3.position;

      var winWidht = window.innerWidth;
      element._animationState = ANIMATION_STATES[1];

      switch (position) {

        case 'static':
          element.style.position = 'relative';
          element.style.left = '-' + (x + width) + 'px';
          setTimeout(function () {
            return element.style.transition = 'left ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.left = 0;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;

        case 'relative':
        case 'fixed':
        case 'absolute':
          element.style.left = '-' + (x + width + parseInt(left)) + 'px';
          setTimeout(function () {
            return element.style.transition = 'left ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.left = left;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;
      }
    }

    // Метод анимированного появления элемента из за экрана справа.

  }, {
    key: 'appearsFromRight',
    value: function appearsFromRight(element) {
      var _this4 = this;

      var animationSpeed = this.animationSpeed;
      var delay = this.delay;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      var onTransitionEnd = function onTransitionEnd(e) {
        element.style.position = null;
        element.style.right = null;
        element.style.transition = null;
        element.classList.remove('appears-right');
        element._animationState = ANIMATION_STATES[2];

        if (!_this4.isAnimInProgress(_this4.animationElements)) _this4.clear();
      };

      var _element$getBoundingC4 = element.getBoundingClientRect(),
          width = _element$getBoundingC4.width,
          x = _element$getBoundingC4.x;

      var _getComputedStyle4 = getComputedStyle(element),
          right = _getComputedStyle4.right,
          position = _getComputedStyle4.position;

      var winWidth = window.innerWidth;
      element._animationState = ANIMATION_STATES[1];

      switch (position) {

        case 'static':
          element.style.position = 'relative';
          element.style.right = '-' + (winWidth - x) + 'px';
          setTimeout(function () {
            return element.style.transition = 'right ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.right = 0;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;

        case 'relative':
        case 'fixed':
        case 'absolute':
          element.style.right = '-' + (winWidth - x - parseInt(right)) + 'px';
          setTimeout(function () {
            return element.style.transition = 'right ' + animationSpeed;
          }, 1);
          setTimeout(function () {
            return element.style.right = right;
          }, delay);
          setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
          element.addEventListener('transitionend', onTransitionEnd);
          break;
      }
    }

    // Метод анимированного появления элемента из за на месте из невидимости.

  }, {
    key: 'appearsHidden',
    value: function appearsHidden(element) {
      var _this5 = this;

      var animationSpeed = this.animationSpeed;
      var delay = this.delay;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      var onTransitionEnd = function onTransitionEnd(e) {
        element.style.transition = null;
        element.classList.remove('appears-hidden');
        element.style.opacity = null;
        element._animationState = ANIMATION_STATES[2];

        if (!_this5.isAnimInProgress(_this5.animationElements)) _this5.clear();
      };

      element._animationState = ANIMATION_STATES[1];

      element.style.opacity = 0;
      setTimeout(function () {
        return element.style.transition = 'opacity ' + animationSpeed;
      }, 1);
      setTimeout(function () {
        return element.style.opacity = 1;
      }, delay);
      setTimeout(onTransitionEnd, parseFloat(animationSpeed) * 1000 * 1.2 + delay);
      element.addEventListener('transitionend', onTransitionEnd);
    }
  }, {
    key: 'isAnimInProgress',
    value: function isAnimInProgress(elements) {
      var _this6 = this;

      elements.forEach(function (el) {
        if (el._animationState === _this6.ANIMATION_STATES[1]) return true;
      });
      return false;
    }

    // Очистка стилей для обертки

  }, {
    key: 'clear',
    value: function clear() {
      this.wrapper.style.overflow = null;
      this.wrapper.style.width = null;
      this.wrapper.style.height = null;
    }

    // Инициализируем начальные значения доп параметров анимируемых элементов

  }, {
    key: 'initElements',
    value: function initElements(elements) {
      var _this7 = this;

      elements.forEach(function (el) {
        el._animationState = _this7.ANIMATION_STATES[0];
        el._animationType = _this7.ANIMATION_CLASSES_ARRAY.find(function (cl) {
          return el.classList.contains(cl);
        });
      });
    }

    // Запуск анимации для элемента, в зависимости от класса

  }, {
    key: 'animateElement',
    value: function animateElement(element) {
      var wasScrolled = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      switch (element._animationType) {
        case ANIMATION_CLASSES_ARRAY[0]:
          this.appearsFromTop(element, wasScrolled);
          break;
        case ANIMATION_CLASSES_ARRAY[1]:
          this.appearsFromBottom(element, wasScrolled);
          break;
        case ANIMATION_CLASSES_ARRAY[2]:
          this.appearsFromLeft(element, wasScrolled);
          break;
        case ANIMATION_CLASSES_ARRAY[3]:
          this.appearsFromRight(element, wasScrolled);
          break;
        case ANIMATION_CLASSES_ARRAY[4]:
          this.appearsHidden(element, wasScrolled);
          break;
      }
    }

    // Функция запускает все анимации на странице

  }, {
    key: 'runAnimation',
    value: function runAnimation(animSpeed, animDelay) {
      var _this8 = this;

      var animationSpeed = this.animationSpeed;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      animSpeed && (this.animationSpeed = typeof animSpeed === 'number' ? animSpeed / 1000 + 's' : animSpeed);
      this.delay = animDelay || this.delay;
      var delay = this.delay;

      var elementsToAnimate = document.querySelectorAll(ANIMATION_CLASSES);
      this.animationElements = elementsToAnimate;
      this.initElements(elementsToAnimate);
      this.setWrapperStyle(this.wrapper);
      elementsToAnimate.forEach(function (el) {
        return _this8.animateElement(el);
      });

      setTimeout(function () {
        return _this8.clear;
      }, parseInt(animationSpeed) * 1000);
    }

    // После вызова функции, запускаются анимации, при прокрутке до них

  }, {
    key: 'runAnimationOnScroll',
    value: function runAnimationOnScroll(animSpeed, animDelay) {
      var _this9 = this;

      var animationSpeed = this.animationSpeed;
      var ANIMATION_CLASSES = this.ANIMATION_CLASSES;
      var ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
      var ANIMATION_STATES = this.ANIMATION_STATES;
      var SCROLL_Y = this.SCROLL_Y;

      var wasScrolled = false;

      // Запускается анимация, когда объект находится на экране
      var onWindowScrollRunAnim = function onWindowScrollRunAnim(e) {
        SCROLL_Y.prev = SCROLL_Y.curr;
        SCROLL_Y.curr = window.scrollY;
        SCROLL_Y.dir = SCROLL_Y.curr > SCROLL_Y.prev ? 'down' : SCROLL_Y.curr < SCROLL_Y.prev ? 'up' : undefined;
        elementsToAnimate.forEach(function (el) {
          if (el.getBoundingClientRect().y < window.innerHeight && el._animationState === ANIMATION_STATES[0] && el.getBoundingClientRect().y + el.getBoundingClientRect().height > 0) {
            _this9.setWrapperStyle(_this9.wrapper);
            _this9.animateElement(el, wasScrolled);
          }
        });
        wasScrolled = true;
      };

      animSpeed && (this.animationSpeed = typeof animSpeed === 'number' ? animSpeed / 1000 + 's' : animSpeed);
      this.delay = animDelay || this.delay;
      var delay = this.delay;

      var elementsToAnimate = document.querySelectorAll(ANIMATION_CLASSES);
      this.animationElements = elementsToAnimate;
      this.initElements(elementsToAnimate);
      onWindowScrollRunAnim();

      window.addEventListener('scroll', onWindowScrollRunAnim);
    }
  }]);

  return SmoothAppearing;
}();