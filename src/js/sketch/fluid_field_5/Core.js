import * as THREE from 'three';

import vs from './glsl/core.vs';
import fs from './glsl/core.fs';

export default class Core extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.OctahedronBufferGeometry(30, 6);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        noiseTex: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Core';
  }
  start(noiseTex) {
    const { uniforms } = this.material;

    uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    const { uniforms } = this.material;

    uniforms.time.value += time;
  }
}
