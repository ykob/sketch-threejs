import * as THREE from 'three';
import Util from './util';
import Force3 from './Force3';

export default class ForceCamera extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);

    this.force = {
      position: new Force3(),
      look: new Force3(),
    };
    this.up.set(0, 1, 0);
  }
  updatePosition() {
    this.position.copy(this.force.position.velocity);
  }
  updateLook() {
    this.lookAt(
      this.force.look.velocity.x,
      this.force.look.velocity.y,
      this.force.look.velocity.z
    );
  }
  reset() {
    this.setPolarCoord();
    this.lookAtCenter();
  }
  resize(width, height) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }
  setPolarCoord(rad1, rad2, range) {
    this.force.position.anchor.copy(Util.getPolarCoord(rad1, rad2, range));
  }
  lookAtCenter() {
    this.lookAt(0, 0, 0);
  }
}
