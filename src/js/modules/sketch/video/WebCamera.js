export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('canvas2d');
    this.w = 0;
    this.h = 0;
  }
  init(arg) {
    if (navigator.mediaDevices) {
      const p = navigator.mediaDevices.getUserMedia(arg);
      p.then((stream) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (e) => {
          document.body.append(this.video);
          this.video.play();
        }
      })
    } else {
    }
  }
}
