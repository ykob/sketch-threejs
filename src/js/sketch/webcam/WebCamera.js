const sleep = require('js-util/sleep');

export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.facingMode = undefined;
    this.resolution = {
      x: 0,
      y: 0
    };
  }
  async init() {
    if (!navigator.mediaDevices) return;

    this.facingMode = `user`;  // environment or user
    await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: this.facingMode,
        }
      })
      .then((stream) => {
        this.video.srcObject = stream;
      })
      .catch((error) => {
        window.alert("It wasn't allowed to use WebCam.");
      });

    // get video stream, and set attributes to video object to play auto on iOS.
    this.video.setAttribute("playsinline", true);
    this.video.setAttribute("controls", true);

    // play video.
    this.video.play();

    // get video resolution with promise.
    await sleep(1000);
    this.resolution.x = this.video.width = this.video.videoWidth;
    this.resolution.y = this.video.height = this.video.videoHeight;

    return;
  }
}
