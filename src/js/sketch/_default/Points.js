import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/points.vs';
import fs from './glsl/points.fs';

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const num = 1000;
    const baPositions = new THREE.BufferAttribute(new Float32Array(num * 3), 3);
    for (var i = 0, ul = num; i < ul; i++) {
      baPositions.setXYZ(i, 0, 0, 0);
    }
    geometry.addAttribute('position', baPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Points';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
