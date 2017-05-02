const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class WireBox {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    }
    this.instances = 36;
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    const radius = 100;
    const position = new THREE.BufferAttribute(new Float32Array([
       1 * radius / 2,  1 * radius / 2, -1 * radius / 2,
      -1 * radius / 2,  1 * radius / 2, -1 * radius / 2,
       1 * radius / 2,  1 * radius / 2,  1 * radius / 2,
      -1 * radius / 2,  1 * radius / 2,  1 * radius / 2,
       1 * radius / 2, -1 * radius / 2, -1 * radius / 2,
      -1 * radius / 2, -1 * radius / 2, -1 * radius / 2,
       1 * radius / 2, -1 * radius / 2,  1 * radius / 2,
      -1 * radius / 2, -1 * radius / 2,  1 * radius / 2
    ]), 3);
    const indecies = new THREE.BufferAttribute(new Uint16Array([
       0, 1, 0, 2, 1, 3, 2, 3,
       0, 4, 1, 5, 2, 6, 3, 7,
       4, 5, 4, 6, 5, 7, 6, 7
    ]), 1);
    geometry.addAttribute('position', position);
    geometry.setIndex(indecies);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
    }
    geometry.addAttribute('radian', radian);

    return new THREE.LineSegments(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/wireBox.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wireBox.fs'),
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
