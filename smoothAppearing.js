'use strict';
if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

class SmoothAppearing {
  constructor() {
    this.animationSpeed = '1s';
    this.delay = 500;

    this.ANIMATION_CLASSES = '.appears-top, .appears-bottom, .appears-left, .appears-right, .appears-hidden';
    this.ANIMATION_CLASSES_ARRAY = [
      'appears-top', 'appears-bottom', 'appears-left', 'appears-right', 'appears-hidden'
    ];
    this.ANIMATION_STATES = ['waiting', 'in_progress', 'ended'];
    this.SCROLL_Y = {
      prev: window.scrollY,
      curr: window.scrollY,
      dir: undefined
    }

    this.animationElements;

    this.wrapper = this.wrapContent();
  }

  // Оборачиваем содержимое страницы в div, для контроля overflow
  wrapContent() {
    const wrapper = document.createElement('div');
    Array.from(document.body.children).forEach (child => {
      wrapper.appendChild(child);
    });
  
    document.body.appendChild(wrapper);
  
    return wrapper;
  }

  // Задаем к обертке ширину и высоту, равную ширине и высоте всего документа, так же задаем overflow
  // По завершению анимации данные стили удаляются
  // Изменить. Задаваться должны перед началом конкретной анимации, удаляться по завершению анимации, если нет анимация в процессе.
  setWrapperStyle(wrapper) {
    wrapper.style.height = document.documentElement.scrollHeight + 'px';
    wrapper.style.width = document.documentElement.scrollWidth + 'px';
    wrapper.style.overflow = 'hidden';
  }

