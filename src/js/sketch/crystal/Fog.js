import * as THREE from 'three';

import vs from './glsl/Fog.vs';
import fs from './glsl/Fog.fs';

export default class Fog extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(30, 10, 10);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        maskTex: {
          type: 't',
          value: null
        },
        fogTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Fog';
  }
  start(maskTex, fogTex) {
    this.material.uniforms.maskTex.value = maskTex;
    this.material.uniforms.fogTex.value = fogTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
