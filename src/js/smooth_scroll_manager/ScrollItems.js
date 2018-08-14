const ScrollItem = require('./ScrollItem').default;
const SmoothItem = require('./SmoothItem').default;
const ParallaxItem = require('./ParallaxItem').default;

export default class ScrollItems {
  constructor(scrollManager) {
    this.scrollManager = scrollManager;
    this.scrollItems = [];
    this.smoothItems = [];
    this.parallaxItems = [];
  }
  init() {
    const elmScrollItems = document.querySelectorAll('.js-scroll-item');
    const elmSmoothItems = document.querySelectorAll('.js-smooth-item');
    const elmParallaxItems = document.querySelectorAll('.js-parallax-item');

    this.scrollItems = [];
    this.smoothItems = [];
    this.parallaxItems = [];

    for (var i = 0; i < elmScrollItems.length; i++) {
      this.scrollItems[i] = new ScrollItem(
        elmScrollItems[i], this.scrollManager
      );
    }
    for (var i = 0; i < elmSmoothItems.length; i++) {
      this.smoothItems[i] = new SmoothItem(
        elmSmoothItems[i],
        this.scrollManager,
        this.scrollManager.hookes.smooth,
        elmSmoothItems[i].dataset
      );
    }
    for (var i = 0; i < elmParallaxItems.length; i++) {
      this.parallaxItems[i] = new ParallaxItem(
        elmParallaxItems[i],
        this.scrollManager,
        this.scrollManager.hookes.parallax,
        elmParallaxItems[i].dataset
      );
    }
  }
  scroll() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].show(
        this.scrollManager.scrollTop + this.scrollManager.resolution.y,
        this.scrollManager.scrollTop
      );
    }
  }
  resize() {
    for (var i = 0; i < this.scrollItems.length; i++) {
      this.scrollItems[i].init(this.scrollManager.scrollTop);
    }
    for (var i = 0; i < this.smoothItems.length; i++) {
      this.smoothItems[i].init(this.scrollManager.scrollTop);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].init(this.scrollManager.scrollTop);
    }
  }
  render(isWorking) {
    for (var i = 0; i < this.smoothItems.length; i++) {
      this.smoothItems[i].render(isWorking);
    }
    for (var i = 0; i < this.parallaxItems.length; i++) {
      this.parallaxItems[i].render(isWorking);
    }
  }
}
