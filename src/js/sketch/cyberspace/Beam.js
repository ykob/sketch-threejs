const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Beam {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.instances = 2000;
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(100, 4000, 2, 2, 2);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Add instance attributes
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3);
    const delay = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
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
    geometry.setAttribute('instancePosition', instancePosition);
    geometry.setAttribute('delay', delay);
    geometry.setAttribute('h', h);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/beam.vs').default,
      fragmentShader: require('./glsl/beam.fs').default,
      depthWrite: false,
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.InstancedMesh(geometry, material, this.instances);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
