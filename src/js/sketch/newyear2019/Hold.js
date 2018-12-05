export default class Hold {
  constructor() {
    this.v = 0;
    this.a = 0;
    this.isHolding = false;
    this.isOvered = false;
  }
  render(time) {
    if (this.isOvered) return;
    // calculate acceleration.
    if (this.isHolding === true) {
      this.a = this.a * 1.05 + 0.02 * time;
    } else {
      if (this.v > 0) this.a = this.v * -3 * time;
    }
    // add acceleration to velocity.
    this.v += this.a;
    // ceil
    if (this.v < 0) {
      this.v = 0;
      this.a = 0;
    }
    if (this.v >= 100) {
      this.v = 100;
      this.a = 0;
    }
  }
}
