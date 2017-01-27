import buildVueIndex from './buildVueIndex';
import force3 from './force3';

const glMatrix = require('gl-matrix');
const debounce = require('js-util/debounce');
const isSmartphone = require('js-util/isSmartphone');

export default class IndexScroller {
  constructor() {
    this.vm = buildVueIndex(this);
    this.elm = {
      wrap: document.getElementById('index'),
      contents: document.getElementById('index-contents'),
      scroll: document.getElementById('index-scroll'),
      items: document.getElementsByClassName('js-index-scroll-item'),
    };
    this.items = [];
    this.offsetTop = window.pageYOffset * -1;
    this.isAnimate = false;

    this.on();
    //this.open();
  }
  init() {
    this.elm.scroll.style.height = `${this.elm.contents.clientHeight}px`;
    for (var i = 0; i < this.elm.items.length; i++) {
      this.items[i] = {
        offset: this.elm.items[i].offsetTop,
        velocity: [0, 0, 0],
        acceleration: [0, 0, 0],
        anchor: [0, 0, 0],
        mass: i * 0.05 + 1.2,
      };
      this.elm.items[i].style.transform = `translate3D(0, ${this.items[i].velocity[1]}px, 0)`;
    }
    setTimeout(() => {
      if (this.elm.scroll.clientHeight != this.elm.contents.clientHeight) {
        this.elm.scroll.style.height = `${this.elm.contents.clientHeight}px`;
      }
    }, 500);
  }
  scroll() {
    if (!this.vm.isOpened) return;
    this.offsetTop = window.pageYOffset * -1;
    for (var i = 0; i < this.elm.items.length; i++) {
      this.items[i].anchor[1] = this.offsetTop;
    }
  }
  resize() {
    if (!this.vm.isOpened) return;
    this.init();
  }
  open() {
    this.init();
    this.isAnimate = true;
    document.body.classList.add(`is-opened-index`);
    this.renderLoop();
  }
  close() {
    this.elm.scroll.style.height = 0;
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
      force3.applyHook(item.velocity, item.acceleration, item.anchor, 0, 0.3);
      force3.applyDrag(item.acceleration, 0.7);
      force3.updateVelocity(item.velocity, item.acceleration, item.mass);
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
    if (isSmartphone()) {
      window.addEventListener('orientationchange', (event) => {
        this.resize();
      });
    } else {
      window.addEventListener('resize', debounce((event) => {
        this.resize();
      }, 100));
    }
  }
}
