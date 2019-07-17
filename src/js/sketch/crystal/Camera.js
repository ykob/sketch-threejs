import * as THREE from 'three';

const updateVelocity = (velocity, acceleration, mass) => {
  acceleration.multiplyScalar(1 / mass);
  velocity.add(acceleration);
}
const applyDrag = (acceleration, value, drag) => {
  drag.copy(acceleration.clone().multiplyScalar(-1))
    .normalize()
    .multiplyScalar(acceleration.length() * (value));
  acceleration.add(drag);
}
const applyHook = (velocity, acceleration, anchor, restLength, k, hook) => {
  hook.copy(velocity.clone().sub(anchor));
  const distance = hook.length() - restLength;
  hook.normalize()
    .multiplyScalar(-1 * k * distance);
  acceleration.add(hook);
}

export default class Camera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.cameraResolution = new THREE.Vector2();

    this.drag = new THREE.Vector3();
    this.hook = new THREE.Vector3();

    this.k = 0.02;
    this.d = 0.3;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();

    this.lookK = 0.02;
    this.lookD = 0.3;
    this.lookVelocity = new THREE.Vector3();
    this.lookAcceleration = new THREE.Vector3();
    this.lookAnchor = new THREE.Vector3();
  }
  start() {
    this.aspect = 3 / 2;
    this.far = 1000;
    this.setFocalLength(50);
    this.position.set(0, 0, 50);
    this.lookAt(new THREE.Vector3());
  }
  update() {
    // update the position velocity.
    applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k, this.hook);
    applyDrag(this.acceleration, this.d, this.drag);
    updateVelocity(this.velocity, this.acceleration, 1);

    // update the look velocity.
    applyHook(this.lookVelocity, this.lookAcceleration, this.lookAnchor, 0, this.lookK, this.hook);
    applyDrag(this.lookAcceleration, this.lookD, this.drag);
    updateVelocity(this.lookVelocity, this.lookAcceleration, 1);

    // update the default camera properties.
    this.position.copy(this.velocity);
    this.lookAt(this.lookVelocity);
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
