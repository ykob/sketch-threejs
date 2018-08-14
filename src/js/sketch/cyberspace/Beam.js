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
    this.instances = 2000;
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(100, 4000, 2, 2, 2);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Add instance attributes
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const delay = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for ( var i = 0, ul = this.instances; i < ul; i++ ) {
      instancePosition.setXYZ(
        i,
        MathEx.randomArbitrary(-5000, 5000),
        0,
        MathEx.randomArbitrary(-500, 500) + (MathEx.randomInt(0, 1) * 2 - 1) * 700,
      );
      delay.setXYZ(i, Math.random() * 2.0);
      h.setXYZ(i, Math.random() * 0.3);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('delay', delay);
    geometry.addAttribute('h', h);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/beam.vs'),
      fragmentShader: glslify('./glsl/beam.fs'),
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
