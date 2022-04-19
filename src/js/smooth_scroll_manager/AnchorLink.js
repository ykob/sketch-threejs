const ScrollInnerPage = require('../old/ScrollInnerPage');

export default class AnchorLink {
  constructor(elm, scrollManager) {
    this.scrollManager = scrollManager;
    this.scrollInnerPage = new ScrollInnerPage();
    this.elm = elm;
    this.on();
  }
  move() {
    const hash = this.elm.getAttribute('href');
    const target = document.querySelector(hash);
    const targetRect = target.getBoundingClientRect();
    const anchorY = this.scrollManager.scrollTop + targetRect.top;
    if (this.scrollManager.resolution.x <= this.scrollManager.X_SWITCH_SMOOTH) {
      this.scrollInnerPage.start(anchorY, 1000);
    } else {
      window.scrollTo(0, anchorY);
    }
  }
  on() {
    this.elm.addEventListener('click', (event) => {
      event.preventDefault();
      this.move();
    });
  }
}
