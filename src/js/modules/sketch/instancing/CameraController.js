import MathEx from 'js-util/MathEx';

export default class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.radian1 = 0;
    this.radian1Base = 0;
    this.radian2 = 0;
    this.radian2Base = 0;
    this.radius = 2500;
  }
  rotate(x, y) {
    this.radian1 = MathEx.clamp(this.radian1Base + y, MathEx.radians(-75), MathEx.radians(75));
    this.radian2 = this.radian2Base - x * 2;
  }
  zoom(delta) {
    if (!delta) return;
    this.radius -= delta / Math.abs(delta) * 200;
    this.radius = MathEx.clamp(this.radius, 700, 8000);
  }
  touchEnd() {
    this.radian1Base = this.radian1;
    this.radian2Base = this.radian2;
  }
  render() {
    this.camera.anchor = MathEx.polar(this.radian1, this.radian2, this.radius);
    this.camera.render();
  }
}
