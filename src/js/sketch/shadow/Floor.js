import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Floor.vs';
import fs from './glsl/Floor.fs';

export default class Floor extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(30, 30);

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
    this.name = 'Floor';
    this.rotation.set(MathEx.radians(-90), 0, 0);
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
