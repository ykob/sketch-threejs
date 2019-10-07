import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.cameraResolution = new THREE.Vector2();
  }
  start() {
    this.aspect = 3 / 2;
    this.far = 1000;
    this.setFocalLength(50);
    this.position.set(0, 6, 50);
    this.lookAt(new THREE.Vector3(0, 6, 0));
  }
  update(time) {
  }
  resize(resolution) {
    if (resolution.x > resolution.y) {
      this.cameraResolution.set(
        (resolution.x >= 1200) ? 1200 : resolution.x,
        (resolution.x >= 1200) ? 800 : resolution.x * 0.66,
      );
    } else {
      this.cameraResolution.set(
        ((resolution.y >= 1200) ? 800 : resolution.y * 0.66) * 0.6,
        ((resolution.y >= 1200) ? 1200 : resolution.y) * 0.6,
      );
    }
    this.setViewOffset(
      this.cameraResolution.x,
      this.cameraResolution.y,
      (resolution.x - this.cameraResolution.x) / -2,
      (resolution.y - this.cameraResolution.y) / -2,
      resolution.x,
      resolution.y
    );
    this.updateProjectionMatrix();
  }
}
