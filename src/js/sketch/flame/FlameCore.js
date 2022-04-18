const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class FlameCore {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.OctahedronGeometry(450, 10);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/flameCore.vs').default,
      fragmentShader: require('./glsl/flameCore.fs').default,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
