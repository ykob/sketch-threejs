import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class DnaHelix {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 6000;
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(this.num * 3), 3);
    const baRadians = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    const baRadiuses = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    const baDelays = new THREE.BufferAttribute(new Float32Array(this.num), 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const random = Math.random();
      const diff = {
        x: (Math.random() * 2 - 1) * random * 6,
        y: (Math.random() * 2 - 1) * random * 6,
        z: (Math.random() * 2 - 1) * random * 6,
      };
      baPositions.setXYZ(
        i,
        ((i / this.num) * 2 - 1) * 150 + diff.x,
        diff.y,
        diff.z
      );
      baRadians.setX(i, MathEx.radians(i / this.num * 900 + i % 2 * 180));
      baRadiuses.setX(i, 18);
      baDelays.setX(i, MathEx.radians(Math.random() * 360));
    }
    geometry.addAttribute('position', baPositions);
    geometry.addAttribute('radian', baRadians);
    geometry.addAttribute('radius', baRadiuses);
    geometry.addAttribute('delay', baDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/DnaHelix.vs'),
      fragmentShader: require('./glsl/DnaHelix.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
    this.obj.name = 'DNA Herix';
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
