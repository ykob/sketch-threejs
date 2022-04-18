import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class Drag {
  constructor(resolution) {
    this.resolution = resolution;
    this.vTouchStart = new THREE.Vector2();
    this.vPrev = new THREE.Vector2();
    this.v = new THREE.Vector2();
    this.a = new THREE.Vector2();
    this.anchor = new THREE.Vector2();
    this.isTouched = false;
  }
  touchStart(e) {
    // If be using PC, event.preventDefault runs at first.
    if (!e.touches) e.preventDefault();

    this.vPrev.copy(this.v);
    this.a.set(0, 0);
    this.vTouchStart.set(
      (e.touches) ? e.touches[0].clientX : e.clientX,
      (e.touches) ? e.touches[0].clientY : e.clientY
    );
    this.isTouched = true;
  }
  touchMove(e) {
    // If be using Mobile, event.preventDefault runs when start to drag.
    if (e.touches) e.preventDefault();

    const x = (e.touches) ? e.touches[0].clientX : e.clientX;
    const y = (e.touches) ? e.touches[0].clientY : e.clientY;

    if (this.isTouched === false) return;

    this.anchor.set(
      (x - this.vTouchStart.x) / (this.resolution.x / 200) + this.vPrev.x,
      MathEx.clamp((y - this.vTouchStart.y) / (this.resolution.y / 200) + this.vPrev.y, -90, 90)
    );
  }
  touchEnd(e) {
    this.isTouched = false;
  }
  update() {
    this.a.set(
      (this.anchor.x - this.v.x) / 10,
      (this.anchor.y - this.v.y) / 10
    );
    this.v.add(this.a);
  }
}
