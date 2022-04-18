import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class CameraAura extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.distance = 0;
  }
  start() {
    this.aspect = 1;
    this.far = 1000;
    this.setFocalLength(50);
    this.distance = Math.abs(Math.tan(MathEx.radians(this.fov) / 2) * 2) * 20 * 2;
  }
  update(camera) {
    this.position.copy(camera.position).normalize().multiplyScalar(this.distance);
    this.lookAt(new THREE.Vector3());
  }
}
