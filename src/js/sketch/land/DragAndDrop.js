const THREE = require('three');

export default class DragAndDrop {
  constructor() {
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
    const x = (e.touches) ? e.touches[0].clientX : e.clientX;
    const y = (e.touches) ? e.touches[0].clientY : e.clientY;

    if (this.isTouched === false) return;

    this.anchor.set(
      (x - this.vTouchStart.x) / 10 + this.vPrev.x,
      (y - this.vTouchStart.y) / 10 + this.vPrev.y
    );

    // If be using Mobile, event.preventDefault runs when start to drag.
    if (e.touches) e.preventDefault();
  }
  touchEnd(e) {
    this.isTouched = false;
    this.isDraging = false;
  }
  render() {
    this.a.set(
      (this.anchor.x - this.v.x) / 10,
      (this.anchor.y - this.v.y) / 10
    );
    this.v.add(this.a);
  }
}
