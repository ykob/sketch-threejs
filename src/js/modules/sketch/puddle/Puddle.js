const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class Puddle {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      colorH: {
        type: 'f',
        value: 0
      },
      noiseRange: {
        type: 'f',
        value: 0
      },
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
    this.uniforms.colorH.value = Math.random();
    this.uniforms.noiseRange.value = Math.random() * 3;
    this.obj.visible = true;
    this.obj.position.set(
      (Math.random()* 2 - 1) * window.innerWidth,
      (Math.random()* 2 - 1) * window.innerHeight,
      0.0
    );
  }
  render(time) {
    if (!this.obj.visible) return;
    this.uniforms.time.value += time;
    this.obj.position.z -= 3;
  }
}
