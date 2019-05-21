import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/NodeLine.vs';
import fs from './glsl/NodeLine.fs';

export default class NodeLine extends THREE.Line {
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
    this.name = 'NodeLine';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
