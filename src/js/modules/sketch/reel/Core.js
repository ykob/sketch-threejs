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
    const baseGeometry = new THREE.OctahedronBufferGeometry(30, 2);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.setIndex(baseGeometry.index);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const hsv = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      hsv.setXYZ(i, i / this.instances, 0.2, 0.9);
    }
    geometry.addAttribute('radian', radian);
    geometry.addAttribute('hsv', hsv);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/core.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/core.fs'),
        transparent: true
      })
    )
  }
  updateRotation() {
    force3.applyDrag(this.acceleration, 0.06);
    force3.updateVelocity(this.velocity, this.acceleration, 1);
    this.uniforms.rotate.value = this.velocity[0];
  }
  rotate(delta) {
    if (!delta) return;
    this.acceleration[0] -= delta / Math.abs(delta) * 0.1;
  }
  render(time) {
    this.uniforms.time.value += time;
    this.updateRotation();
  }
}
