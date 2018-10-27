const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Wave {
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
    const geometry = new THREE.PlaneBufferGeometry(70, 70, 512, 512);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/wave.vs'),
      fragmentShader: require('./glsl/wave.fs'),
      transparent: true,
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.rotation.set(
      MathEx.radians(-90),
      0,
      0
    );
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
