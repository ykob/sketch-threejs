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
      };
    }
  }
  scroll() {
    this.offsetTop = window.pageYOffset * -1;
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
      this.elm.items[i].style.transform = `translate3D(0, ${this.offsetTop}px, 0)`;
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
