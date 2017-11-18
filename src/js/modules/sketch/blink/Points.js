const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class Points {
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
    const geometry = new THREE.BufferGeometry();
    const position = [];
    const SIDE = 60;
    const LENGTH = 80;
    for (var z = 0; z < SIDE; z++) {
      for (var y = 0; y < SIDE; y++) {
        for (var x = 0; x < SIDE; x++) {
          position.push(
            ((x / SIDE) * 2 - 1) * LENGTH + (Math.random() * 2.0 - 1.0) * 4.0,
            ((y / SIDE) * 2 - 1) * LENGTH + (Math.random() * 2.0 - 1.0) * 4.0,
            ((z / SIDE) * 2 - 1) * LENGTH + (Math.random() * 2.0 - 1.0) * 4.0
          )
        }
      }
    }
    const attrPosition = new THREE.BufferAttribute(new Float32Array(position), 3);
    geometry.addAttribute('position', attrPosition);
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/blink/points.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/blink/points.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
    return new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
    this.obj.rotation.set(
      this.uniforms.time.value * 0.01,
      this.uniforms.time.value * 0.02,
      this.uniforms.time.value * 0.01
    )
  }
}
