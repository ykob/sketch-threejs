const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class BlazeStone {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 2000;
    this.obj = null;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(20, 500, 100);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const scales = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const speeds = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const radian = MathEx.radians(MathEx.randomArbitrary(0, 360));
      const radius = MathEx.randomArbitrary(1000, 2500);
      const scale = Math.pow((2500 - radius) / 1500, 2.0) + 0.1;
      const speed = MathEx.randomArbitrary(0.01, 0.6);
      instancePositions.setXYZ(
        i,
        radius,
        MathEx.randomArbitrary(-4000, 200),
        0,
      );
      scales.setXYZ(i, scale);
      rotates.setXYZ(i, i);
      speeds.setXYZ(i, speed);
    }
    geometry.addAttribute('instancePosition', instancePositions);
    geometry.addAttribute('scale', scales);
    geometry.addAttribute('rotate', rotates);
    geometry.addAttribute('speed', speeds);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/blaze/blazeStone.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/blaze/blazeStone.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
