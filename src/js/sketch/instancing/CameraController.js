const THREE = require('three');
const glMatrix = require('gl-matrix');
const { MathEx } = require('@ykob/js-util');

export default class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.radian1 = 0;
    this.radian1Base = 0;
    this.radian2 = 0;
    this.radian2Base = 0;
    this.radius = 2500;
    this.isZoom = false;
  }
  rotate(x, y) {
    if (this.isZoom === true) this.isZoom = false;
    this.radian1 = MathEx.clamp(this.radian1Base + y, MathEx.radians(-75), MathEx.radians(75));
    this.radian2 = this.radian2Base - x * 2;
  }
  zoom(delta) {
    if (!delta) return;
    if (this.isZoom === false) this.isZoom = true;
    const prevRadius = this.radius;
    this.radius -= delta / Math.abs(delta) * 200;
    this.radius = MathEx.clamp(this.radius, 700, 8000);
    const diff = prevRadius - this.radius;
  }
  touchEnd() {
    this.radian1Base = this.radian1;
    this.radian2Base = this.radian2;
  }
  render() {
    this.camera.anchor = MathEx.spherical(this.radian1, this.radian2, this.radius);
    this.camera.render();
  }
  computeZoomLength() {
    if (this.isZoom) {
      return glMatrix.vec3.length(this.camera.acceleration) * 0.05;
    } else {
      return 0;
    }
  }
  computeAcceleration() {
    return glMatrix.vec3.length(this.camera.acceleration) * 0.05;
  }
}
