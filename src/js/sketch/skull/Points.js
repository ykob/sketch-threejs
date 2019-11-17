import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

const DURATION = 4;

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.IcosahedronBufferGeometry(6, 3);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        alpha: {
          type: 'f',
          value: 0
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
        noiseTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Points';
    this.time = 0;
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    this.time += time;

    this.material.uniforms.time.value += time;
    this.material.uniforms.alpha.value = (this.time % DURATION) / DURATION;
    this.rotation.set(
      0,
      this.material.uniforms.time.value,
      0
    );
  }
}
