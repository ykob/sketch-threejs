export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('canvas2d');
    this.w = 0;
    this.h = 0;
    this.isValid = false;
  }
  validate() {
    this.isValid = true;
  }
  play() {

  }
  resize(w, h) {
    this.w = this.video.width = this.canvas.width = w;
    this.h = this.video.height = this.canvas.height = h;
  }
}
