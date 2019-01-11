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
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const numHelix = 6000;
    const numLineSpace = 60;
    const numLine = 100;
    const numAmount = numHelix + numLineSpace * numLine;
    const baPositions = new THREE.BufferAttribute(new Float32Array(numAmount * 3), 3);
    const baRadians = new THREE.BufferAttribute(new Float32Array(numAmount), 1);
    const baRadiuses = new THREE.BufferAttribute(new Float32Array(numAmount), 1);
    const baDelays = new THREE.BufferAttribute(new Float32Array(numAmount), 1);
    for (var i = 0; i < numHelix; i++) {
      const random = Math.random();
      const diff = {
        x: (Math.random() * 2 - 1) * random * 6,
        y: (Math.random() * 2 - 1) * random * 6,
        z: (Math.random() * 2 - 1) * random * 6,
      };
      baPositions.setXYZ(
        i,
        ((i / numHelix) * 2 - 1) * 150 + diff.x,
        diff.y,
        diff.z
      );
      baRadians.setX(i, MathEx.radians(i / numHelix * 900 + i % 2 * 180));
      baRadiuses.setX(i, 18);
      baDelays.setX(i, MathEx.radians(Math.random() * 360));
    }
    for (var j = 0; j < numLineSpace; j++) {
      const radians = MathEx.radians(j / numLineSpace * 900);
      for (var k = 0; k < numLine; k++) {
        const index = j * numLine + k + numHelix;
        const random = Math.random();
        const diff = {
          x: (Math.random() * 2 - 1) * random * 1,
          y: (Math.random() * 2 - 1) * random * 1,
          z: (Math.random() * 2 - 1) * random * 1,
        };
        baPositions.setXYZ(
          index,
          ((j / numLineSpace) * 2 - 1) * 150 + diff.x,
          diff.y,
          diff.z
        );
        baRadians.setX(index, radians);
        baRadiuses.setX(index, (k / numLine * 2 - 1) * 18);
        baDelays.setX(index, MathEx.radians(Math.random() * 360));
      }
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
