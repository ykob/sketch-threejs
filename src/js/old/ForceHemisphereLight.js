import * as THREE from 'three';
import Util from './util';
import Force3 from './Force3';

export default class ForceHemisphereLight extends THREE.HemisphereLight {
  constructor(hex1, hex2, intensity) {
    super(hex1, hex2, intensity);

    this.force = new Force3();
  }
  updatePosition() {
    this.position.copy(this.force.velocity);
  }
  setPolarCoord(rad1, rad2, range) {
    this.position.copy(Util.getPolarCoord(rad1, rad2, range));
  }
}
