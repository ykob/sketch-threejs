const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

import force3 from '../../common/force3';

export default class Wire {
  constructor(instances) {
    this.size = 100;
    this.baseGeometry = new THREE.CylinderBufferGeometry(
      this.size / 2, this.size / 2, this.size * 2.5, 5
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
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
    }
    geometry.addAttribute('radian', radian);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/wire.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/wire.fs'),
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        shading: THREE.FlatShading
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
