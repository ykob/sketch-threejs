const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Plane {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texVideo: {
        type: 't',
        value: null
      },
      facing: {
        type: 'f',
        value: 0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
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
    this.obj = null;
  }
  createObj(webcam) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(50, 50, 2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/plane.vs'),
      fragmentShader: glslify('./glsl/plane.fs'),
      transparent: true,
    });

    const videoTex = new THREE.VideoTexture(webcam.video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;
    videoTex.format = THREE.RGBFormat;

    this.uniforms.texVideo.value = videoTex;
    this.uniforms.facing.value = (webcam.facingMode === 'user') ? 1 : 0;
    this.uniforms.resolution.value.set(
      webcam.resolution.x,
      webcam.resolution.y
    );

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  resize(webcam) {
    this.uniforms.resolution.value.set(
      webcam.resolution.x,
      webcam.resolution.y
    );
  }
  render(time, cTracker) {
    const landmarks = cTracker.getCurrentPosition();
    let open = 0;

    if (cTracker.getScore() >= 0.4 && landmarks !== false) {
      this.mouth[0].set(landmarks[47][0], landmarks[47][1]);
      this.mouth[1].set(landmarks[60][0], landmarks[60][1]);
      this.mouth[2].set(landmarks[57][0], landmarks[57][1]);
      this.mouth[3].set(landmarks[53][0], landmarks[53][1]);

      const d1 = this.mouth[0].distanceTo(this.mouth[1]);
      const d2 = this.mouth[1].distanceTo(this.mouth[2]);
      const d3 = this.mouth[2].distanceTo(this.mouth[3]);
      open = Math.max((d2 / (d1 + d3)) - 1, 0);
    }

    const hook = (1 - this.force.v) * 0.2;
    const drag = -this.force.a * 0.6;
    const force = open * 0.8;
    this.force.a += hook + drag + force;
    this.force.v = this.force.v + this.force.a;

    this.uniforms.time.value += time * (this.force.v * 2);
  }
}
