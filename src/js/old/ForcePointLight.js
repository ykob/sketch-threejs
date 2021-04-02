import * as THREE from 'three';
import Util from './util';
import Force3 from './Force3';

export default class ForcePointLight extends THREE.PointLight {
  constructor(hex, intensity, distance, decay) {
    super(hex, intensity, distance, decay);

    this.force = new Force3();
  }
  updatePosition() {
    this.position.copy(this.force.velocity);
  }
  setPolarCoord(rad1, rad2, range) {
    this.position.copy(Util.getPolarCoord(rad1, rad2, range));
  }
}
