import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/crystalSparkle.vs';
import fs from './glsl/crystalSparkle.fs';

export default class CrystalSparkle extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

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
