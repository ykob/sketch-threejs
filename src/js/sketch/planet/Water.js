const THREE = require('three');
const MathEx = require('js-util/MathEx');

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
    const geometry = new THREE.OctahedronBufferGeometry(50, 5);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/water.vs'),
      fragmentShader: require('./glsl/water.fs'),
      flatShading: true,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
