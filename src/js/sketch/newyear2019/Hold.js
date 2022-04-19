import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

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
    this.timeOver = 0;
    this.state = 0;
    this.isHolding = false;
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
        if (this.state !== 0) return;
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
        if (this.state !== 0) return;
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
    if (this.os !== 'iOS' && this.os !== 'Android') {
      const sub = mouse.clone().sub(this.cv);
      this.ca.add(sub.divideScalar(12));
      const drag = this.ca.clone().multiplyScalar(-1).normalize().multiplyScalar(this.ca.length() * 0.28);
      this.ca.add(drag);
      this.cv.add(this.ca);
      this.btn.style = `transform: translate3d(${this.cv.x + 8}px, ${this.cv.y + 8}px, 0)`;
    }

    // calculate holding acceleration.
    if (this.state === 0 || this.state === 2) {
      if (this.isHolding === true) {
        this.a = (this.v * 1.4 + 1) * time;
      } else {
        this.a = this.v * -3 * time;
      }
      // add acceleration to velocity.
      this.v += this.a;
      // ceil
      this.v = MathEx.clamp(this.v, 0, 100);
      // update the progress cursor style.
      this.progress.style = `transform: skewX(-45deg) translateX(${50 - this.v}%);`;
    }

    switch (this.state) {
      case 0:
        if (this.v < 100) {
          // Hold is not over.
          return 0;
        } else {
          // Hold is over now.
          this.state = 1;
          this.a = 0;
          this.btn.classList.remove('is-pressed');
          this.btn.classList.add('is-released');
          this.isHolding = false;
          return 1;
        }
      case 1:
        this.timeOver += time;
        if (this.timeOver < 5) {
          // Hold is over.
          return 2;
        } else {
          // Hold cooldowned now.
          this.timeOver = 0;
          this.state = 2;
          return 3;
        }
      case 2:
        if (this.v > 0.5) {
          // Hold cooldowned.
          return 4;
        } else {
          // Return to the first state.
          this.state = 0;
          this.v = 0;
          this.a = 0;
          return 5;
        }
      default:
    }
  }
}
