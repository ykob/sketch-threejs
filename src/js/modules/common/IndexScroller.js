import force3 from './force3';

const glMatrix = require('gl-matrix');
const debounce = require('js-util/debounce');

export default class IndexScroller {
  constructor() {
    this.elm = {
      wrap: document.getElementById('index-wrap'),
      contents: document.getElementById('index-contents'),
      scroll: document.getElementById('index-scroll'),
      items: document.getElementsByClassName('js-index-scroll-item'),
    };
    this.items = [];
    this.offsetTop = window.pageYOffset * -1;
    this.isAnimate = false;

    this.init();
    this.on();
    // this.open();
  }
  init() {
    this.elm.scroll.style.height = `${this.elm.contents.clientHeight}px`;
    for (var i = 0; i < this.elm.items.length; i++) {
      this.items[i] = {
        offset: this.elm.items[i].offsetTop,
        velocity: [0, 0, 0],
        acceleration: [0, 0, 0],
        anchor: [0, 0, 0],
        mass: Math.random() * 0.05 + 1.1,
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
  open() {
    this.init();
    this.isAnimate = true;
    this.renderLoop();
    document.body.classList.add(`is-opened-index`);
    this.elm.wrap.classList.add(`is-opened`);
    for (var i = 0; i < this.elm.items.length; i++) {
      const index = i;
      setTimeout(() => {
        this.elm.items[index].classList.add(`is-opened`);
      }, 40 * index)
    }
  }
  close() {
    this.isAnimate = false;
    document.body.classList.remove(`is-opened-index`);
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
    window.addEventListener('scroll', debounce((event) => {
      this.scroll();
    }, 10));
    window.addEventListener('resize', debounce((event) => {
      this.resize();
    }, 100));
  }
}
