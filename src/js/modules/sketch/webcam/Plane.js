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
    };
    this.obj = null;
  }
  createObj(webcam) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1400, 1400, 2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/webcam/plane.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/webcam/plane.fs'),
      transparent: true,
    });

    const videoTex = new THREE.VideoTexture(webcam.video);
    videoTex.minFilter = THREE.LinearFilter;
    videoTex.magFilter = THREE.LinearFilter;
    videoTex.format = THREE.RGBFormat;

    this.uniforms.texVideo.value = videoTex;
    this.uniforms.facing.value = (webcam.facingMode === 'user') ? 1 : 0;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
