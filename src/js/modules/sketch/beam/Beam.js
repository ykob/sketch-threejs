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
    this.instances = 500;
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(1, 1000, 1, 2, 128);

    // Add common attributes
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Add common attributes
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3, 1);
    const rotate = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    const delay = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1, 1);
    for ( var i = 0, ul = this.instances; i < ul; i++ ) {
      instancePosition.setXYZ(
        i,
        ((Math.random() + Math.random() + Math.random()) / 3 * 2 - 1) * 300,
        0,
        ((Math.random() + Math.random() + Math.random()) / 3 * 2 - 1) * 150,
      );
      rotate.setXYZ(i, (MathEx.randomInt(0, 1) * 2 - 1) * 90 + (Math.random(0, 1) * 2 - 1) * 60);
      delay.setXYZ(i, Math.random() * 2.0);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('rotate', rotate);
    geometry.addAttribute('delay', delay);

    // Create Object3D
    this.obj = new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/beam/beam.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/beam/beam.fs'),
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      })
    );
    // this.obj.rotation.set(0, 0, MathEx.radians(90));
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
