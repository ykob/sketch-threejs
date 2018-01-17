const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class FlameCore {
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
    const geometry = new THREE.OctahedronBufferGeometry(450, 3);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/flame/flameCore.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/flame/flameCore.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
