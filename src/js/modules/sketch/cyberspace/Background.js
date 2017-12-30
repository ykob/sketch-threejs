const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Background {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture: {
        type: 't',
        value: null
      },
    };
    this.obj = null;
  }
  createObj(texture) {
    // Define Geometry
    const geometry = new THREE.SphereBufferGeometry(1600, 64, 64);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/background.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/background.fs'),
      side: THREE.BackSide,
    });
    this.uniforms.texture.value = texture;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
