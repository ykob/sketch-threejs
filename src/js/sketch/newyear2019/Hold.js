import * as THREE from 'three';

const page = document.querySelector('.l-page');

export default class Hold {
  constructor(os) {
    this.os = os;
    this.btn = document.querySelector('.p-hold-button');
    this.progress = document.querySelector('.p-hold-button__progress-in');
    this.v = 0;
    this.a = 0;
    this.cv = new THREE.Vector2();
    this.ca = new THREE.Vector2();
    this.isHolding = false;
    this.isOvered = false;
    this.isEnabled = false;
  }
  start(resolution) {
    this.isEnabled = true;
    if (this.os === 'iOS' || this.os === 'Android') {
      this.btn.classList.add('is-enabled', 'is-shown', 'is-smartphone');
    } else {
      this.cv.set(resolution.x / 2, resolution.y);
      this.btn.classList.add('is-pc');
    }
  }
  on(canvas, mouse) {
    if (this.os === 'iOS' || this.os === 'Android') {
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
    } else {
      canvas.addEventListener('mousedown', (event) => {
        event.preventDefault();
        canvas.style = 'cursor: grabbing;';
        this.btn.classList.add('is-pressed');
        this.btn.classList.remove('is-released');
        this.isHolding = true;
      }, {
        capture: true
      });
      window.addEventListener('mousemove', (event) => {
        if (this.isHolding === false) canvas.style = 'cursor: grab;';
        mouse.set(event.clientX, event.clientY);
      });
      window.addEventListener('mouseup', (event) => {
        event.preventDefault();
        this.a = 0;
        this.btn.classList.remove('is-pressed');
        this.btn.classList.add('is-released');
        this.isHolding = false;
      }, {
        capture: true
      });
      canvas.addEventListener('mouseenter', () => {
        this.btn.classList.add('is-shown');
        this.btn.classList.remove('is-hidden');
      });
      page.addEventListener('mouseleave', () => {
        this.a = 0;
        this.btn.classList.remove('is-shown', 'is-pressed', 'is-released');
        this.btn.classList.add('is-hidden');
        this.isHolding = false;
      });
    }
  }
  async render(time, mouse) {
    if (this.isEnabled === false) return;

    // calculate cursor velocity.
    const sub = mouse.clone().sub(this.cv);
    this.ca.add(sub.divideScalar(12));
    const drag = this.ca.clone().multiplyScalar(-1).normalize().multiplyScalar(this.ca.length() * 0.28);
    this.ca.add(drag);
    this.cv.add(this.ca);
    this.btn.style = `transform: translate3d(${this.cv.x + 8}px, ${this.cv.y + 8}px, 0)`;

    if (this.isOvered === true) {
      return false
    }

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

    if (this.v === 100) {
      this.isOvered = true;
      return true;
    } else {
      return false;
    }
  }
}
