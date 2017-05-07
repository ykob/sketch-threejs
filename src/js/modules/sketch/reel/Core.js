const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Core {
  constructor(instances) {
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
    this.instances = instances;
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    const baseGeometry = new THREE.OctahedronBufferGeometry(30, 4);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.setIndex(baseGeometry.index);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const hsv = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const noiseDiff = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const speed = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      hsv.setXYZ(i, i / this.instances, 0.2, 0.9);
      noiseDiff.setXYZ(i, Math.random());
      speed.setXYZ(i, (Math.random() + 1.0) * 0.5);
    }
    geometry.addAttribute('radian', radian);
    geometry.addAttribute('hsv', hsv);
    geometry.addAttribute('noiseDiff', noiseDiff);
    geometry.addAttribute('speed', speed);

    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/core.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/core.fs'),
        transparent: true,
      })
    )
  }
}
