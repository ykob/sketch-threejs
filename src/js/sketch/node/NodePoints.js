import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/NodePoints.vs';
import fs from './glsl/NodePoints.fs';

export default class NodePoints extends THREE.Points {
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
