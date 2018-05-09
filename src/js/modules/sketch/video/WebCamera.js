export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('canvas2d');
    this.w = 0;
    this.h = 0;
  }
  init() {
    if (navigator.mediaDevices) {
      const p = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      p.then((stream) => {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.onloadedmetadata = (e) => {
          document.body.append(this.video);
          this.video.play();
        }
      })
    } else {

    }
  }
}
