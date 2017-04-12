const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Debris {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      cubeTex: {
        type: 't',
        value: null
      }
    };
    this.instances = 1000;
    this.obj = null;
  }
  init(texture) {
    this.uniforms.cubeTex.value = texture;
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(10, 10, 10);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.setIndex(baseGeometry.index);
    const translate = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
      const polar = MathEx.polar(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 3000 + 100);
      translate.setXYZ(i, polar[0], polar[1], polar[2]);
      offsets.setXYZ(i, Math.random() * 100);
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
        transparent: true,
        side: THREE.DoubleSide
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
