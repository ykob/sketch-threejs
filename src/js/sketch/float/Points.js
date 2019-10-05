import * as THREE from 'three';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

const SIDE_NUM = 20;

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(Math.pow(SIDE_NUM, 3) * 3), 3);
    for (var i = 0; i <= SIDE_NUM; i++) {
      for (var j = 0; j <= SIDE_NUM; j++) {
        for (var k = 0; k <= SIDE_NUM; k++) {
          baPositions.setXYZ(
            i * SIDE_NUM * SIDE_NUM + j * SIDE_NUM + k,
            (i / SIDE_NUM * 2 - 1) * 4,
            (j / SIDE_NUM * 2 - 1) * 4,
            (k / SIDE_NUM * 2 - 1) * 4
          );
        }
      }
    }
    geometry.addAttribute('position', baPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
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
