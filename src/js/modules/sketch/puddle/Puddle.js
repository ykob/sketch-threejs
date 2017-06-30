const glslify = require('glslify');

export default class Puddle {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/puddle/puddle.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/puddle/puddle.fs'),
        transparent: true
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
