import * as THREE from 'three';

export default class Hold {
  constructor() {
    this.btn = document.querySelector('.p-hold-button');
    this.progress = document.querySelector('.p-hold-button__progress-in');
    this.v = 0;
    this.a = 0;
    this.cv = new THREE.Vector2();
    this.ca = new THREE.Vector2();
    this.isHolding = false;
    this.isOvered = false;
  }
  start() {
    this.btn.classList.add('is-shown');
  }
  on() {
    window.addEventListener('mousedown', (event) => {
      event.preventDefault();
      this.isHolding = true;
    }, {
      capture: true
    });
    window.addEventListener('mouseup', (event) => {
      event.preventDefault();
      this.a = 0;
      this.isHolding = false;
    }, {
      capture: true
    });
    window.addEventListener('mouseleave', (event) => {
      event.preventDefault();
      this.a = 0;
      this.isHolding = false;
    }, {
      capture: true
    });
    this.btn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      this.btn.classList.add('is-pressed');
      this.btn.classList.remove('is-released');
      this.isHolding = true;
    }, {
      capture: true
    });
    this.btn.addEventListener('touchend', (event) => {
      event.preventDefault();
      this.a = 0;
      this.btn.classList.remove('is-pressed');
      this.btn.classList.add('is-released');
      this.isHolding = false;
    }, {
      capture: true
    });
  }
  render(time, mouse) {
    // calculate cursor velocity.
    this.ax = mouse.x;
    this.ay = mouse.y;
    const dist = Math.sqrt(Math.pow(this.ca.x - this.cv.x, 2) + Math.pow(this.ca.y - this.cv.y, 2));
    const f = dist * 0.08;
    this.cv.x += (this.ca.x - this.cv.x === 0) ? 0 : (this.ca.x - this.cv.x) / dist * f;
    this.cv.y += (this.ca.y - this.cv.y === 0) ? 0 : (this.ca.y - this.cv.y) / dist * f;
    this.btn.style = `transform: translate3d(${this.vx}px, ${this.vy}px, 0)`;

    if (this.isOvered) return;

    // calculate holding acceleration.
    if (this.isHolding === true) {
      this.a = this.a * 1.05 + 0.01 * time;
    } else {
      if (this.v > 0) this.a = this.v * -3 * time;
    }
    // add acceleration to velocity.
    this.v += this.a;
    // ceil
    if (this.v < 0) {
      this.v = 0;
      this.a = 0;
    }
    if (this.v >= 100) {
      this.v = 100;
      this.a = 0;
    }
    this.progress.style = `transform: skewX(-45deg) translateX(${50 - this.v}%);`;
  }
}
