const glslify = require('glslify');

export default class Butterfly {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    }
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(20, 20, 2, 2);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/butterfly.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/butterfly.fs'),
        side: THREE.DoubleSide
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
