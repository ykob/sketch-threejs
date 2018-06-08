export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.facingMode = null;
  }
  init(arg) {
    if (navigator.mediaDevices) {
      const p = navigator.mediaDevices.getUserMedia(arg);
      this.facingMode = arg.video.facingMode;
      p.then((stream) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = (e) => {
          this.video.play();
        }
      }).catch((error) => {
        window.alert("It wasn't allowed to use WebCam.");
      });
    }
  }
}
