const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Water {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH: {
        type: 'f',
        value: Math.random()
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(500, 500, 60, 60);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/land/water.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/land/water.fs'),
      flatShading: true,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.translateY(50);
    this.obj.rotation.set(MathEx.radians(-90), 0, 0);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
