import * as THREE from 'three';

const updateVelocity = (velocity, acceleration, mass) => {
  // glMatrix.vec3.scale(acceleration, acceleration, 1 / mass);
  // glMatrix.vec3.add(velocity, velocity, acceleration);
  acceleration.multiplyScalar(1 / mass);
  velocity.add(acceleration);
}
const applyDrag = (acceleration, value, drag) => {
  // const drag = [0, 0, 0];
  // glMatrix.vec3.scale(drag, acceleration, -1);
  // glMatrix.vec3.normalize(drag, drag);
  // glMatrix.vec3.scale(drag, drag, glMatrix.vec3.length(acceleration) * value);
  // glMatrix.vec3.add(acceleration, acceleration, drag);

  drag.copy(acceleration.clone().multiplyScalar(-1))
    .normalize()
    .multiplyScalar(acceleration.length() * (value));
  acceleration.add(drag);
}
const applyHook = (velocity, acceleration, anchor, restLength, k, hook) => {
  // const hook = [0, 0, 0];
  // glMatrix.vec3.sub(hook, velocity, anchor);
  // const distance = glMatrix.vec3.length(hook) - restLength;
  // glMatrix.vec3.normalize(hook, hook);
  // glMatrix.vec3.scale(hook, hook, -1 * k * distance);
  // glMatrix.vec3.add(acceleration, acceleration, hook);

  hook.copy(velocity.clone().sub(anchor));
  const distance = hook.length() - restLength;
  hook.normalize()
    .multiplyScalar(-1 * k * distance);
  acceleration.add(hook);
}

export default class ForcePerspectiveCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

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
}
