const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

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
      force: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj(webcam) {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(50, 50, 2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/plane.vs').default,
      fragmentShader: require('./glsl/plane.fs').default,
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
  render(time, force) {
    const scale = force * 0.008 + 1;
    this.uniforms.force.value = force;
    this.uniforms.time.value += time * (force * 1.2);
    this.obj.scale.set(scale, scale, scale);
  }
}
