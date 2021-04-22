import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.cameraResolution = new THREE.Vector2();
    this.time = 0;
    this.isActive = false;
  }
  start() {
    this.far = 1000;
    this.setFocalLength(50);
    this.position.set(0, 0, 11);
    this.lookAt(new THREE.Vector3());
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
    this.time += time;
  }
  resize(resolution) {
    this.aspect = resolution.x / resolution.y;
    this.updateProjectionMatrix();
  }
}
