const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

import force3 from '../../common/force3';

export default class Wire {
  constructor(instances) {
    this.side = 100;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      rotate: {
        type: 'f',
        value: 0
      },
      pickedId: {
        type: 'f',
        value: -1
      }
    }
    this.instances = instances;
    this.obj = this.createObj();
    this.objPicked = this.createObjPicked();
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    const position = new THREE.BufferAttribute(new Float32Array([
       1 * this.side / 2,  1 * this.side / 2, -1 * this.side / 2,
      -1 * this.side / 2,  1 * this.side / 2, -1 * this.side / 2,
       1 * this.side / 2,  1 * this.side / 2,  1 * this.side / 2,
      -1 * this.side / 2,  1 * this.side / 2,  1 * this.side / 2,
       1 * this.side / 2, -1 * this.side / 2, -1 * this.side / 2,
      -1 * this.side / 2, -1 * this.side / 2, -1 * this.side / 2,
       1 * this.side / 2, -1 * this.side / 2,  1 * this.side / 2,
      -1 * this.side / 2, -1 * this.side / 2,  1 * this.side / 2
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
        vertexShader: glslify('../../../../glsl/sketch/reel/wire.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wire.fs'),
        transparent: true
      })
    );
  }
  createObjPicked() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    const baseGeometry = new THREE.BoxBufferGeometry(this.side, this.side, this.side);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.setIndex(baseGeometry.index);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const pickedColor = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const color = new THREE.Color();
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      color.setHex(i);
      pickedColor.setXYZ(i, color.r, color.g, color.b);
    }
    geometry.addAttribute('radian', radian);
    geometry.addAttribute('pickedColor', pickedColor);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/wirePicked.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wirePicked.fs'),
      })
    );
  }
}
