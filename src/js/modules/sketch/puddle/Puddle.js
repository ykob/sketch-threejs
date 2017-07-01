const glslify = require('glslify');

export default class Puddle {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.obj = this.createObj();
    this.obj.visible = false;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1500, 1500),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/puddle/puddle.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/puddle/puddle.fs'),
        transparent: true
      })
    )
  }
  show(position) {
    this.uniforms.time.value = 0;
    this.obj.visible = true;
    this.obj.position.set(
      (Math.random()* 2 - 1) * 1000,
      (Math.random()* 2 - 1) * 1000,
      0.0
    );
  }
  render(time) {
    if (!this.obj.visible) return;
    this.uniforms.time.value += time;
    this.obj.position.z -= 1;
  }
}
