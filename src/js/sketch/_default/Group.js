import * as THREE from 'three';

export default class Group extends THREE.Group {
  constructor() {
    // Create Object3D
    super();
    this.name = 'Group';
    this.isActive = false;
  }
  start() {
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
  }
}
