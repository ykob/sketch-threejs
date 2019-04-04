import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/core.vs';
import fs from './glsl/core.fs';

export default class Core extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.SphereBufferGeometry(5, 32, 32);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        texture: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Core';
  }
  start(texture) {
    this.material.uniforms.texture.value = texture;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
