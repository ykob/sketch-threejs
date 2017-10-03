import MathEx from 'js-util/MathEx';

export default class ParallaxItem {
  constructor(elm, scrollManager, hookes, opt) {
    this.scrollManager = scrollManager;
    this.hookes = hookes;
    this.elm = elm;
    this.height = 0;
    this.top = 0;
    this.max = (opt && opt.max) ? opt.max : 10;
    this.min = (opt && opt.min) ? opt.min : -10;
    this.ratio = (opt && opt.ratio) ? opt.ratio : 0.012;
    this.unit = (opt && opt.unit) ? opt.unit : '%';
  }
  init(scrollTop) {
    const rect = this.elm.getBoundingClientRect();
    this.height = rect.height;
    this.top = scrollTop + rect.top;
    this.elm.style.backfaceVisibility = 'hidden';
  }
  render(iwWorking) {
    const y = (iwWorking) ? MathEx.clamp(
      (this.hookes.velocity[1] - (this.top + this.height * 0.5)) * this.ratio,
      this.min,
      this.max
    ) : 0;
    this.elm.style.transform = `translate3D(0, ${y}${this.unit}, 0)`;
  }
}
