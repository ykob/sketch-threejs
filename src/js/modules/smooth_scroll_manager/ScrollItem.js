export default class ScrollItem {
  constructor(elm) {
    this.elm = elm;
    this.elmChildren = elm.querySelectorAll('.js-scroll-item-child');
    this.top = 0;
    this.bottom = 0;
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.top = scrollTop + rect.top;
    this.bottom = this.top + rect.height;
  }
  show(top, bottom) {
    if (top > this.top && bottom < this.bottom) {
      this.elm.classList.add('is-shown');
      for (var i = 0; i < this.elmChildren.length; i++) {
        this.elmChildren[i].classList.add('is-shown');
      }
    }
  }
}
