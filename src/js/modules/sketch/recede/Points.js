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
      tex: {
        type: 't',
        value: null
      },
    };
    this.obj = null;
  }
  createObj(tex) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(800, 800, 200, 200);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/recede/points.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/recede/points.fs'),
      transparent: true,
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
