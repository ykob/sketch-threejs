import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/background.vs';
import fs from './glsl/background.fs';

export default class Background extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.SphereBufferGeometry(100, 12, 12);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        hexNext: {
          type: 'f',
          value: 0
        },
        hexPrev: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.BackSide,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Background';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
  setHex(hexNext) {
    let hexPrev = this.material.uniforms.hexNext.value;
    if (Math.abs(hexNext - hexPrev) > 0.5) hexPrev -= 1;

    this.material.uniforms.time.value = 0;
    this.material.uniforms.hexPrev.value = hexPrev;
    this.material.uniforms.hexNext.value = hexNext;
  }
}
