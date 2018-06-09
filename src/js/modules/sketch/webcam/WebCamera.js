export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.videoResolution = {
      x: 0,
      y: 0
    };
    this.facingMode = null;
  }
  init() {
    const arg = {
      audio: false,
      video: {
        facingMode: `user`, // environment or user
      }
    }
    if (navigator.mediaDevices) {
      const p = navigator.mediaDevices.getUserMedia(arg);
      this.facingMode = arg.video.facingMode;
      p.then((stream) => {
        // get video resolution.
        const getVideoResolution = () => {
          setTimeout( () => {
            this.videoResolution.x = this.video.videoWidth;
            this.videoResolution.y = this.video.videoHeight;
          }, 500);
          this.video.removeEventListener("playing", getVideoResolution);
        };
        this.video.addEventListener("playing", getVideoResolution);

        // get video stream, and set attributes to video object to play auto on iOS.
        this.video.srcObject = stream;
        this.video.setAttribute("playsinline", true);
        this.video.setAttribute("controls", true);

        // play video.
        this.video.play();
      }).catch((error) => {
        window.alert("It wasn't allowed to use WebCam.");
      });
    }
  }
}
