import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.time = 0;
    this.isActive = false;
  }
  start() {
    this.aspect = 3 / 2;
    this.far = 1000;
    this.setFocalLength(50);
    this.position.set(0, 10, 40);
    this.lookAt(new THREE.Vector3(0, 0, 0));
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
