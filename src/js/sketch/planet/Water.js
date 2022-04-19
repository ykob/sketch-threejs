const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Water {
  constructor(h) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH: {
        type: 'f',
        value: h
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.OctahedronGeometry(50, 30);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/water.vs').default,
      fragmentShader: require('./glsl/water.fs').default,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
