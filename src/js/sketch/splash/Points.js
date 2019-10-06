import * as THREE from 'three';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.IcosahedronBufferGeometry(1, 6);

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
    this.scale.set(
      10,
      10,
      10
    );
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    this.time += time;

    const alpha = (this.time % 2) / 2;
    this.scale.set(
      alpha * 25,
      alpha * 25,
      alpha * 25
    );

    this.material.uniforms.time.value = this.time;
    this.material.uniforms.alpha.value = alpha;
  }
}
