export default class Hold {
  constructor() {
    this.btn = document.querySelector('.p-hold-button');
    this.progress = document.querySelector('.p-hold-button__progress-in');
    this.v = 0;
    this.a = 0;
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
  render(time) {
    if (this.isOvered) return;
    // calculate acceleration.
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
