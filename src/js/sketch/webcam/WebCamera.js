const THREE = require('three');
const { sleep } = require('@ykob/js-util');

export default class WebCamera {
  constructor() {
    this.video = document.createElement('video');
    this.facingMode = undefined;
    this.resolution = {
      x: 0,
      y: 0
    };
    this.mouth = [
      new THREE.Vector2(),
      new THREE.Vector2(),
      new THREE.Vector2(),
      new THREE.Vector2(),
    ];
    this.force = {
      a: 0,
      v: 1,
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
  render(landmarks, score) {
    let open = 0;

    if (score >= 0.3 && landmarks !== false) {
      this.mouth[0].set(landmarks[47][0], landmarks[47][1]);
      this.mouth[1].set(landmarks[60][0], landmarks[60][1]);
      this.mouth[2].set(landmarks[57][0], landmarks[57][1]);
      this.mouth[3].set(landmarks[53][0], landmarks[53][1]);

      const d1 = this.mouth[0].distanceTo(this.mouth[1]);
      const d2 = this.mouth[1].distanceTo(this.mouth[2]);
      const d3 = this.mouth[2].distanceTo(this.mouth[3]);
      open = Math.max((d2 / (d1 + d3)) - 1, 0);
    }

    const hook = (1 - this.force.v) * 0.01;
    const drag = -this.force.a * 0.16;
    const force = open * 0.1;
    this.force.a += hook + drag + force;
    this.force.v = this.force.v + this.force.a;
  }
}
