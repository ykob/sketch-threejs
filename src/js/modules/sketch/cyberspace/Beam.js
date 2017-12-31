const THREE = require('three/build/three.js');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Beam {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.instances = 800;
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(100, 2000, 2, 2, 2);

    // Add common attributes
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Add instance attributes
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const delay = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for ( var i = 0, ul = this.instances; i < ul; i++ ) {
      instancePosition.setXYZ(
        i,
        MathEx.randomArbitrary(-2500, 2500),
        0,
        MathEx.randomArbitrary(-400, 400) + (MathEx.randomInt(0, 1) * 2 - 1) * 600,
      );
      delay.setXYZ(i, Math.random() * 2.0);
      h.setXYZ(i, Math.random() * 0.4);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('delay', delay);
    geometry.addAttribute('h', h);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/beam.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/beam.fs'),
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
