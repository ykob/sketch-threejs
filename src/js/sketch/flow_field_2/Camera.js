import * as THREE from 'three';

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.cameraResolution = new THREE.Vector2();
    this.time = 0;
  }
  start() {
    this.far = 1000;
    this.setFocalLength(50);
    this.position.set(80, 0, 0);
    this.lookAt(new THREE.Vector3());
  }
  update(time) {
    this.time += time;
  }
  resize(resolution) {
    this.aspect = resolution.x / resolution.y;
    this.updateProjectionMatrix();
  }
}
