const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Points {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000, 50, 50);
    console.log(geometry)

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/recede/points.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/recede/points.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
