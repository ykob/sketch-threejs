const Force3 = require('../common/Force3').default;

export default class Hookes {
  constructor(opt) {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.k = (opt && opt.k !== undefined) ? opt.k : 0.3;
    this.d = (opt && opt.d !== undefined) ? opt.d : 0.7;
    this.m = (opt && opt.m !== undefined) ? opt.m : 1;
  }
  render() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, this.m);
  }
}
