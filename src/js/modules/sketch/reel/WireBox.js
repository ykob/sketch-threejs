const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

import force3 from '../../common/force3';

export default class WireBox {
  constructor() {
    this.velocity = [0, 0, 0];
    this.acceleration = [0, 0, 0];
    this.anchor = [0, 0, 0];
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      rotate: {
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
  updateRotation() {
    force3.applyHook(this.velocity, this.acceleration, this.anchor, 0, 0.04);
    force3.applyDrag(this.acceleration, 0.3);
    force3.updateVelocity(this.velocity, this.acceleration, 1);
    this.uniforms.rotate.value = this.velocity[0];
  }
  rotate(delta) {
    if (!delta) return;
    this.anchor[0] -= delta / Math.abs(delta) * 2;
  }
  render(time) {
    this.uniforms.time.value += time;
    this.updateRotation();
  }
}
