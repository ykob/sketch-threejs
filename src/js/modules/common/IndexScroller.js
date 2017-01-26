import force3 from './force3';

const glMatrix = require('gl-matrix');

export default class IndexScroller {
  constructor() {
    this.elm = {
      contents: document.getElementById('index-contents'),
      scroll: document.getElementById('index-scroll'),
      items: document.getElementsByClassName('js-index-scroll-item'),
    };
    this.items = [];
    this.offsetTop = window.pageYOffset * -1;
    this.isAnimate = false;

    this.init();
    this.start();
    this.on();
  }
  init() {
    this.elm.scroll.style.height = `${this.elm.contents.clientHeight}px`;
    for (var i = 0; i < this.elm.items.length; i++) {
      this.items[i] = {
        offset: this.elm.items[i].offsetTop,
        velocity: [0, 0, 0],
        acceleration: [0, 0, 0],
        anchor: [0, 0, 0],
        mass: Math.random() * 0.05 + 1.1
      };
    }
  }
  scroll() {
    this.offsetTop = window.pageYOffset * -1;
    for (var i = 0; i < this.elm.items.length; i++) {
      this.items[i].anchor[1] = this.offsetTop;
    }
  }
  resize() {
    this.init();
  }
  start() {
    this.isAnimate = true;
    this.renderLoop();
  }
  render() {
    for (var i = 0; i < this.elm.items.length; i++) {
      const item = this.items[i];
      if (
        glMatrix.vec3.length(item.acceleration) < 0.01
        && Math.abs(item.velocity[1] - item.anchor[1]) < 0.01
      ) continue;
      force3.applyHook(item.velocity, item.acceleration, item.anchor, 0, 0.045);
      glMatrix.vec3.divide(item.acceleration, item.acceleration, [1, item.mass, 1]);
      force3.applyDrag(item.acceleration, 0.16);
      force3.updateVelocity(item.velocity, item.acceleration, 1);
      this.elm.items[i].style.transform = `translate3D(0, ${item.velocity[1]}px, 0)`;
    }
  }
  renderLoop() {
    this.render();
    if (this.isAnimate) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
  on() {
    window.addEventListener('scroll', () => {
      this.scroll();
    });
    window.addEventListener('resize', () => {
      this.resize();
    });
  }
}
