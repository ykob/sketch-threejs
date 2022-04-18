import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

const DURATION = 4;

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.IcosahedronGeometry(1, 100);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        alpha: {
          value: 0
        },
        pixelRatio: {
          value: window.devicePixelRatio
        },
        noiseTex: {
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
  start(noiseTex, diff = 0) {
    this.time = diff * -DURATION;
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    this.time += time;

    const alpha = (this.time % DURATION) / DURATION;
    const scale = alpha * 30;
    this.scale.set(scale, scale, scale);

    this.material.uniforms.time.value += time;
    this.material.uniforms.alpha.value = alpha;
  }
}
