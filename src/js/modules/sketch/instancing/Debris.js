const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Debris {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.instances = 500;
    this.obj = this.createObj();
  }
  createObj(renderer) {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(40, 40, 40);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.setIndex(baseGeometry.index);
    const translate = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
      const polar = MathEx.polar(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 200 + 500);
      translate.setXYZ(i, polar[0], polar[1], polar[2]);
      offsets.setXYZ(i, Math.random() * 40 - 20);
      rotates.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    geometry.addAttribute('translate', translate);
    geometry.addAttribute('offset', offsets);
    geometry.addAttribute('rotate', rotates);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/instancing/debris.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/instancing/debris.fs'),
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
