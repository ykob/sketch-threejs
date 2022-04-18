import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/ImageFire.vs';
import fs from './glsl/ImageFire.fs';

export default class ImageFire extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        easeTransition: {
          type: 'f',
          value: 0
        },
        noiseTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'ImageFire';
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time, easeStep) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.easeTransition.value = easeStep;
  }
  resize(size) {
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, size.x / size.y),
      Math.min(1, size.y / size.x)
    );
    this.scale.copy(size);
  }
}
