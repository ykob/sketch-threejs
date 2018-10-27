const THREE = require('three');
const Force3 = require('./Force3').default;

export default class ForcePerspectiveCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);
    this.k = 0.02;
    this.d = 0.2;
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.lookK = 0.02;
    this.lookD = 0.2;
    this.lookVelocity = [0, 0, 0];
    this.lookAcceleration = [0, 0, 0];
    this.lookAnchor = [0, 0, 0];
  }
  updatePosition() {
    Force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, this.k);
    Force3.applyDrag(this.acceleration, this.d);
    Force3.updateVelocity(this.velocity, this.acceleration, 1);
  }
  updateLook() {
    Force3.applyHook(this.lookVelocity, this.lookAcceleration, this.lookAnchor, 0, this.lookK);
    Force3.applyDrag(this.lookAcceleration, this.lookD);
    Force3.updateVelocity(this.lookVelocity, this.lookAcceleration, 1);
  }
  render() {
    this.updatePosition();
    this.updateLook();
    this.position.set(
      this.velocity[0],
      this.velocity[1],
      this.velocity[2]
    );
    this.lookAt(
      this.lookVelocity[0],
      this.lookVelocity[1],
      this.lookVelocity[2]
    );
  }
}
