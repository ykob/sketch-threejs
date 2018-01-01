const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Bg {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.isShown = false;
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.SphereBufferGeometry(10000, 32, 32);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/bg.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/bg.fs'),
      side: THREE.BackSide,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
