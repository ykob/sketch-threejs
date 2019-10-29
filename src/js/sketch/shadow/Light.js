import * as THREE from 'three';

export default class Light extends THREE.DirectionalLight {
  constructor() {
    super(0xffffff, 0.5);
    this.name = 'Light';
    this.position.set(-10, 20, 0);
    this.castShadow = true;
    this.time = 0;
    this.isActive = false;
  }
  start() {
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
    this.time += time;
  }
}
