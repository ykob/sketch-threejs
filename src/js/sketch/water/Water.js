import * as THREE from 'three';

import vs from './glsl/Water.vs';
import fs from './glsl/Water.fs';

export default class Water extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(24, 24);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        tNormal: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Water';
  }
  start(tNormal) {
    this.material.uniforms.tNormal.value = tNormal;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
