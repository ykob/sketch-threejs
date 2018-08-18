export default class SmoothItem {
  constructor(elm, scrollManager, hookes, opt) {
    this.scrollManager = scrollManager;
    this.hookes = hookes;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.max = (opt && opt.max) ? opt.max : null;
    this.min = (opt && opt.min) ? opt.min : null;
    this.ratio = (opt && opt.ratio) ? opt.ratio : 0.1;
    this.unit = (opt && opt.unit) ? opt.unit : 'px';
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = scrollTop + rect.top;
    this.elm.style.backfaceVisibility = 'hidden';
  }
  render(iwWorking) {
    let v = 0;
    if (iwWorking) {
      v = this.hookes.velocity[1] * this.ratio;
      if (Math.abs(this.hookes.acceleration[1]) < 0.01) this.hookes.velocity[1] = this.hookes.anchor[1];
      if (this.min) v = Math.max(v, this.min);
      if (this.max) v = Math.min(v, this.max);
    }
    this.elm.style.transform = `translate3D(0, ${v}${this.unit}, 0)`;
  }
}
