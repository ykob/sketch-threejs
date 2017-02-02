const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class SkyOctahedron {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = this.createObj();
    this.obj.position.set(0, 300, 0);
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.OctahedronBufferGeometry(128, 3),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../glsl/index/skyOctahedron.vs'),
        fragmentShader: glslify('../../../glsl/index/skyOctahedron.fs'),
        transparent: true,
        wireframe: true
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
