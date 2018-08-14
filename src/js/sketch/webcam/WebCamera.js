require("babel-polyfill");

export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.facingMode = null;
    this.resolution = {
      x: 0,
      y: 0
    };
  }
  async init(arg) {
    if (!navigator.mediaDevices) return;

    this.facingMode = arg.video.facingMode;

    await navigator.mediaDevices.getUserMedia(arg)
      .then((stream) => {
        // get video stream, and set attributes to video object to play auto on iOS.
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", true);
        this.video.setAttribute("controls", true);

        // play video.
        this.video.play();

        // get video resolution with promise.
        return new Promise((resolve, reject) => {
          setTimeout( () => {
            this.resolution.x = this.video.videoWidth;
            this.resolution.y = this.video.videoHeight;
            resolve();
          }, 1000);
        });
      })
      .catch((error) => {
        window.alert("It wasn't allowed to use WebCam.");
      });
  }
}