  // Метод анимированного появления элемента из за экрана сверху.
  appearsFromTop(element, wasScrolled = false) {

    const animationSpeed = this.animationSpeed;
    const delay = this.delay;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    // Действия по завершению анимации
    const onTransitionEnd = (e) => {
      element.style.position = null;
      element.style.top = null;
      element.style.transition = null;
      element.classList.remove('appears-top');
      element._animationState = ANIMATION_STATES[2];

      if (!this.isAnimInProgress(this.animationElements))
        this.clear();
    }

    const { height, y } = element.getBoundingClientRect();
    const { top, position } = getComputedStyle(element);
    element._animationState = ANIMATION_STATES[1];
    const wasScrolledUp = (wasScrolled && SCROLL_Y.dir === 'up');

    switch (position) {

      // При статичном позиционировании меняем позиционирование элемента на относительное
      // Задаем позицию верхнего края за верхней границей экрана, после этого
      // Включаем анимацию через таймер, иначе анимация не сработает, тк не успеет примениться
      case 'static':
        element.style.position = 'relative';
        // Фикс для случая, когда данная анимация должна примениться при скролле страницы вверх
        // Без условия, при рокрутке вверх анимация применится очень быстро
        element.style.top = `-${wasScrolledUp ? window.innerHeight / 3 + height : y + height}px`;
        setTimeout(() => element.style.transition = `top ${animationSpeed}`, 1);
        setTimeout(() => element.style.top = 0, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;

      // При остальных видах позиционирования, запоминаем начальное значение топ, перемещаем 
      // Элемент за границу экрана и активируем анимацию к запомненному положению.
      case 'fixed':
      case 'absolute':
      case 'relative':
        element.style.top = `-${wasScrolledUp ? window.innerHeight / 3 + height - parseInt(top) : y + height - parseInt(top)}px`;
        setTimeout(() => element.style.transition = `top ${animationSpeed}`, 1);
        setTimeout(() => element.style.top = top, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;
    }
  }

  // Метод анимированного появления элемента из за экрана снизу.
  appearsFromBottom(element, wasScrolled = false) {

    const animationSpeed = this.animationSpeed;
    const delay = this.delay;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    const onTransitionEnd = (e) => {
      element.style.position = null;
      element.style.bottom = null;
      element.style.transition = null;
      element.classList.remove('appears-bottom');
      element._animationState = ANIMATION_STATES[2];

      if (!this.isAnimInProgress(this.animationElements))
        this.clear();
    }

    const { height, y } = element.getBoundingClientRect();
    const { bottom, position } = getComputedStyle(element);
    const winHeight = window.innerHeight;
    element._animationState = ANIMATION_STATES[1];
    const wasScrolledDown = (wasScrolled && SCROLL_Y.dir === 'down');

    switch (position) {

      case 'static':
        element.style.position = 'relative';
        element.style.bottom = `-${wasScrolledDown ? winHeight * 1.7 - y : winHeight - y}px`;
        setTimeout(() => element.style.transition = `bottom ${animationSpeed}`, 1);
        setTimeout(() => element.style.bottom = 0, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;

      case 'relative':
      case 'fixed':
      case 'absolute':
        element.style.bottom = `-${wasScrolledDown ? winHeight * 1.7 - y : winHeight - y + parseInt(bottom)}px`;
        setTimeout(() => element.style.transition = `bottom ${animationSpeed}`, 1);
        setTimeout(() => element.style.bottom = bottom, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;
    }
  }

  // Метод анимированного появления элемента из за экрана слева.
  appearsFromLeft(element) {

    const animationSpeed = this.animationSpeed;
    const delay = this.delay;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    const onTransitionEnd = (e) => {
      element.style.position = null;
      element.style.left = null;
      element.style.transition = null;
      element.classList.remove('appears-left');
      element._animationState = ANIMATION_STATES[2];

      if (!this.isAnimInProgress(this.animationElements))
        this.clear();
    }

    const { width, x } = element.getBoundingClientRect();
    const { left, position } = getComputedStyle(element);
    const winWidht = window.innerWidth;
    element._animationState = ANIMATION_STATES[1];

    switch (position) {

      case 'static':
        element.style.position = 'relative';
        element.style.left = `-${x + width}px`;
        setTimeout(() => element.style.transition = `left ${animationSpeed}`, 1);
        setTimeout(() => element.style.left = 0, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;

      case 'relative':
      case 'fixed':
      case 'absolute':
        element.style.left = `-${x + width + parseInt(left)}px`;
        setTimeout(() => element.style.transition = `left ${animationSpeed}`, 1);
        setTimeout(() => element.style.left = left, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;
    }
  }


  // Метод анимированного появления элемента из за экрана справа.
  appearsFromRight(element) {

    const animationSpeed = this.animationSpeed;
    const delay = this.delay;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    const onTransitionEnd = (e) => {
      element.style.position = null;
      element.style.right = null;
      element.style.transition = null;
      element.classList.remove('appears-right');
      element._animationState = ANIMATION_STATES[2];

      if (!this.isAnimInProgress(this.animationElements))
        this.clear();
    }

    const { width, x } = element.getBoundingClientRect();
    const { right, position } = getComputedStyle(element);
    const winWidth = window.innerWidth;
    element._animationState = ANIMATION_STATES[1];

    switch (position) {

      case 'static':
        element.style.position = 'relative';
        element.style.right = `-${winWidth - x}px`;
        setTimeout(() => element.style.transition = `right ${animationSpeed}`, 1);
        setTimeout(() => element.style.right = 0, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;

      case 'relative':
      case 'fixed':
      case 'absolute':
        element.style.right = `-${winWidth - x - parseInt(right)}px`;
        setTimeout(() => element.style.transition = `right ${animationSpeed}`, 1);
        setTimeout(() => element.style.right = right, delay);
        setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
        element.addEventListener('transitionend', onTransitionEnd);
        break;
    }
  }

  // Метод анимированного появления элемента из за на месте из невидимости.
  appearsHidden(element) {

    const animationSpeed = this.animationSpeed;
    const delay = this.delay;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    const onTransitionEnd = (e) => {
      element.style.transition = null;
      element.classList.remove('appears-hidden');
      element.style.opacity = null;
      element._animationState = ANIMATION_STATES[2];

      if (!this.isAnimInProgress(this.animationElements))
        this.clear();
    }

    element._animationState = ANIMATION_STATES[1];

    element.style.opacity = 0;
    setTimeout(() => element.style.transition = `opacity ${animationSpeed}`, 1);
    setTimeout(() => element.style.opacity = 1, delay);
    setTimeout(onTransitionEnd, (parseFloat(animationSpeed) * 1000) * 1.2 + delay);
    element.addEventListener('transitionend', onTransitionEnd);

  }

  isAnimInProgress(elements) {
    elements.forEach(el => {
      if (el._animationState === this.ANIMATION_STATES[1])
        return true;
    });
    return false;
  }

  // Очистка стилей для обертки
  clear() {
    this.wrapper.style.overflow = null;
    this.wrapper.style.width = null;
    this.wrapper.style.height = null;
  }
  
  // Инициализируем начальные значения доп параметров анимируемых элементов
  initElements(elements) {
    elements.forEach(el => {
      el._animationState = this.ANIMATION_STATES[0];
      el._animationType = this.ANIMATION_CLASSES_ARRAY.find(cl => { return el.classList.contains(cl) } );
    });
  }

  // Запуск анимации для элемента, в зависимости от класса
  animateElement(element, wasScrolled = false) {
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
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
  runAnimation(animSpeed, animDelay) {

    const animationSpeed = this.animationSpeed;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;

    animSpeed && (this.animationSpeed = typeof(animSpeed) === 'number' ? animSpeed / 1000 + 's' : animSpeed);
    this.delay = animDelay || this.delay;
    const delay = this.delay;
  
    const elementsToAnimate = document.querySelectorAll(ANIMATION_CLASSES);
    this.animationElements = elementsToAnimate;
    this.initElements(elementsToAnimate);
    this.setWrapperStyle(this.wrapper);
    elementsToAnimate.forEach(el => this.animateElement(el));
  
    setTimeout(() => this.clear, parseInt(animationSpeed) * 1000);
  }
  
  // После вызова функции, запускаются анимации, при прокрутке до них
  runAnimationOnScroll(animSpeed, animDelay) {

    const animationSpeed = this.animationSpeed;
    const ANIMATION_CLASSES = this.ANIMATION_CLASSES;
    const ANIMATION_CLASSES_ARRAY = this.ANIMATION_CLASSES_ARRAY;
    const ANIMATION_STATES = this.ANIMATION_STATES;
    const SCROLL_Y = this.SCROLL_Y;
  
    let wasScrolled = false;
  
    // Запускается анимация, когда объект находится на экране
    const onWindowScrollRunAnim = (e) => {
      SCROLL_Y.prev = SCROLL_Y.curr;
      SCROLL_Y.curr = window.scrollY;
      SCROLL_Y.dir = SCROLL_Y.curr > SCROLL_Y.prev ? 'down' : 
                     SCROLL_Y.curr < SCROLL_Y.prev ? 'up' :
                     undefined;
      elementsToAnimate.forEach(el => {
        if (el.getBoundingClientRect().y < window.innerHeight && 
            el._animationState === ANIMATION_STATES[0] &&
            el.getBoundingClientRect().y + el.getBoundingClientRect().height > 0) {
          this.setWrapperStyle(this.wrapper);
          this.animateElement(el, wasScrolled);
        }
      });
      wasScrolled = true;
    }

    animSpeed && (this.animationSpeed = typeof(animSpeed) === 'number' ? animSpeed / 1000 + 's' : animSpeed);
    this.delay = animDelay || this.delay;
    const delay = this.delay;
  
    const elementsToAnimate = document.querySelectorAll(ANIMATION_CLASSES);
    this.animationElements = elementsToAnimate;
    this.initElements(elementsToAnimate);
    onWindowScrollRunAnim();
  
    window.addEventListener('scroll', onWindowScrollRunAnim);
  }

}