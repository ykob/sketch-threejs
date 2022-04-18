const THREE = require('three');
const glMatrix = require('gl-matrix');
const { MathEx } = require('@ykob/js-util');

export default class CameraController {
  constructor(camera, focalLength) {
    this.camera = camera;
    this.anchorTilt = [0, 0, 0];
  }
  init(position, lookAt) {
    for (var i = 0; i < position.length; i++) {
      this.camera.anchor[i] = this.camera.velocity[i] = position[i];
      this.camera.lookAnchor[i] = this.camera.lookVelocity[i] = lookAt[i];
    }
  }
  tilt(mousemove) {
    this.anchorTilt = [
      mousemove.x * -50,
      mousemove.y * 25,
      0
    ];
  }
  move(position, lookAt, focalLength) {
    for (var i = 0; i < position.length; i++) {
      this.camera.anchor[i] = position[i];
      this.camera.lookAnchor[i] = lookAt[i];
    }
    if (focalLength > 0 && this.focalLength.next !== focalLength) {
      this.focalLength.prev = this.focalLength.next;
      this.focalLength.next = focalLength;
      this.focalLength.time = 0;
    }
  }
  render(time, mousemove) {
    this.tilt(mousemove);
    glMatrix.vec3.add(this.camera.velocity, this.camera.velocity, this.anchorTilt);
    this.camera.render();
  }
}
