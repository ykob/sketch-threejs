import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import TorusKnot from './TorusKnot';
import Aura from './Aura';

export default class AuraObject extends THREE.Group {
  constructor(alpha) {
    const obj = new TorusKnot();
    const aura = new Aura();

    super();
    this.name = 'AuraObject';
    this.add(obj);
    this.add(aura);

    this.radian = MathEx.radians(alpha * 360);
    this.time = 0;
    this.isActive = false;
  }
  start() {
    this.children[0].start();
    this.children[1].start();
    this.isActive = true;
  }
  update(time, camera) {
    if (this.isActive === false) return;

    this.time += time;
    this.radian += time;
    this.position.set(
      Math.cos(this.radian) * 10,
      0,
      Math.sin(this.radian) * 10
    );
    this.children[0].update(time);
    this.children[1].update(time, camera);
  }
  resize(camera) {
    this.children[1].resize(camera);
  }
}
