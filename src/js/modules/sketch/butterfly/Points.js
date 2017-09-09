const glslify = require('glslify');
const SIZE = 100;

export default class Points {
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.uniforms = {
    }
    this.obj = this.createObj();
  }
  createObj() {
    const attrPosition = new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3);
    const attrColor = new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3);
    this.geometry.addAttribute('position', attrPosition);
    this.geometry.addAttribute('color', attrPosition);
    return new THREE.Points(
      this.geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/points.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/points.fs'),
        transparent: true,
        depthWrite: false,
      })
    );
  }
  render(renderer, time) {
    this.physicsRenderer.render(renderer, time);
    this.uniforms.time.value += time;
  }
}
