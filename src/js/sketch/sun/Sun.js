import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class Sun extends THREE.Group {
  constructor() {
    // Create Object3D
    super();
    this.time = 0;
    this.name = 'Sun';
  }
  start() {
  }
  update(time) {
    this.time += time;

    this.rotation.set(
      0,
      MathEx.radians(this.time * 10),
      MathEx.radians(45)
    );
  }
}
