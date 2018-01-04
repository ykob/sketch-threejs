const THREE = require('three/build/three.js');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

import force3 from '../../common/force3';

export default class Wire {
  constructor(instances) {
    this.size = 120;
    this.baseGeometry = new THREE.BoxBufferGeometry(
      this.size, this.size, this.size
    );
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
    geometry.addAttribute('position', this.baseGeometry.attributes.position);
    geometry.setIndex(this.baseGeometry.index);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const hsv = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const timeHover = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      hsv.setXYZ(i, i / this.instances - 0.25, 0.2, 1.0);
      timeHover.setXYZ(i, 0);
    }
    geometry.addAttribute('radian', radian);
    geometry.addAttribute('hsv', hsv);
    geometry.addAttribute('timeHover', timeHover);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/wire.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wire.fs'),
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        flatShading: true
      })
    );
  }
  createObjPicked() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    geometry.addAttribute('position', this.baseGeometry.attributes.position);
    geometry.setIndex(this.baseGeometry.index);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const pickedColor = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const color = new THREE.Color();
    const timeHover = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      color.setHex(i);
      pickedColor.setXYZ(i, color.r, color.g, color.b);
      timeHover.setXYZ(i, 0);
    }
    geometry.addAttribute('radian', radian);
    geometry.addAttribute('pickedColor', pickedColor);
    geometry.addAttribute('timeHover', timeHover);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/wirePicked.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wirePicked.fs'),
      })
    );
  }
  render(time) {
    const timeHoverAttribute = this.obj.geometry.attributes.timeHover;
    const timeHoverAttributePicked = this.objPicked.geometry.attributes.timeHover;
    this.uniforms.time.value += time;
    for (var i = 0; i < timeHoverAttribute.array.length; i++) {
      if (this.uniforms.pickedId.value == i) {
        timeHoverAttribute.array[i] = Math.min(timeHoverAttribute.array[i] + time, 0.3);
        timeHoverAttributePicked.array[i] = Math.min(timeHoverAttributePicked.array[i] + time, 0.3);
      } else {
        timeHoverAttribute.array[i] = Math.max(timeHoverAttribute.array[i] - time, 0);
        timeHoverAttributePicked.array[i] = Math.max(timeHoverAttributePicked.array[i] - time, 0);
      }
    }
    timeHoverAttribute.needsUpdate = true;
    timeHoverAttributePicked.needsUpdate = true;
  }
}
